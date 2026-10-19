import { profile } from "@/data/profile";
import { Section } from "./Section";

type ContactLink = { label: string; href: string; text: string };

const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

export function Contact() {
  const { email, linkedin, github } = profile.contact;
  const links: ContactLink[] = [];
  if (linkedin) links.push({ label: "LinkedIn", href: linkedin, text: stripProtocol(linkedin) });
  if (github) links.push({ label: "GitHub", href: github, text: stripProtocol(github) });

  return (
    <Section
      id="contact"
      index="04"
      eyebrow="Contact"
      title={
        <>
          Let&apos;s build <span className="text-gradient">something great</span>
        </>
      }
    >
      <div className="reveal glow-card relative overflow-hidden p-8 text-center sm:p-16">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-violet/30 blur-[100px]"
          aria-hidden
        />
        <p className="relative mx-auto max-w-xl text-lg leading-relaxed text-muted">
          Have a project, a role, or a hard problem in mind? I&apos;m always happy to talk
          about building great software.
        </p>

        <div className="relative mt-10 flex flex-wrap justify-center gap-4">
          {email ? (
            <a href={`mailto:${email}`} className="btn-glow">
              <span>
                {email}
                <span aria-hidden>↗</span>
              </span>
            </a>
          ) : (
            <span className="btn-ghost cursor-default opacity-70">Contact details coming soon</span>
          )}
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn-ghost">
              {l.label}
              <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
