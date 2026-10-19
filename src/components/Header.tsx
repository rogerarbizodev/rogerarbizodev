"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const mid = window.innerHeight * 0.4;
      let current = "";
      for (const { id } of links) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < mid) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 ${
          scrolled
            ? "border-line bg-bg/60 shadow-[0_8px_40px_-12px_rgb(139_92_246/0.5)] backdrop-blur-xl"
            : "border-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-3 pl-1">
          <span className="relative flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan via-violet to-pink p-px">
            <span className="flex size-full items-center justify-center rounded-full bg-bg font-mono text-xs font-semibold">
              {initials}
            </span>
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:block">{profile.name}</span>
        </a>
        <ul className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.id} className={l.id === "about" ? "hidden sm:block" : undefined}>
              <a
                href={`#${l.id}`}
                className={`relative rounded-full px-3 py-1.5 transition-colors sm:px-4 ${
                  active === l.id ? "bg-white/10 text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
