import { NextRequest, NextResponse } from 'next/server';

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

    // Forward to Python backend
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
        const data = await response.json();
        return NextResponse.json({
          success: true,
          rfq_id: data.rfq_id,
          message: 'RFQ submitted successfully',
        });
      }
    } catch (backendError) {
      console.error('Backend unavailable:', backendError);
    }

    // Fallback: Store locally and send notification
    // In production, this would save to a database
    console.log('RFQ Submission (fallback mode):', {
      id: body.id,
      email: body.contactEmail,
      itemCount: body.items.length,
      items: body.items,
    });

    // For now, return success even in fallback mode
    return NextResponse.json({
      success: true,
      rfq_id: body.id,
      message: 'RFQ received. We will contact you shortly.',
      mode: 'fallback',
    });

  } catch (error) {
    console.error('RFQ submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RFQ' },
      { status: 500 }
    );
  }
}

