import { profile } from "@/data/profile";
import { Section } from "./Section";

type ContactLink = { label: string; href: string; text: string };

const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

export function Contact() {
  const { email, linkedin, github } = profile.contact;
  const links: ContactLink[] = [];
  if (email) links.push({ label: "Email", href: `mailto:${email}`, text: email });
  if (linkedin) links.push({ label: "LinkedIn", href: linkedin, text: stripProtocol(linkedin) });
  if (github) links.push({ label: "GitHub", href: github, text: stripProtocol(github) });

  return (
    <Section id="contact" title="Contact">
      <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Have a project or role in mind? Let&apos;s talk.
      </p>
      {links.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {links.map((l) => (
            <li key={l.label} className="flex gap-4">
              <span className="w-20 shrink-0 font-mono text-sm text-muted">{l.label}</span>
              <a
                href={l.href}
                className="break-all text-accent underline-offset-4 hover:underline"
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
              >
                {l.text}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-muted">Contact details coming soon.</p>
      )}
    </Section>
  );
}
