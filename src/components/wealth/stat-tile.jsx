
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";











export function StatTile({
  label,
  value,
  sub,
  change,
  icon: Icon,
  tone = "default",
  className
}) {
  const navy = tone === "navy";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4",
        navy ?
        "gradient-navy text-navy-foreground border-transparent shadow-raised" :
        "surface-card",
        className
      )}>
      
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-xs font-medium", navy ? "opacity-80" : "text-muted-foreground")}>
          {label}
        </p>
        {Icon &&
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            navy ? "bg-white/12" : "bg-secondary text-secondary-foreground"
          )}>
          
            <Icon className="size-4" />
          </span>
        }
      </div>
      <p className="num font-display mt-2 text-2xl font-semibold">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {change !== undefined &&
        <span
          className={cn(
            "num inline-flex items-center gap-0.5 text-xs font-semibold",
            navy ?
            "text-gold" :
            change >= 0 ?
            "text-success" :
            "text-destructive"
          )}>
          
            {change >= 0 ?
          <ArrowUpRight className="size-3.5" /> :

          <ArrowDownRight className="size-3.5" />
          }
            {Math.abs(change).toFixed(1)}%
          </span>
        }
        {sub &&
        <span className={cn("text-xs", navy ? "opacity-75" : "text-muted-foreground")}>
            {sub}
          </span>
        }
      </div>
    </div>);

}