import { Fingerprint } from "lucide-react";


import { cn } from "@/lib/utils";

export function DnaCard({
  archetype,
  blurb,
  dims,
  className





}) {
  return (
    <div className={cn("surface-card p-5", className)}>
      <div className="flex items-start gap-3">
        <span className="bg-gold-soft text-gold-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
          <Fingerprint className="size-5" />
        </span>
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Your financial DNA
          </p>
          <p className="font-display mt-0.5 text-lg font-semibold">{archetype}</p>
        </div>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{blurb}</p>

      <dl className="mt-4 space-y-3">
        {dims.map((d) =>
        <div key={d.key}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-medium">{d.label}</dt>
              <dd className="num text-sm font-semibold">{d.value}</dd>
            </div>
            <div className="bg-muted mt-1.5 h-1.5 overflow-hidden rounded-full">
              <div
              className={cn(
                "h-full rounded-full",
                d.value >= 70 ? "bg-success" : d.value >= 45 ? "bg-gold" : "bg-destructive"
              )}
              style={{ width: `${Math.max(3, Math.min(100, d.value))}%` }} />
            
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">{d.note}</p>
          </div>
        )}
      </dl>
    </div>);

}