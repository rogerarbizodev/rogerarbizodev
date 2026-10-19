export function Section({
  id,
  index,
  eyebrow,
  title,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-24 sm:py-32">
      <div className="reveal mb-12 sm:mb-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          <span className="text-dim">{index}</span>
          <span className="h-px w-10 bg-gradient-to-r from-cyan to-transparent" />
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
