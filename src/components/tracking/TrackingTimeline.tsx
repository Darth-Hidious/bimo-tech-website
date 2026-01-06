import type { QuoteRequest } from '@/lib/cms/types';

interface TrackingTimelineProps {
    status: QuoteRequest['status'];
    createdAt: number;
}

export default function TrackingTimeline({ status, createdAt }: TrackingTimelineProps) {
    return (
        <div>
            <h3 className="text-xl font-medium mb-12">Progression</h3>
            <div className="space-y-0 max-w-lg">
                <TimelineItem
                    active={true}
                    title="Request Received"
                    desc="We have received your request and files."
                    date={new Date(createdAt).toLocaleDateString()}
                />
                <TimelineItem
                    active={status !== 'pending'}
                    title="Engineering Review"
                    desc="Our engineers are analyzing your CAD files for manufacturability and preparing your custom quote."
                />
                <TimelineItem
                    active={['quoted', 'accepted', 'completed'].includes(status)}
                    title="Quote Ready"
                    desc="Pricing, lead times, and DFM feedback are available for your approval."
                />
                <TimelineItem
                    active={['accepted', 'completed'].includes(status)}
                    title="Production"
                    desc="Your parts are being manufactured in our facility."
                    last
                />
            </div>
        </div>
    );
}

function TimelineItem({ active, title, desc, date, last }: { active: boolean, title: string, desc: string, date?: string, last?: boolean }) {
    return (
        <div className={`relative pl-8 pb-12 ${last ? '' : 'border-l'} ${active ? 'border-green-500/30' : 'border-[#222]'}`}>
            <div className={`
                absolute -left-[5px] top-0 w-[9px] h-[9px] transition-all duration-500
                ${active ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-[#222]'}
            `}></div>

            <div className={`${active ? 'opacity-100' : 'opacity-40'} transition-opacity duration-500 -mt-1.5`}>
                <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg font-medium text-white">{title}</h4>
                    {date && <span className="text-[11px] font-mono text-[#666]">{date}</span>}
                </div>
                <p className="text-sm text-[#888] leading-relaxed max-w-md font-light">{desc}</p>
            </div>
        </div>
    );
}
