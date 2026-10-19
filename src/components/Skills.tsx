import { skills } from "@/data/profile";
import { Section } from "./Section";

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  // Duplicate the track so the -50% loop is seamless.
  const track = [...items, ...items];
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <ul
        className={`flex shrink-0 gap-4 pr-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {track.map((s, i) => (
          <li
            key={`${s}-${i}`}
            aria-hidden={i >= items.length}
            className="flex items-center gap-3 rounded-full border border-line bg-white/[0.03] px-5 py-2.5 text-sm whitespace-nowrap text-fg/90 backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-gradient-to-r from-cyan to-violet" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  const all = skills.flatMap((g) => g.items);
  const half = Math.ceil(all.length / 2);

  return (
    <Section
      id="skills"
      index="03"
      eyebrow="Toolkit"
      title={
        <>
          Skills &amp; <span className="text-gradient">technologies</span>
        </>
      }
    >
      <div className="reveal -mx-4 space-y-4 sm:-mx-6">
        <Marquee items={all.slice(0, half)} />
        <Marquee items={all.slice(half)} reverse />
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((g, i) => (
          <div
            key={g.group}
            className="reveal glow-card p-6"
            style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/25 to-violet/25 text-lg text-cyan ring-1 ring-white/10">
                {g.icon}
              </span>
              <h3 className="font-semibold tracking-tight">{g.group}</h3>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s} className="rounded-md bg-white/5 px-2.5 py-1 text-sm text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
