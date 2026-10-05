"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";

export type Slide = { src: string; alt: string; n: string; title: string };

const EVERY = 6000; // ms per photo

/**
 * The hero's photographs: the path of the metal, one stop after another, crossfading behind the
 * headline. Without JavaScript the first photo stays. Reduced motion: no autoplay, no zoom.
 */
export default function HeroSlides({ slides }: { slides: Slide[] }) {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false); // paused while the pointer or focus is on the controls

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || hold) return;
    const id = window.setTimeout(() => setI((x) => (x + 1) % slides.length), EVERY);
    return () => window.clearTimeout(id);
  }, [i, playing, hold, slides.length]);

  const s = slides[i];
  return (
    <>
      <div className="hero__slides" aria-hidden="true">
        {slides.map((sl, k) => (
          <img
            key={sl.src}
            className={`hero__img${k === i ? " is-on" : ""}`}
            src={sl.src}
            alt=""
            loading={k === 0 ? "eager" : "lazy"}
            fetchPriority={k === 0 ? "high" : undefined}
            decoding="async"
          />
        ))}
      </div>
      <div className="hero__shade" />
      <div
        className="hero__nav wrap"
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
      >
        <p className="hero__caption" aria-live={playing ? "off" : "polite"}>
          <span className="mono">{s.n}</span> {s.title}
          <span className="visually-hidden">: {s.alt}</span>
        </p>
        <div className="hero__dots">
          {slides.map((sl, k) => (
            <button
              key={sl.src}
              type="button"
              className={`hero__dot${k === i ? " is-on" : ""}${k === i && playing && !hold ? " is-running" : ""}`}
              aria-label={t("Photo {n} of {total}: {title}", { n: k + 1, total: slides.length, title: sl.title })}
              aria-current={k === i ? "true" : undefined}
              onClick={() => setI(k)}
              style={{ ["--every" as string]: `${EVERY}ms` }}
            >
              <span />
            </button>
          ))}
          <button type="button" className="hero__play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? t("Pause the photos") : t("Play the photos")}>
            {playing ? "❚❚" : "▶"}
          </button>
        </div>
      </div>
    </>
  );
}
