"use client";

import { useEffect, useState } from "react";

export function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const word = words[index % words.length];
    const done = !deleting && text === word;
    const empty = deleting && text === "";

    const delay = done ? 1800 : empty ? 300 : deleting ? 35 : 70;
    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return (
    <span className="whitespace-nowrap">
      <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
        {text}
      </span>
      <span className="ml-0.5 inline-block w-[2px] animate-blink bg-cyan align-middle" style={{ height: "1em" }} />
    </span>
  );
}
