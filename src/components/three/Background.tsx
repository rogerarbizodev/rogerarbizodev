"use client";

import dynamic from "next/dynamic";

// WebGL only runs in the browser; load the scene after hydration.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function Background() {
  return (
    <>
      <Scene />
      {/* Light layers sit above the canvas but below content. */}
      <div className="aurora" aria-hidden>
        <span className="aurora-a" />
        <span className="aurora-b" />
        <span className="aurora-c" />
      </div>
      <div className="grid-bg" aria-hidden />
      <div className="spotlight" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
    </>
  );
}
