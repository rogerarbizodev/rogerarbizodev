import { education, profile } from "@/data/profile";
import { Section } from "./Section";

const pillars = [
  { title: "Full-stack depth", body: "From schema and services to the UI, I own features end to end." },
  { title: "Technical leadership", body: "Setting direction, reviewing designs, and growing other engineers." },
  { title: "Built to last", body: "Healthcare taught me to treat correctness and clarity as features." },
];

export function About() {
  const edu = education[0];
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title={
        <>
          Engineering that&apos;s <span className="text-gradient">clear, fast &amp; reliable</span>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="reveal glow-card p-8 lg:col-span-3">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-sm">
            <p>
              <span className="text-dim">Location </span>
              {profile.location}
            </p>
            <p>
              <span className="text-dim">Education </span>
              {edu.degree}, {edu.school} ({edu.end})
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-2">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="reveal glow-card p-6"
              style={{ "--delay": `${100 + i * 100}ms` } as React.CSSProperties}
            >
              <p className="flex items-center gap-3 font-semibold">
                <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                {p.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
