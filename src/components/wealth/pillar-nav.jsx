import { useLocation } from "react-router-dom";


import { cn } from "@/lib/utils";

// export const pillars = [
//   { to: "/know", label: "Know", icon: Compass, blurb: "Understand your complete financial life" },
//   { to: "/portfolio", label: "Grow", icon: Sprout, blurb: "Build and optimise your wealth" },
//   { to: "/score", label: "Protect", icon: ShieldCheck, blurb: "Protect what matters" },
//   { to: "/transfer", label: "Transfer", icon: HeartHandshake, blurb: "Make your wealth reach the people who matter" },
// ] as const;

export function PillarNav({ className, compact = false }) {
  const { pathname } = useLocation();

  return (
    <nav className={cn("flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible", compact ? "md:grid-cols-4" : "", className)} aria-label="Wealth360 journey">
      {/* {pillars.map((p) => {
         const active = pathname.startsWith(p.to);
         return (
           <Link
             key={p.to}
             to={p.to}
             className={cn(
               compact
                 ? "group min-w-[190px] snap-start rounded-lg border px-3 py-3 transition-colors md:min-w-0"
                 : "group min-w-[230px] snap-start rounded-xl border px-4 py-4 transition-colors md:min-w-0 md:px-5 md:py-5",
               active
                 ? "gradient-navy text-navy-foreground border-transparent"
                 : "surface-card hover:bg-muted/50",
             )}
           >
             <span className="flex items-center gap-2">
               <p.icon className={cn(compact ? "size-3.5" : "size-4", active ? "text-gold" : "text-muted-foreground")} />
               <span className={cn("font-semibold tracking-wide uppercase", compact ? "text-xs" : "text-sm")}>{p.label}</span>
             </span>
             <span
               className={cn(
                 compact ? "mt-1 block text-[10px] leading-snug" : "mt-1 block text-[11px] leading-snug",
                 active ? "opacity-75" : "text-muted-foreground",
               )}
             >
               {p.blurb}
             </span>
           </Link>
         );
        })} */}
    </nav>);

}