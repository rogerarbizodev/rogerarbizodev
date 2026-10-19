import { experience, profile } from "@/data/profile";
import { yearsOfExperience } from "@/lib";
import { Counter } from "./Counter";
import { Typewriter } from "./Typewriter";

export function Hero() {
  const current = experience.find((j) => !j.end);
  const years = yearsOfExperience(experience[experience.length - 1].start);
  const [first, ...rest] = profile.name.split(" ");

  const stats = [
    { value: years, suffix: "+", label: "Years shipping software" },
    { value: experience.length, suffix: "", label: "Product companies" },
    { value: 2, suffix: " yrs", label: "In healthcare tech" },
  ];

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center pt-28 pb-16">
      <div className="max-w-3xl">
        {current && (
          <p className="reveal inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs text-muted backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            {current.title} at <span className="text-fg">{current.company}</span>
          </p>
        )}

        <h1 className="reveal mt-8 text-5xl leading-[0.95] font-bold tracking-tighter sm:text-7xl lg:text-8xl" style={{ "--delay": "100ms" } as React.CSSProperties}>
          <span className="block text-muted/80 text-2xl font-medium tracking-tight sm:text-3xl">
            Hi, I&apos;m
          </span>
          <span className="text-gradient text-glow">{first}</span>{" "}
          <span className="text-gradient text-glow">{rest.join(" ")}</span>
        </h1>

        <p className="reveal mt-6 text-xl font-medium text-fg/90 sm:text-3xl" style={{ "--delay": "200ms" } as React.CSSProperties}>
          {profile.role}. I build <Typewriter words={profile.focus} />
        </p>

        <p className="reveal mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg" style={{ "--delay": "300ms" } as React.CSSProperties}>
          {profile.tagline}
        </p>

        <div className="reveal mt-10 flex flex-wrap gap-4" style={{ "--delay": "400ms" } as React.CSSProperties}>
          <a href="#contact" className="btn-glow">
            <span>
              Let&apos;s work together
              <span aria-hidden>→</span>
            </span>
          </a>
          <a href="#experience" className="btn-ghost">
            View my work
          </a>
        </div>
      </div>

      <dl className="reveal mt-16 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4" style={{ "--delay": "500ms" } as React.CSSProperties}>
        {stats.map((s) => (
          <div key={s.label} className="glow-card px-4 py-5 sm:px-6">
            <dd className="bg-gradient-to-br from-white to-violet-300 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-1 text-xs text-muted sm:text-sm">{s.label}</dt>
          </div>
        ))}
      </dl>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="scroll-cue absolute bottom-8 left-1/2 hidden h-9 w-6 -translate-x-1/2 rounded-full border border-white/25 sm:block"
      />
    </section>
  );
}
