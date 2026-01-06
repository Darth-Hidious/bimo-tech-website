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
            <div className="sticky top-24 h-[calc(100vh-8rem)] flex flex-col pt-8 pb-8 rounded-2xl bg-[#080808] border border-[#222]">
                <div className="flex items-center justify-between mb-6 px-6">
                    <h3 className="text-lg font-medium">Updates Channel</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#444] uppercase tracking-wider">Live</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 px-6 space-y-6 custom-scrollbar">
                    {!updates?.length && (
                        <div className="h-full flex flex-col items-center justify-center text-[#333] italic text-sm text-center px-4">
                            <p className="mb-2">No messages yet.</p>
                            <p className="text-xs text-[#222]">This is a private channel between you and our engineering team.</p>
                        </div>
                    )}

                    {updates?.map((update, i) => (
                        <div key={i} className={`flex flex-col ${update.author === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`
                                max-w-[90%] p-3 text-sm leading-relaxed relative group rounded-lg
                                ${update.author === 'user'
                                    ? 'bg-[#1a1a1a] text-[#ddd]'
                                    : 'bg-black border border-[#222] text-[#888]'}
                            `}>
                                {update.message}
                            </div>
                            <span className="text-[10px] text-[#333] mt-1.5 font-mono uppercase tracking-wider group-hover:text-[#555] transition-colors">
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
                        className="w-full bg-[#111] border border-[#333] rounded-lg p-3 pr-10 text-sm text-white focus:outline-none focus:border-[#555] transition-all placeholder-[#444]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !newMessage}
                        className="absolute right-9 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors disabled:opacity-30"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
