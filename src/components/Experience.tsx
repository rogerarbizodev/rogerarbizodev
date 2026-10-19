import { experience } from "@/data/profile";
import { duration, formatMonth } from "@/lib";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title={
        <>
          Where I&apos;ve <span className="text-gradient">built things</span>
        </>
      }
    >
      <ol className="relative space-y-8 pl-8 sm:pl-12">
        <span className="timeline-line absolute top-2 bottom-0 left-[7px] w-px sm:left-[11px]" aria-hidden />
        {experience.map((job, i) => (
          <li
            key={`${job.company}-${job.start}`}
            className="reveal relative"
            style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
          >
            <span
              className={`absolute top-8 -left-8 size-[15px] rounded-full border-2 border-bg sm:-left-12 sm:size-[23px] ${
                job.end
                  ? "bg-violet/70"
                  : "bg-cyan shadow-[0_0_20px_4px_rgb(34_211_238/0.7)]"
              }`}
              aria-hidden
            />
            <article className="glow-card p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{job.title}</h3>
                  <p className="mt-1 text-lg">
                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noreferrer" className="text-gradient">
                        {job.company}
                      </a>
                    ) : (
                      <span className="text-gradient">{job.company}</span>
                    )}
                  </p>
                </div>
                <div className="font-mono text-xs text-muted sm:text-right">
                  <p>
                    {formatMonth(job.start)} – {job.end ? formatMonth(job.end) : "Present"}
                  </p>
                  <p className="mt-1 text-dim">{duration(job.start, job.end)}</p>
                </div>
              </div>

              {(job.type || job.location || !job.end) && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {!job.end && (
                    <span className="rounded-full bg-cyan/15 px-2.5 py-1 text-cyan">Current</span>
                  )}
                  {[job.type, job.location].filter(Boolean).map((t) => (
                    <span key={t} className="rounded-full border border-line px-2.5 py-1 text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {job.summary && <p className="mt-5 leading-relaxed text-muted">{job.summary}</p>}
              {job.highlights && job.highlights.length > 0 && (
                <ul className="mt-4 space-y-2 text-muted">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-cyan" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {job.skills.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-violet/30 bg-violet/10 px-2.5 py-1 font-mono text-xs text-violet-200"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
