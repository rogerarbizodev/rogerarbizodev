export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-16 sm:py-20">
      <div className="grid gap-8 sm:grid-cols-[10rem_1fr]">
        <h2 className="font-mono text-sm uppercase tracking-widest text-muted">{title}</h2>
        <div>{children}</div>
      </div>
    </section>
  );
}
