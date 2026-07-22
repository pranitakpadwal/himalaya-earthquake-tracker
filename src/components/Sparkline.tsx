"use client";

interface Point {
  date: string;
  discharge: number | null;
}

export default function Sparkline({
  points,
  typical,
  width = 220,
  height = 48,
}: {
  points: Point[];
  typical: number;
  width?: number;
  height?: number;
}) {
  const values = points.map((p) => p.discharge);
  const known = values.filter((v): v is number => v !== null);

  if (known.length < 2) {
    return <div className="text-xs text-slate-400">Not enough data for a trend line.</div>;
  }

  const max = Math.max(...known, typical);
  const min = Math.min(...known, typical);
  const range = max - min || 1;
  const step = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * step;
    const v = p.discharge ?? min;
    const y = height - ((v - min) / range) * height;
    return { x, y, known: p.discharge !== null };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const typicalY = height - ((typical - min) / range) * height;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <line
        x1={0}
        x2={width}
        y1={typicalY}
        y2={typicalY}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeDasharray="3 3"
      />
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.5} />
      {coords.map(
        (c, i) =>
          c.known && (
            <circle key={points[i].date} cx={c.x} cy={c.y} r={2} fill="currentColor" />
          )
      )}
    </svg>
  );
}
