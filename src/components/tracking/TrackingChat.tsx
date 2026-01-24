import { useState, useRef, useEffect } from 'react';
import type { QuoteRequest } from '@/lib/cms/types';
import { Send } from 'lucide-react';

interface TrackingChatProps {
    updates: QuoteRequest['updates'];
    onSendMessage: (message: string) => Promise<void>;
}

export default function TrackingChat({ updates, onSendMessage }: TrackingChatProps) {
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [updates]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            await onSendMessage(newMessage);
            setNewMessage('');
        } catch (err) {
            console.error(err);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="lg:col-span-1">
            {/* Sticky container - Top 24 to clear the 80px Header */}
            <div className="sticky top-24 h-[calc(100vh-8rem)] flex flex-col pt-8 pb-8 rounded-2xl bg-[var(--bimo-bg-secondary)] border border-[var(--bimo-border)]">
                <div className="flex items-center justify-between mb-6 px-6">
                    <h3 className="text-lg font-medium">Updates Channel</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--bimo-text-disabled)] uppercase tracking-wider">Live</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 px-6 space-y-6 custom-scrollbar">
                    {!updates?.length && (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--bimo-border)] italic text-sm text-center px-4">
                            <p className="mb-2">No messages yet.</p>
                            <p className="text-xs text-[var(--bimo-border)]">This is a private channel between you and our engineering team.</p>
                        </div>
                    )}

                    {updates?.map((update, i) => (
                        <div key={i} className={`flex flex-col ${update.author === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`
                                max-w-[90%] p-3 text-sm leading-relaxed relative group rounded-lg
                                ${update.author === 'user'
                                    ? 'bg-[var(--bimo-bg-elevated)] text-[var(--bimo-text-primary)]'
                                    : 'bg-black border border-[var(--bimo-border)] text-[var(--bimo-text-secondary)]'}
                            `}>
                                {update.message}
                            </div>
                            <span className="text-[10px] text-[var(--bimo-border)] mt-1.5 font-mono uppercase tracking-wider group-hover:text-[var(--bimo-text-secondary)] transition-colors">
                                {update.author === 'user' ? 'You' : 'Bimo'} • {new Date(update.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="relative mt-auto px-6">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="w-full bg-[var(--bimo-bg-secondary)] border border-[var(--bimo-border)] rounded-lg p-3 pr-10 text-sm text-white focus:outline-none focus:border-[var(--bimo-text-secondary)] transition-all placeholder-[var(--bimo-text-disabled)]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !newMessage}
                        className="absolute right-9 top-1/2 -translate-y-1/2 text-[var(--bimo-text-disabled)] hover:text-white transition-colors disabled:opacity-30"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
