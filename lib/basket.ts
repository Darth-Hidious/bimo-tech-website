"use client";

// Quote basket kept in the visitor's own browser. Nothing leaves the page
// until they send the quote form.
const KEY = "bimo-quote";
const EVENT = "bimo-quote-change";

export function readBasket(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(items: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage blocked: the basket simply does not persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function addToBasket(item: string) {
  const items = readBasket();
  if (!items.includes(item)) write([...items, item]);
}

export function removeFromBasket(item: string) {
  write(readBasket().filter((x) => x !== item));
}

/** Empties the basket, once its items have been sent. */
export function clearBasket() {
  write([]);
}

export function onBasketChange(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
