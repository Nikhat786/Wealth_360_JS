import { cn } from "@/lib/utils";










const toneVar = {
  primary: "var(--color-primary)",
  success: "var(--color-success)",
  gold: "var(--color-gold)",
  destructive: "var(--color-destructive)"
};

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  tone = "primary",
  label,
  className
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={strokeWidth} />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={toneVar[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - c * pct / 100}
          className="transition-all duration-500" />
        
      </svg>
      <span className="num absolute text-xs font-semibold">
        {label ?? `${Math.round(pct)}%`}
      </span>
    </div>);

}