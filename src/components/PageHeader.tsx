import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

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
    <div className="relative border-b border-black/10">
      <div className="container-content py-14 sm:py-20">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-3">{eyebrow}</p>
          </Reveal>
        )}
        <TextReveal
          as="h1"
          className="text-3xl font-bold tracking-tight text-black sm:text-4xl"
          text={title}
          delay={150}
        />
        {description && (
          <Reveal delay={240}>
            <p className="mt-4 max-w-2xl text-black/75">{description}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
