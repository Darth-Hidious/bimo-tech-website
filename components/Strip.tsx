"use client";

import { useRef } from "react";

// A horizontal strip of cards: swipe on a phone, arrows or scroll on a desktop.
// Without JavaScript it is still a scrollable row.
export default function Strip({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > *");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  return (
    <div className="strip">
      <div className="strip__controls">
        <button type="button" className="strip__btn" onClick={() => move(-1)} aria-label={`Previous: ${label}`}>
          ←
        </button>
        <button type="button" className="strip__btn" onClick={() => move(1)} aria-label={`Next: ${label}`}>
          →
        </button>
      </div>
      <div className="strip__track" ref={ref} role="list" aria-label={label} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
