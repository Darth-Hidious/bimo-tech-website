"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { QuoteRequest } from '@/lib/cms/types';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Modular Components
import TrackingHeader from '@/components/tracking/TrackingHeader';
import TrackingDetails from '@/components/tracking/TrackingDetails';
import TrackingTimeline from '@/components/tracking/TrackingTimeline';
import TrackingChat from '@/components/tracking/TrackingChat';

export default function TrackingPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const token = searchParams.get('token');

    const [quote, setQuote] = useState<QuoteRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchQuote = async () => {
        try {
            const data = await cms.getQuote(id);
            if (!data) {
                setError('Order not found.');
                return;
            }
            // Simple security check
            if (data.trackingToken && data.trackingToken !== token) {
                setError('Invalid tracking link.');
                return;
            }
            setQuote(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load order.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchQuote();
    }, [id]);


    const handleSendMessage = async (message: string) => {
        if (!quote) return;

        // Optimistic update could go here, but for simplicity we wait
        await cms.addQuoteUpdate(id, {
            message,
            author: 'user'
        });

        // Refresh to show new message
        await fetchQuote();
    };

    if (loading) return (
        <div className="min-h-screen bg-[var(--bimo-bg-primary)] flex items-center justify-center text-white">
            <Loader2 className="animate-spin text-[var(--bimo-text-disabled)]" size={32} />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[var(--bimo-bg-primary)] flex items-center justify-center text-white flex-col gap-6">
            <AlertCircle className="text-red-900" size={48} />
            <h1 className="text-2xl font-light tracking-wide">{error}</h1>
            <Link href="/" className="text-sm uppercase tracking-widest border-b border-white pb-1 hover:text-gray-400 transition-colors">Return Home</Link>
        </div>
    );

    if (!quote) return null;

    return (
        <main className="min-h-screen bg-[var(--bimo-bg-primary)] text-white pt-40">
            <div className="max-w-7xl mx-auto px-6 pb-32">

                <TrackingHeader id={id} quote={quote} />

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-12 border-t border-[var(--bimo-border)] pt-12">

                    {/* Left Panel: Details & Timeline */}
                    <div className="lg:col-span-2 space-y-20">
                        <TrackingDetails quote={quote} />
                        <TrackingTimeline status={quote.status} createdAt={quote.createdAt} />
                    </div>

                    {/* Right Panel: Updates Chat */}
                    {/* We pass the updates to the component which handles its own sticky state */}
                    <TrackingChat
                        updates={quote.updates}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>
            <Footer />
        </main>
    );
}
