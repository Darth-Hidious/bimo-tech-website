"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Loader2, ShoppingCart, Plus, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { useRFQ } from '@/context/RFQContext';
import { searchMaterials } from '@/data/materials';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'product_suggestion' | 'rfq_confirmation';
  data?: any;
}

interface QuickAction {
  label: string;
  message: string;
  icon?: string;
}

const quickActions: QuickAction[] = [
  { label: 'Get a quote', message: 'I would like to request a quote for materials', icon: '📋' },
  { label: 'Tungsten', message: 'What tungsten products do you offer?', icon: '⚡' },
  { label: 'Titanium', message: 'Tell me about your titanium products', icon: '🔧' },
  { label: 'Sputtering targets', message: 'Tell me about your sputtering targets', icon: '🎯' },
];

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! I'm Bimo, your materials specialist. I can help you find the right materials, get specifications, or start a quote request. What are you looking for today?"
};

export default function ChatWidget() {
  const { addItem, itemCount, setBasketOpen } = useRFQ();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleAddToRFQ = (material: string, form: string = '', spec: string = '') => {
    addItem({
      material,
      form,
      specification: spec,
      quantity: 'To be specified',
    });
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Added **${material}** to your RFQ basket! You have ${itemCount + 1} item${itemCount === 0 ? '' : 's'}. Want to add more, or ready to submit?`,
      type: 'rfq_confirmation',
    }]);
  };

  const processLocalSearch = (query: string): Message | null => {
    const results = searchMaterials(query);
    if (results.length > 0) {
      const material = results[0];
      const propsText = Object.entries(material.properties)
        .slice(0, 3)
        .map(([k, v]) => `• ${k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ')}: ${v}`)
        .join('\n');
      
      return {
        role: 'assistant',
        content: `**${material.name}** (${material.symbol})\n\n${material.description.substring(0, 150)}...\n\n${propsText}\n\nWant me to add this to your quote?`,
        type: 'product_suggestion',
        data: material,
      };
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setShowQuickActions(false);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Check for local material search first
    const localResult = processLocalSearch(userMessage);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          context: {
            hasItemsInBasket: itemCount > 0,
            basketCount: itemCount,
          }
        })
      });

      if (!response.ok) {
        if (localResult) {
          setMessages(prev => [...prev, localResult]);
        } else {
          throw new Error('Backend unavailable');
        }
      } else {
        const data = await response.json();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          type: data.type || 'text',
          data: data.data,
        }]);
      }
    } catch (error) {
      console.error(error);
      if (localResult) {
        setMessages(prev => [...prev, localResult]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I can help you find materials! Try asking about tungsten, titanium, rhenium, or any of our specialty metals." 
        }]);
        setShowQuickActions(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.message);
    setTimeout(() => {
      const form = document.querySelector('form[data-chat-form]') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }, 100);
  };

  // Size classes based on expanded state
  const sizeClasses = isExpanded 
    ? 'w-[90vw] max-w-[800px] h-[85vh] max-h-[750px]' 
    : 'w-[420px] md:w-[460px] h-[640px]';

  return (
    <>
      {/* Backdrop when open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 font-sans">
        {/* Floating button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            group relative overflow-hidden
            ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
            transition-all duration-300 ease-out
          `}
          aria-label="Open chat"
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />
          
          {/* Button background */}
          <span 
            className="relative flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full shadow-2xl hover:shadow-xl transition-shadow"
            style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.2)' }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-semibold text-sm">Chat with Bimo</span>
            {itemCount > 0 && (
              <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </span>
        </button>

        {/* Chat window */}
        <div 
          className={`
            ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}
            ${sizeClasses}
            fixed bottom-5 right-5 md:bottom-8 md:right-8
            bg-[#0a0a0a] border border-white/10 rounded-3xl
            flex flex-col overflow-hidden
            transition-all duration-300 ease-out
            shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)]
          `}
        >
          {/* Header */}
          <div className="px-6 py-5 md:px-7 md:py-6 border-b border-white/[0.06] flex justify-between items-center bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="flex items-center gap-4">
              {/* Bimo Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-300 flex items-center justify-center text-black font-bold text-xl shadow-lg">
                  B
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
              </div>
              <div>
                <span className="font-semibold text-white block text-[17px]">Bimo</span>
                <span className="text-sm text-white/40 mt-0.5 block">Materials specialist</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {itemCount > 0 && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setBasketOpen(true);
                  }}
                  className="relative p-3 hover:bg-white/[0.06] rounded-xl transition-colors"
                  title="View RFQ basket"
                >
                  <ShoppingCart size={20} className="text-white/60" />
                  <span className="absolute top-1.5 right-1.5 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-3 hover:bg-white/[0.06] rounded-xl transition-colors hidden md:block"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 size={18} className="text-white/40" />
                ) : (
                  <Maximize2 size={18} className="text-white/40" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-white/[0.06] rounded-xl transition-colors"
                title="Close"
              >
                <X size={20} className="text-white/40" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 md:px-7 md:py-7 space-y-6 scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-sm font-bold mr-4 mt-1 flex-shrink-0">
                    B
                  </div>
                )}
                <div
                  className={`max-w-[82%] ${
                    msg.role === 'user'
                      ? 'bg-white text-black rounded-2xl rounded-br-md px-5 py-4'
                      : 'bg-white/[0.04] rounded-2xl rounded-bl-md px-5 py-4 text-white/90'
                  }`}
                >
                  <div 
                    className="text-[15px] leading-[1.7] whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                  
                  {/* Add to RFQ button for product suggestions */}
                  {msg.type === 'product_suggestion' && msg.data && (
                    <button
                      onClick={() => handleAddToRFQ(msg.data.name, '', '')}
                      className="mt-5 flex items-center gap-2.5 bg-white text-black px-5 py-3 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Plus size={18} />
                      Add to quote
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-sm font-bold mr-4 mt-1 flex-shrink-0">
                  B
                </div>
                <div className="bg-white/[0.04] rounded-2xl rounded-bl-md px-5 py-4 flex items-center gap-4 text-white/50">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-white/30">Bimo is typing...</span>
                </div>
              </div>
            )}
            
            {/* Quick actions */}
            {showQuickActions && messages.length <= 2 && !loading && (
              <div className="pt-5 mt-2">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-4 font-medium">Suggested</p>
                <div className="flex flex-wrap gap-3">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action)}
                      className="px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/70 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-2.5"
                    >
                      {action.icon && <span className="text-base">{action.icon}</span>}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* RFQ status bar */}
          {itemCount > 0 && (
            <div className="mx-6 md:mx-7 mb-4">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setBasketOpen(true);
                }}
                className="w-full flex items-center justify-between text-sm bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl px-5 py-4 transition-colors"
              >
                <span className="text-white/50 flex items-center gap-3">
                  <ShoppingCart size={18} />
                  {itemCount} item{itemCount !== 1 ? 's' : ''} ready for quote
                </span>
                <span className="text-white font-medium flex items-center gap-1.5 text-sm">
                  Submit <ChevronRight size={16} />
                </span>
              </button>
            </div>
          )}

          {/* Input */}
          <form data-chat-form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 md:px-7 md:pb-7 border-t border-white/[0.04]">
            <div className="flex gap-3 bg-white/[0.04] rounded-2xl p-2.5 border border-white/[0.06] focus-within:border-white/[0.15] transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about materials..."
                className="flex-1 bg-transparent px-4 py-3 text-[15px] outline-none text-white placeholder-white/30"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed text-black disabled:text-white/30 p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <p className="text-xs text-white/20 text-center mt-4">
              Bimo can help with materials, specs & quotes
            </p>
          </form>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes slide-in-from-bottom-2 {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slide-in-from-bottom-2 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
