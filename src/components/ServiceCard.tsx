"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Check } from 'lucide-react';
import type { ManufacturingService } from '@/lib/cms/types';
import * as LucideIcons from 'lucide-react';

interface ServiceCardProps {
    service: ManufacturingService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const { language, t } = useLanguage();

    // Dynamically resolve icon
    const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Settings;

    return (
        <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-none p-8 flex flex-col h-full hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image Header (if exists) */}
            {service.imageUrl && (
                <div className="h-48 w-[calc(100%+4rem)] -mx-8 -mt-8 mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-8 z-20">
                        <div className="p-2 bg-blue-600/90 backdrop-blur-sm w-fit mb-2">
                            <IconComponent size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            )}

            {!service.imageUrl && (
                <div className="mb-6 relative z-10">
                    <div className="p-3 bg-blue-600/10 border border-blue-500/20 w-fit text-blue-400 group-hover:text-blue-300 group-hover:border-blue-500/50 transition-colors">
                        <IconComponent size={24} />
                    </div>
                </div>
            )}

            <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-xl font-light text-white mb-3 tracking-wide">{service.name}</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed line-clamp-3">{service.description}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-8 text-xs border-t border-b border-white/5 py-4">
                    <div>
                        <span className="block text-gray-600 uppercase tracking-widest mb-1 font-medium text-[10px]">Lead Time</span>
                        <span className="text-gray-300">{service.minLeadTimeDays} days</span>
                    </div>
                    <div>
                        <span className="block text-gray-600 uppercase tracking-widest mb-1 font-medium text-[10px]">Price</span>
                        <span className="text-gray-300">from €{service.startingPrice.toFixed(0)}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-2">
                    <Link
                        href={`/${language}/quote?service=${service.id}`}
                        className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group-hover:gap-3 transition-all"
                    >
                        Configure & Quote
                        <ArrowRight size={14} className="text-blue-500" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
