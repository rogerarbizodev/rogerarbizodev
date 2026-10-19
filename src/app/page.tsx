import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { education, profile, skills } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        <Hero />

        <Section id="about" title="About">
          <div className="space-y-4 text-lg leading-relaxed text-muted">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Experience />

        <Section id="skills" title="Skills">
          <div className="grid gap-8 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.group}>
                <h3 className="text-sm font-semibold">{g.group}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="education" title="Education">
          {education.map((e) => (
            <div key={e.school}>
              <p className="font-mono text-xs text-muted">
                {e.start} – {e.end}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{e.school}</h3>
              <p className="text-muted">{e.degree}</p>
            </div>
          ))}
        </Section>

        <Contact />
      </main>
      <footer className="mx-auto max-w-4xl border-t border-line px-4 py-8 font-mono text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
