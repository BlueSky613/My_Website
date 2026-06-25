import Reveal from "@/components/Reveal";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative border-b border-cyber-400/10 bg-gradient-to-b from-rock-900/40 to-transparent">
      {/* glowing baseline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyber-400/30 to-transparent" />
      <div className="container-content py-14 sm:py-20">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-3">{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={120} zoom>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient">{title}</span>
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={240}>
            <p className="mt-4 max-w-2xl text-rock-300">{description}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
