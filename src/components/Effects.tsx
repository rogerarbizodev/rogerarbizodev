"use client";

import { useEffect } from "react";

/**
 * Global, render-less effects:
 * - cursor spotlight (--mx/--my on <html>)
 * - pointer-tracked border light on every .glow-card (--x/--y)
 * - scroll reveal for every .reveal element
 */
export function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let px = 0;
    let py = 0;

    const update = () => {
      frame = 0;
      root.style.setProperty("--mx", `${px}px`);
      root.style.setProperty("--my", `${py}px`);
      document.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", `${px - r.left}px`);
        card.style.setProperty("--y", `${py - r.top}px`);
      });
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
