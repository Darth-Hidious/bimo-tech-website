"use client";

import { useEffect, useRef, useState } from "react";
import { createGlobe, type Globe as GlobeApi, type GlobeView } from "@/lib/globe";

export type Place = { name: string; role: string; lat: number; lon: number; side?: "left" | "below" };

// From the Atlantic to central Europe, closing in on the way.
const FROM = { lon: -58, lat: 16, zoom: 0.9 };
const TO = { lon: 8, lat: 48.5, zoom: 2.25 };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The real Earth (WebGL 2, satellite map) turning to Europe as the section scrolls into view, with our
 * places pinned on it. The same globe as the PRISM site. Without WebGL 2 the places list beside it
 * carries the information on its own.
 */
export default function Globe({ places, label }: { places: Place[]; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pins = useRef<(HTMLSpanElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    let globe: GlobeApi | null = null;
    let raf = 0;
    let near = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const progress = () => {
      if (reduced.matches) return 1;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Turn while the globe travels from the bottom of the screen to just above the middle.
      return clamp01((vh - (r.top + r.height * 0.5)) / (0.55 * vh));
    };

    const frame = () => {
      raf = 0;
      if (!globe) return;
      const p = progress();
      const t = ease(p);
      const w = el.clientWidth;
      const h = el.clientHeight;
      const zoom = FROM.zoom + (TO.zoom - FROM.zoom) * t;
      const view: GlobeView = {
        lon: FROM.lon + (TO.lon - FROM.lon) * t,
        lat: FROM.lat + (TO.lat - FROM.lat) * t,
        cx: w / 2,
        cy: h / 2,
        r: 0.46 * Math.min(w, h) * zoom,
      };
      globe.draw(view);
      const arrived = p > 0.85;
      places.forEach((pl, i) => {
        const pin = pins.current[i];
        if (!pin) return;
        const q = globe!.project(view, pl.lat, pl.lon);
        pin.style.transform = `translate(${q.x.toFixed(1)}px, ${q.y.toFixed(1)}px)`;
        pin.dataset.show = arrived && q.front > 0.15 ? "true" : "false";
      });
    };
    const schedule = () => {
      if (!raf && near) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (globe || failed) return;
      globe = createGlobe(cv, "/img/earth/earth-s2cloudless-4096.webp", schedule);
      if (!globe) setFailed(true);
      else schedule();
    };

    // Load the 600 kB map only when the globe comes near, and only draw while it is on screen.
    const io = new IntersectionObserver(
      ([e]) => {
        near = e.isIntersecting;
        if (near) {
          start();
          schedule();
        }
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(el);
    const ro = new ResizeObserver(() => {
      globe?.resize();
      schedule();
    });
    ro.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(raf);
      globe?.destroy();
    };
  }, [places, failed]);

  if (failed) return null;

  return (
    <div ref={box} className="globe" role="img" aria-label={label}>
      <canvas ref={canvas} className="globe__canvas" aria-hidden="true" />
      {places.map((pl, i) => (
        <span
          key={pl.name}
          ref={(n) => {
            pins.current[i] = n;
          }}
          className={`globe__pin${pl.side ? ` globe__pin--${pl.side}` : ""}`}
          data-show="false"
          aria-hidden="true"
        >
          <i />
          <span className="globe__tag">
            <b>{pl.name}</b>
            <span>{pl.role}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
