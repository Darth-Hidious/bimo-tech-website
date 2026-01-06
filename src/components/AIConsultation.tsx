"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Bot, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { ManufacturingService } from '@/lib/cms/types';
import styles from './AIConsultation.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    recommendations?: ServiceRecommendation[];
}

interface ServiceRecommendation {
    service: ManufacturingService;
    matchScore: number;
    reason: string;
}

interface AIConsultationProps {
    services: ManufacturingService[];
    onServiceSelect?: (serviceId: string) => void;
}

const quickPrompts = [
    "I need CNC machining for aluminum parts",
    "What's best for rapid prototyping?",
    "Sheet metal fabrication quote",
    "Complex geometry manufacturing",
    "High-precision components",
];

export default function AIConsultation({ services, onServiceSelect }: AIConsultationProps) {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm Bimo, your manufacturing AI assistant. Tell me about your project and I'll recommend the best services for your needs.",
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const analyzeAndRecommend = (userMessage: string): ServiceRecommendation[] => {
        const msg = userMessage.toLowerCase();
        const recommendations: ServiceRecommendation[] = [];

        // Keyword matching for service recommendations
        const serviceKeywords: Record<string, string[]> = {
            'cnc-milling': ['milling', 'cnc', 'complex', 'geometry', '5-axis', '5 axis', 'aluminum', 'precision', 'intricate'],
            'cnc-turning': ['turning', 'cylindrical', 'lathe', 'round', 'shaft', 'rod', 'rotational'],
            'sheet-metal': ['sheet', 'metal', 'bend', 'laser', 'cut', 'fabrication', 'enclosure', 'bracket', 'panel'],
            '3d-printing': ['3d print', 'additive', 'prototype', 'rapid', 'plastic', 'quick'],
            'injection-molding': ['injection', 'mold', 'plastic', 'mass production', 'volume', 'polymer'],
            'wire-edm': ['edm', 'wire', 'electrical discharge', 'hardened', 'conductive'],
        };

        services.forEach(service => {
            const keywords = serviceKeywords[service.id] || [];
            const matchingKeywords = keywords.filter(kw => msg.includes(kw));

            if (matchingKeywords.length > 0) {
                const score = Math.min(95, 60 + (matchingKeywords.length * 12));
                let reason = '';

                if (msg.includes('aluminum') && service.materials?.includes('Aluminum')) {
                    reason = `Perfect for aluminum with ${service.toleranceMin} tolerance`;
                } else if (msg.includes('precision') || msg.includes('complex')) {
                    reason = `Handles complex geometries up to ${service.maxPartSize}`;
                } else if (msg.includes('prototype') || msg.includes('rapid')) {
                    reason = `Fast turnaround from ${service.minLeadTimeDays} days`;
                } else {
                    reason = service.tagline || `Ideal for your ${matchingKeywords[0]} requirements`;
                }

                recommendations.push({
                    service,
                    matchScore: score,
                    reason,
                });
            }
        });

        // Sort by match score and limit to top 3
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        // If no specific matches, suggest top services
        if (recommendations.length === 0 && services.length > 0) {
            const topServices = services.slice(0, 3);
            topServices.forEach((service, idx) => {
                recommendations.push({
                    service,
                    matchScore: 75 - (idx * 5),
                    reason: `Popular choice: ${service.tagline}`,
                });
            });
        }

        return recommendations.slice(0, 3);
    };

    const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
        if (e) e.preventDefault();
        const text = overrideText || input.trim();
        if (!text || loading) return;

        setInput('');
        setLoading(true);

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: text }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: text }],
                    context: { requestServiceRecommendations: true }
                })
            });

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            const recommendations = analyzeAndRecommend(text);

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                recommendations: recommendations.length > 0 ? recommendations : undefined,
            }]);

        } catch (error) {
            // Fallback with local analysis
            const recommendations = analyzeAndRecommend(text);
            let fallbackResponse = "Based on your project details, here are my top recommendations:";

            if (recommendations.length === 0) {
                fallbackResponse = "I'd be happy to help! Could you tell me more about your project? For example: what material, quantity, or specific manufacturing process are you considering?";
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: fallbackResponse,
                recommendations: recommendations.length > 0 ? recommendations : undefined,
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.aiConsultationSection}>
            <div className={styles.glowBorder} />

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.aiIcon}>
                    <Bot />
                </div>
                <div className={styles.headerInfo}>
                    <h3>
                        Bimo AI Consultation
                        <span className={styles.liveIndicator} />
                    </h3>
                    <p>Describe your project for personalized service recommendations</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                        <span dangerouslySetInnerHTML={{ __html: msg.content }} />

                        {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className={styles.recommendations}>
                                {msg.recommendations.map((rec, i) => (
                                    <Link
                                        key={i}
                                        href={`/${language}/quote?service=${rec.service.id}`}
                                        className={styles.recommendationCard}
                                        onClick={() => onServiceSelect?.(rec.service.id)}
                                    >
                                        <div className={styles.recommendationBadge}>
                                            <Sparkles />
                                            Bimo Recommends
                                            <span className={styles.matchScore}>{rec.matchScore}% match</span>
                                        </div>
                                        <h4>{rec.service.name}</h4>
                                        <p>{rec.reason}</p>
                                        <div className={styles.recommendationMeta}>
                                            <span>From €{rec.service.startingPrice}</span>
                                            <span>{rec.service.minLeadTimeDays}+ days</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length < 4 && !loading && (
                <div className={styles.quickActions}>
                    {quickPrompts.slice(0, 4).map((prompt, i) => (
                        <button
                            key={i}
                            className={styles.chip}
                            onClick={() => handleSubmit(undefined, prompt)}
                        >
                            <Zap size={12} style={{ marginRight: 4, opacity: 0.5 }} />
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        placeholder="Describe your manufacturing project..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        ref={inputRef}
                    />
                </div>
                <button
                    className={styles.sendBtn}
                    onClick={() => handleSubmit()}
                    disabled={loading || !input.trim()}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
