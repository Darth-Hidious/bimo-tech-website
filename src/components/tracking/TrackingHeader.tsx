import { Shield } from 'lucide-react';
import type { QuoteRequest } from '@/lib/cms/types';

interface TrackingHeaderProps {
    id: string;
    quote: QuoteRequest;
}

export default function TrackingHeader({ id, quote }: TrackingHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-[#666] font-medium">Order Tracking</span>
                    {quote.requestNda && (
                        <div className="flex items-center gap-2 border border-green-900/50 px-3 py-1 bg-green-900/10">
                            <Shield size={12} className="text-green-500" />
                            <span className="text-[10px] tracking-wider uppercase text-green-500 font-medium">NDA Active</span>
                        </div>
                    )}
                </div>
                <h1 className="text-5xl md:text-7xl font-medium leading-tight max-w-4xl tracking-tight">
                    Project <span className="text-[#333]">#{id.slice(0, 6)}</span>
                </h1>
            </div>

            <div className="flex items-center gap-16 border-t md:border-t-0 border-[#222] pt-8 md:pt-0">
                <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#666] mb-3">Status</p>
                    <p className="text-xl font-medium capitalize flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${quote.status === 'pending' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}></span>
                        {quote.status}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#666] mb-3">Submitted</p>
                    <p className="text-xl font-medium font-mono text-[#888]">{new Date(quote.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
