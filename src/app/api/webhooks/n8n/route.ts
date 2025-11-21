import { NextResponse } from 'next/server';
// import { db } from '@/lib/firebase';
// import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        console.log('Received webhook data from n8n:', data);

        // TODO: Save to Firestore
        // await addDoc(collection(db, 'contacts'), {
        //   ...data,
        //   createdAt: new Date().toISOString(),
        //   source: 'whatsapp_agent'
        // });

        return NextResponse.json({ success: true, message: 'Data received' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
}
