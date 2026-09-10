import {
  Banknote,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  UserRound } from

"lucide-react";

import { cn } from "@/lib/utils";










const toneMap = {
  navy: "gradient-navy text-navy-foreground border-transparent",
  gold: "bg-gold-soft text-gold-foreground border-transparent",
  success: "bg-success-soft text-success border-transparent",
  destructive: "bg-destructive-soft text-destructive border-transparent",
  plain: "surface-card"
};

export const mapIcons = {
  person: UserRound,
  family: Users,
  cashflow: Banknote,
  assets: TrendingUp,
  liabilities: Landmark,
  goals: Target,
  protection: ShieldCheck,
  transfer: HeartHandshake
};

export function WealthMap({ nodes }) {
  return (
    <ol className="relative space-y-3 pl-6">
      <span
        aria-hidden
        className="bg-border absolute top-2 bottom-2 left-[11px] w-px" />
      
      {nodes.map((n) =>
      <li key={n.id} className="relative">
          <span
          aria-hidden
          className="bg-primary absolute top-6 -left-6 size-2.5 translate-x-[6px] rounded-full ring-4 ring-[var(--color-background)]" />
        
          <div className={cn("rounded-xl border p-4", toneMap[n.tone])}>
            <div className="flex items-start gap-3">
              <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                n.tone === "navy" ? "bg-white/12" : "bg-background/60"
              )}>
              
                <n.icon className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium tracking-wide uppercase opacity-70">
                  {n.layer}
                </p>
                <p className="font-display mt-0.5 text-base font-semibold">{n.headline}</p>
                <p className="mt-1 text-xs leading-relaxed opacity-80">{n.detail}</p>
              </div>
            </div>
          </div>
        </li>
      )}
    </ol>);

}