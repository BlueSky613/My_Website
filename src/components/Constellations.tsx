// Twinkling constellations (Orion & Scorpius) drawn as faint star fields over
// the aurora. Each constellation is a set of star coordinates (in a 0-100 viewBox)
// plus connecting lines between star indices. Stars twinkle on staggered timers.
// Purely decorative; twinkle pauses for users who prefer reduced motion.

type Star = { x: number; y: number; r?: number };
type Constellation = {
  name: string;
  stars: Star[];
  lines: [number, number][];
  /** Horizontal placement of this constellation within the footer (%). */
};

// Orion — Betelgeuse, Bellatrix, the Belt (Alnitak/Alnilam/Mintaka), Saiph, Rigel.
const ORION: Constellation = {
  name: "Orion",
  stars: [
    { x: 14, y: 12, r: 1.7 }, // 0 Betelgeuse (shoulder)
    { x: 72, y: 16, r: 1.5 }, // 1 Bellatrix (shoulder)
    { x: 34, y: 46, r: 1.3 }, // 2 Alnitak (belt)
    { x: 46, y: 52, r: 1.3 }, // 3 Alnilam (belt)
    { x: 58, y: 58, r: 1.3 }, // 4 Mintaka (belt)
    { x: 16, y: 90, r: 1.6 }, // 5 Saiph (foot)
    { x: 78, y: 92, r: 1.9 }, // 6 Rigel (foot)
    { x: 44, y: 4, r: 1.0 },  // 7 head
  ],
  lines: [
    [0, 7],
    [7, 1],
    [0, 2],
    [1, 4],
    [2, 3],
    [3, 4],
    [2, 5],
    [4, 6],
    [5, 6],
  ],
};

// Scorpius — the curving body and tail with bright Antares.
const SCORPIUS: Constellation = {
  name: "Scorpius",
  stars: [
    { x: 6, y: 10, r: 1.2 },  // 0 head/claw
    { x: 18, y: 20, r: 1.2 }, // 1
    { x: 30, y: 32, r: 1.9 }, // 2 Antares (bright heart)
    { x: 42, y: 44, r: 1.2 }, // 3
    { x: 54, y: 56, r: 1.2 }, // 4
    { x: 66, y: 66, r: 1.2 }, // 5
    { x: 76, y: 78, r: 1.2 }, // 6
    { x: 86, y: 86, r: 1.2 }, // 7
    { x: 95, y: 78, r: 1.4 }, // 8 stinger
    { x: 97, y: 62, r: 1.4 }, // 9 stinger tip
  ],
  lines: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
  ],
};

// Build an SVG path for a 4-pointed sparkle star centered at (cx, cy).
// R is the outer radius (tip length); inner points sit at R * 0.32 for sharpness.
function fourPointStar(cx: number, cy: number, R: number): string {
  const r = R * 0.32;
  const pts = [
    [cx, cy - R], // top tip
    [cx + r, cy - r],
    [cx + R, cy], // right tip
    [cx + r, cy + r],
    [cx, cy + R], // bottom tip
    [cx - r, cy + r],
    [cx - R, cy], // left tip
    [cx - r, cy - r],
  ];
  return (
    "M" +
    pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join("L") +
    "Z"
  );
}

function ConstellationSvg({
  data,
  className,
}: {
  data: Constellation;
  className: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      {/* connecting lines */}
      <g stroke="currentColor" strokeWidth="0.4" opacity="0.55">
        {data.lines.map(([a, b], i) => (
          <line
            key={i}
            x1={data.stars[a].x}
            y1={data.stars[a].y}
            x2={data.stars[b].x}
            y2={data.stars[b].y}
          />
        ))}
      </g>

      {/* stars — 4-pointed sparkle shape */}
      <g fill="currentColor">
        {data.stars.map((s, i) => (
          <path
            key={i}
            d={fourPointStar(s.x, s.y, (s.r ?? 1.2) * 2.2)}
            className="origin-center animate-twinkle motion-reduce:animate-none"
            style={{
              // stagger the twinkle so they don't pulse in unison
              animationDelay: `${(i % 5) * 0.7 + (data.name === "Scorpius" ? 0.3 : 0)}s`,
              transformBox: "fill-box",
            }}
          />
        ))}
      </g>
    </svg>
  );
}

export default function Constellations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Orion — upper left */}
      <ConstellationSvg
        data={ORION}
        className="absolute left-[4%] top-1 h-48 w-48 text-cyan-100 drop-shadow-[0_0_8px_rgba(103,232,249,0.95)] sm:h-60 sm:w-60"
      />

      {/* Scorpius — right side */}
      <ConstellationSvg
        data={SCORPIUS}
        className="absolute right-[4%] top-2 h-44 w-72 text-amber-100 drop-shadow-[0_0_8px_rgba(232,185,74,0.9)] sm:h-52 sm:w-[22rem]"
      />
    </div>
  );
}
