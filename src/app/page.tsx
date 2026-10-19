import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Effects } from "@/components/Effects";
import { Experience } from "@/components/Experience";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Background } from "@/components/three/Background";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Background />
      <Effects />
      <Header />
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <footer className="relative z-10 mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-10 text-sm text-dim sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed &amp; built with Next.js and Three.js.
        </p>
        <a href="#top" className="transition-colors hover:text-fg">
          Back to top ↑
        </a>
      </footer>
    </>
  );
}
