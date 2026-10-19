import { experience } from "@/data/profile";
import { duration, formatMonth } from "@/lib";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-12 border-l border-line pl-6">
        {experience.map((job) => (
          <li key={`${job.company}-${job.start}`} className="relative">
            <span
              className={`absolute top-1 -left-[1.95rem] size-3 rounded-full ring-4 ring-bg ${
                job.end ? "bg-line" : "bg-accent"
              }`}
              aria-hidden
            />
            <p className="font-mono text-xs text-muted">
              {formatMonth(job.start)} – {job.end ? formatMonth(job.end) : "Present"} ·{" "}
              {duration(job.start, job.end)}
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              {job.title}{" "}
              <span className="font-normal text-muted">
                at{" "}
                {job.url ? (
                  <a href={job.url} className="hover:text-accent" target="_blank" rel="noreferrer">
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </span>
            </h3>
            {(job.type || job.location) && (
              <p className="mt-1 text-sm text-muted">
                {[job.type, job.location].filter(Boolean).join(" · ")}
              </p>
            )}
            {job.summary && <p className="mt-3 leading-relaxed text-muted">{job.summary}</p>}
            {job.highlights && job.highlights.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            {job.skills.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-accent"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
