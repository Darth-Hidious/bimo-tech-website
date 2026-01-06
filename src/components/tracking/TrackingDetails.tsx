import type { QuoteRequest } from '@/lib/cms/types';

interface TrackingDetailsProps {
    quote: QuoteRequest;
}

export default function TrackingDetails({ quote }: TrackingDetailsProps) {
    return (
        <div className="grid md:grid-cols-2 gap-20 mb-24">
            <div>
                <h3 className="text-xl font-medium mb-8">Specifications</h3>
                <div className="space-y-6">
                    <DetailRow label="Process" value={quote.serviceId} />
                    <DetailRow label="Material" value={quote.materialId} />
                    <DetailRow label="Quantity" value={`${quote.quantity} units`} />
                </div>
            </div>
            <div>
                <h3 className="text-xl font-medium mb-8">Contact</h3>
                <div className="space-y-6">
                    <DetailRow label="Name" value={quote.customerName} />
                    <DetailRow label="Email" value={quote.customerEmail} />
                    <DetailRow label="Company" value={quote.company || '-'} />
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-baseline justify-between border-b border-[#111] pb-3">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#555] font-medium">{label}</span>
            <span className="text-sm text-[#eee] capitalize">{value}</span>
        </div>
    );
}
