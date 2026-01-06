"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Sparkles, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    toolCalls?: any[];
}

interface BimoAIChatProps {
    language: string;
    onAutoFill?: (data: any) => void;
}

export default function BimoAIChat({ language, onAutoFill }: BimoAIChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "I'm Bimo, your manufacturing AI. Describe your project and I'll recommend the best services." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    const handleSubmit = async (text?: string) => {
        const query = text || input.trim();
        if (!query || loading) return;
        setInput('');
        setLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: query }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, { role: 'user', content: query }] })
            });
            const data = await res.json();

            // Check for tool calls
            if (data.toolCalls && data.toolCalls.length > 0) {
                const fillFormCall = data.toolCalls.find((tc: any) => tc.toolName === 'fillQuoteForm');
                if (fillFormCall && onAutoFill) {
                    // Notify user
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: data.response || "I've updated the form with your details. Please review them below.",
                    }]);

                    // Execute auto-fill
                    onAutoFill(fillFormCall.args);
                    setLoading(false);
                    return;
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the server. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const quickPrompts = ["CNC machining for aluminum", "50 units", "High precision 6061"];

    return (
        <div style={{ border: '1px solid #222', marginBottom: '40px' }}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#0a0a0a',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bot size={20} style={{ color: '#888' }} />
                    <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Bimo AI Consultation</span>
                    <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span>
                </div>
                <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#888' }} />
            </button>

            {isExpanded && (
                <>
                    {/* Messages */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '20px 24px', borderTop: '1px solid #222' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '14px', color: msg.role === 'user' ? '#fff' : '#bbb', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10px', color: '#666', marginRight: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {msg.role === 'user' ? 'You' : 'Bimo'}
                                    </span>
                                    {msg.content}
                                </p>
                            </div>
                        ))}
                        {loading && <p style={{ fontSize: '12px', color: '#666' }}>Bimo is thinking...</p>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick prompts */}
                    {messages.length < 4 && !loading && (
                        <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {quickPrompts.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSubmit(p)}
                                    style={{
                                        padding: '6px 12px',
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        color: '#999',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >{p}</button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{ display: 'flex', gap: '8px', padding: '16px 24px', borderTop: '1px solid #222', background: '#0a0a0a' }}>
                        <input
                            type="text"
                            placeholder="Describe your manufacturing project..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                background: '#000',
                                border: '1px solid #333',
                                color: '#fff',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading || !input.trim()}
                            style={{
                                padding: '12px 16px',
                                background: input.trim() ? '#fff' : '#333',
                                border: 'none',
                                color: input.trim() ? '#000' : '#666',
                                cursor: input.trim() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
