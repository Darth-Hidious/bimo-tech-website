"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, MessageSquare, X, ChevronUp, ShoppingCart } from 'lucide-react';
import { useRFQ } from '@/context/RFQContext';
import styles from './ChatWidget.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time?: string;
  type?: 'text' | 'product_suggestion' | 'rfq_confirmation';
  data?: any;
}

const suggestions = [
  "Tungsten Sheets availability",
  "Molybdenum Machining Services",
  "Request a Quote for Tantalum",
  "Aerospace Grade Titanium"
];

export default function ChatWidget() {
  const { addItem, itemCount } = useRFQ();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Bimo. I'm here to help you navigate our advanced refractory metals and manufacturing services.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      role: 'assistant',
      content: "Ask me about Tungsten, Molybdenum, or request a custom quote!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const text = overrideText || input.trim();
    if (!text || loading) return;

    if (!overrideText) setInput('');
    setLoading(true);

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', content: text, time }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: text }],
          context: { hasItemsInBasket: itemCount > 0, basketCount: itemCount }
        })
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: data.type,
        data: data.data
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Our topographic sheets utilize a <span class=\"" + styles.dataTag + "\">Cross-Weave Velvety Finish</span> that maintains a high strength-to-weight ratio. Should I request a spec sheet for you?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  /* Collision Detection Logic */
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const checkObstruction = () => {
      // Don't move if open
      if (isOpen) {
        setBottomOffset(0);
        return;
      }

      const trigger = document.querySelector(`.${styles.chatTrigger}`);
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Get elements at the center of the widget
      const elements = document.elementsFromPoint(x, y);

      // Look for text elements below the widget
      const isObstructing = elements.some(el => {
        // Ignore self and containers
        if (el.closest(`.${styles.bimoWidgetContainer}`)) return false;
        if (el.tagName === 'BODY' || el.tagName === 'HTML') return false;

        // Check if element is visible
        const style = window.getComputedStyle(el);
        if (style.opacity === '0' || style.visibility === 'hidden') return false;

        // Basic heuristics for "important content"
        // 1. Text tags
        const isTextTag = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'A', 'BUTTON'].includes(el.tagName);
        // 2. Non-empty text
        const hasText = (el.textContent?.trim().length || 0) > 0;

        return isTextTag && hasText;
      });

      if (isObstructing) {
        setBottomOffset(100); // Move up significantly to clear text
      } else {
        setBottomOffset(0);
      }
    };

    let timeoutId: NodeJS.Timeout;
    const throttledHandler = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        checkObstruction();
        timeoutId = undefined!;
      }, 100);
    };

    window.addEventListener('scroll', throttledHandler, { passive: true });
    window.addEventListener('resize', throttledHandler);

    // Initial check after mount
    setTimeout(checkObstruction, 1000);

    return () => {
      window.removeEventListener('scroll', throttledHandler);
      window.removeEventListener('resize', throttledHandler);
      clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <div
      className={styles.bimoWidgetContainer}
      style={{ transform: `translateY(${-bottomOffset}px)` }}
    >

      {/* Main Popup */}
      <div className={`${styles.bimoPopup} ${isOpen ? styles.active : ''}`}>
        <div className={styles.topoLayer}></div>

        <div className={styles.bimoHeader}>
          <div className={styles.avatarContainer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
            <div className={styles.statusDot}></div>
          </div>
          <div className={styles.headerInfo}>
            <h3>Bimo Chat AI</h3>
            <p>Bimo Tech <span className={styles.dataTag}>Gemini-2.0</span></p>
          </div>
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto text-white/50 hover:text-white transition-colors"
          >
            <ChevronUp size={20} className="rotate-180" />
          </button>
        </div>

        <div className={styles.chatContent}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.bot}`}>
              <span dangerouslySetInnerHTML={{ __html: msg.content }} />
              <span className={styles.messageTime}>{mounted ? msg.time : ''}</span>
            </div>
          ))}

          {loading && (
            <div className={`${styles.message} ${styles.bot}`}>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-150"></span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions / Quick Chips */}
        {messages.length < 5 && !loading && (
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSubmit(undefined, s)} className={styles.chip}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Ask about metals, services, or quotes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              ref={inputRef}
            />
          </div>
          <button className={styles.sendBtn} onClick={() => handleSubmit()}>
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Floating Trigger */}
      <div className={styles.chatTrigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.topoLayer}></div>
        {isOpen ? (
          <X size={28} />
        ) : (
          // Production Bimo Icon
          <svg width="32" height="32" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="p-0.5">
            <path d="M38.5 70C25.3759 70 18.8139 70 14.2137 66.6578C12.7281 65.5784 11.4216 64.2719 10.3422 62.7861C7 58.1861 7 51.624 7 38.5C7 25.3759 7 18.8139 10.3422 14.2137C11.4216 12.7281 12.7281 11.4216 14.2137 10.3422C18.8139 7 25.3759 7 38.5 7H40.25C51.7069 7 57.4353 7 61.6437 9.5788C63.9985 11.0218 65.9782 13.0016 67.4212 15.3563C70 19.5645 70 25.293 70 36.75" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60.9242 50.4125C61.6672 48.5292 64.3328 48.5292 65.0759 50.4125L65.2043 50.7391C67.0187 55.3395 70.6605 58.9812 75.2609 60.7956L75.5874 60.9241C77.4708 61.6671 77.4708 64.3327 75.5874 65.0758L75.2609 65.2042C70.6605 67.0186 67.0187 70.6604 65.2043 75.2608L65.0759 75.5873C64.3328 77.4707 61.6672 77.4707 60.9242 75.5873L60.7957 75.2608C58.9813 70.6604 55.3396 67.0186 50.7392 65.2042L50.4126 65.0758C48.5293 64.3327 48.5293 61.6671 50.4126 60.9241L50.7392 60.7956C55.3396 58.9812 58.9813 55.3395 60.7957 50.7391L60.9242 50.4125Z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M39.3047 57H23.8359L31.0312 23.1797H44.1797C46.1328 23.1797 47.8203 23.4922 49.2422 24.1172C50.6797 24.7422 51.7812 25.6094 52.5469 26.7188C53.3281 27.8125 53.7188 29.0859 53.7188 30.5391C53.7188 31.9922 53.3906 33.3203 52.7344 34.5234C52.0938 35.7109 51.2031 36.7188 50.0625 37.5469C48.9219 38.375 47.625 38.9688 46.1719 39.3281L46.1484 39.4453C47.9766 39.7734 49.4219 40.5625 50.4844 41.8125C51.5625 43.0625 52.1016 44.5391 52.1016 46.2422C52.1016 48.3359 51.5625 50.1953 50.4844 51.8203C49.4062 53.4297 47.9062 54.6953 45.9844 55.6172C44.0625 56.5391 41.8359 57 39.3047 57ZM36.0938 27.75L34.0547 37.2188H40.1484C41.6172 37.2188 42.9062 36.9844 44.0156 36.5156C45.1406 36.0469 46.0156 35.4062 46.6406 34.5938C47.2656 33.7656 47.5781 32.8125 47.5781 31.7344C47.5781 30.4375 47.1016 29.4531 46.1484 28.7812C45.1953 28.0938 43.8047 27.75 41.9766 27.75H36.0938ZM30.8672 52.1953H38.4141C39.8984 52.1953 41.2031 51.9375 42.3281 51.4219C43.4531 50.9062 44.3281 50.2031 44.9531 49.3125C45.5781 48.4219 45.8906 47.4062 45.8906 46.2656C45.8906 45.2812 45.6641 44.4531 45.2109 43.7812C44.7734 43.1094 44.1016 42.6016 43.1953 42.2578C42.2891 41.9141 41.1719 41.7422 39.8438 41.7422H33.1172L30.8672 52.1953Z" fill="white" />
          </svg>
        )}

        {itemCount > 0 && !isOpen && (
          <div className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full border border-black shadow-lg"></div>
        )}
      </div>

    </div>
  );
}
