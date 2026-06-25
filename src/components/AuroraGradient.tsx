// Aurora (northern-lights) backdrop: several soft, blurred color bands layered
// over each other, each drifting at a different speed so the light appears to
// flow. Colors are vivid but heavily blurred so the effect reads as crisp light
// that still melts softly into the background. Purely decorative; animations
// pause for users who prefer reduced motion.
export default function AuroraGradient({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden [filter:saturate(1.3)] ${className}`}
    >
      {/* Base flowing gradient sheet */}
      <div className="absolute inset-0 animate-aurora bg-[length:200%_200%] bg-gradient-to-r from-cyber-500/30 via-terrain-400/25 to-ore-500/30 opacity-80 blur-2xl motion-reduce:animate-none" />

      {/* Cyan / teal band */}
      <div className="absolute -top-1/2 left-[-10%] h-[200%] w-1/2 animate-aurora-drift rounded-[50%] bg-gradient-to-tr from-cyber-400/55 via-terrain-400/30 to-transparent blur-3xl motion-reduce:animate-none" />

      {/* Green / emerald band */}
      <div className="absolute -top-1/2 left-1/4 h-[200%] w-1/2 animate-aurora-drift-slow rounded-[50%] bg-gradient-to-tr from-emerald-400/45 via-cyber-400/30 to-transparent blur-3xl motion-reduce:animate-none" />

      {/* Violet / gold band */}
      <div className="absolute -top-1/2 right-[-10%] h-[200%] w-1/2 animate-aurora-drift rounded-[50%] bg-gradient-to-tl from-violet-500/40 via-ore-500/30 to-transparent blur-3xl [animation-delay:-6s] motion-reduce:animate-none" />
    </div>
  );
}
