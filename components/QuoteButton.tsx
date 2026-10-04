"use client";

import { useEffect, useState } from "react";
import { addToBasket, onBasketChange, readBasket } from "@/lib/basket";

export default function QuoteButton({ item, className = "btn btn--primary" }: { item: string; className?: string }) {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    const sync = () => setAdded(readBasket().includes(item));
    sync();
    return onBasketChange(sync);
  }, [item]);
  return (
    <button type="button" className={className} onClick={() => addToBasket(item)} aria-pressed={added}>
      {added ? "In your quote ✓" : "Add to quote"}
    </button>
  );
}
