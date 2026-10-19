import { education, experience, profile } from "@/data/profile";
import { yearsOfExperience } from "@/lib";

export function Hero() {
  const current = experience.find((j) => !j.end);
  const years = yearsOfExperience(experience[experience.length - 1].start);
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <section id="top" className="py-20 sm:py-28">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent-soft font-mono text-lg font-semibold text-accent">
        {initials}
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl">{profile.name}</h1>
      <p className="mt-4 text-xl text-muted sm:text-2xl">
        {profile.role}
        {current && (
          <>
            {" "}at <span className="text-fg">{current.company}</span>
          </>
        )}
      </p>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.tagline}</p>
      <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-mono text-sm">
        <div>
          <dt className="text-muted">Experience</dt>
          <dd className="mt-1">{years}+ years</dd>
        </div>
        <div>
          <dt className="text-muted">Based in</dt>
          <dd className="mt-1">{profile.location}</dd>
        </div>
        <div>
          <dt className="text-muted">Education</dt>
          <dd className="mt-1">{education[0].school}</dd>
        </div>
      </dl>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="#contact"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          Get in touch
        </a>
        <a
          href="#experience"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          View experience
        </a>
      </div>
    </section>
  );
}
