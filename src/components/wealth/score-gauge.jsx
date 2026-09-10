import { cn } from "@/lib/utils";











export function ScoreGauge({
  score,
  grade,
  gradeLabel,
  size = 200,
  compareTo,
  className,
  compact = false
}) {
  const stroke = size * 0.085;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const sweep = 270;

  const arc = (fraction) => {
    const end = startAngle + sweep * fraction;
    const p0 = polar(cx, cy, r, startAngle);
    const p1 = polar(cx, cy, r, end);
    const large = sweep * fraction > 180 ? 1 : 0;
    return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`;
  };

  const pct = Math.max(0, Math.min(100, score)) / 100;
  const comparePct =
  compareTo === undefined ? null : Math.max(0, Math.min(100, compareTo)) / 100;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Wealth360 score ${score} out of 100`}>
        <path
          d={arc(1)}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={stroke}
          strokeLinecap="round" />
        
        {comparePct !== null &&
        <path
          d={arc(comparePct)}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
          strokeLinecap="round" />

        }
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-gold)" />
          </linearGradient>
        </defs>
        <path
          d={arc(pct)}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out" />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="num font-display font-semibold leading-none"
          style={{ fontSize: size * 0.28 }}>
          
          {score}
        </span>
        <span className="text-muted-foreground mt-1 text-xs">out of 100</span>
        {!compact &&
        <span className="bg-gold-soft text-gold-foreground mt-2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {grade} · {gradeLabel}
          </span>
        }
      </div>
    </div>);

}

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}