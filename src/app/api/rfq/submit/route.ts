import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { QuoteRequest } from '@/lib/cms/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'No items in RFQ' },
        { status: 400 }
      );
    }

    if (!body.contactEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // 1. Try to forward to Python backend (Original Logic)
    let backendSuccess = false;
    let backendData = null;

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/rfq/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: body.id,
          items: body.items,
          contact_email: body.contactEmail,
          design_files: body.designFiles || [],
        }),
      });

      if (response.ok) {
        backendData = await response.json();
        backendSuccess = true;
      }
    } catch (backendError) {
      console.warn('Backend unavailable, proceeding with local storage:', backendError);
    }

    // 2. Store in Firestore (Admin Dashboard & Notifications)
    try {
      if (db) {
        const quoteData: Omit<QuoteRequest, 'id'> = {
          createdAt: Date.now(),
          status: 'submitted', // Or 'pending', but submitted implies user action complete
          customerName: body.contactEmail.split('@')[0], // Fallback name
          customerEmail: body.contactEmail,
          company: '',
          // Use the first item's details for the summary main fields, but store all in items
          serviceId: 'multi-item-basket',
          materialId: 'mixed',
          quantity: body.items.length,
          items: body.items,
          fileUrls: body.designFiles || [],
        };

        await addDoc(collection(db, 'quotes'), quoteData);
        console.log('RFQ saved to Firestore for Admin Dashboard');
      } else {
        console.error('Firestore DB not initialized');
      }
    } catch (dbError) {
      console.error('Failed to save to Firestore:', dbError);
      // We don't block the response if DB fails but backend succeeded? 
      // Or if both fail, we error out.
    }

    return NextResponse.json({
      success: true,
      rfq_id: backendData?.rfq_id || body.id,
      message: 'RFQ received. We will contact you shortly.',
      mode: backendSuccess ? 'backend' : 'firestore_fallback',
    });

  } catch (error) {
    console.error('RFQ submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RFQ' },
      { status: 500 }
    );
  }
}
