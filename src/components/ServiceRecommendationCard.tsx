"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Sparkles, Check, Clock, Coins } from 'lucide-react';
import type { ManufacturingService } from '@/lib/cms/types';
import * as LucideIcons from 'lucide-react';

interface ServiceRecommendationCardProps {
    service: ManufacturingService;
    matchScore?: number;
    reason?: string;
    isRecommended?: boolean;
}

export default function ServiceRecommendationCard({
    service,
    matchScore,
    reason,
    isRecommended = false
}: ServiceRecommendationCardProps) {
    const { language } = useLanguage();
    const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Settings;

    return (
        <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-none flex flex-col h-full overflow-hidden transition-all duration-500 hover:border-blue-500/30">
            {/* AI Recommendation Badge */}
            {isRecommended && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 z-10" />
            )}

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image Header */}
            {service.imageUrl && (
                <div className="h-40 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {isRecommended && (
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-sm">
                            <Sparkles size={12} className="text-white" />
                            <span className="text-[11px] font-medium text-white uppercase tracking-wider">AI Recommended</span>
                        </div>
                    )}
                    {matchScore && (
                        <div className="absolute top-3 right-3 z-20 px-2.5 py-1.5 bg-black/70 backdrop-blur-sm rounded-sm">
                            <span className="text-[12px] font-medium text-green-400">{matchScore}% match</span>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col p-6">
                {/* Icon (if no image) */}
                {!service.imageUrl && (
                    <div className="mb-4 relative z-10 flex items-center justify-between">
                        <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 w-fit text-blue-400 group-hover:text-blue-300 group-hover:border-blue-500/50 transition-colors">
                            <IconComponent size={22} />
                        </div>
                        {isRecommended && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-sm">
                                <Sparkles size={12} className="text-blue-400" />
                                <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">AI Pick</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Title & Description */}
                <h3 className="text-lg font-medium text-white mb-2 tracking-wide">{service.name}</h3>

                {reason ? (
                    <p className="text-sm text-blue-300/80 mb-4 leading-relaxed italic">"{reason}"</p>
                ) : (
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">{service.description}</p>
                )}

                {/* Features Preview */}
                {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {service.features.slice(0, 3).map((feature, i) => (
                            <span key={i} className="flex items-center gap-1 text-[11px] text-gray-500 uppercase tracking-wider">
                                <Check size={10} className="text-green-500/60" />
                                {feature}
                            </span>
                        ))}
                    </div>
                )}

                {/* Specs Strip */}
                <div className="flex items-center gap-4 pt-4 mt-auto border-t border-white/5 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Coins size={12} className="text-gray-600" />
                        <span>From €{service.startingPrice}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock size={12} className="text-gray-600" />
                        <span>{service.minLeadTimeDays}+ days</span>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href={`/${language}/quote?service=${service.id}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-white/90 bg-white/5 border border-white/10 hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-white transition-all"
                >
                    Get Quote
                    <ArrowRight size={14} className="text-blue-400" />
                </Link>
            </div>
        </div>
    );
}
