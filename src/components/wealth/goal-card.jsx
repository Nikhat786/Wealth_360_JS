import { Link } from "react-router-dom";
import {
  ChevronRight,
  GraduationCap,
  Home,
  Palmtree,
  PiggyBank,
  Shield,
  Trash2,
  Car } from
"lucide-react";

import { ProgressRing } from "@/components/wealth/progress-ring";
import { formatINR, formatINRShort } from "@/lib/format";
import { projectGoal } from "@/lib/goal-math";

import { cn } from "@/lib/utils";

export const goalIcons = {
  retirement: PiggyBank,
  education: GraduationCap,
  home: Home,
  travel: Palmtree,
  shield: Shield,
  car: Car
};

export function GoalCard({ goal, compact = false, onDelete }) {
  const Icon = goalIcons[goal.icon] || PiggyBank;
  const p = projectGoal(goal, goal.monthlyContribution);

  return (
    <Link
      to={`/goals/${goal.id}`}
      className="surface-card group hover:shadow-raised relative block p-4 transition-all hover:-translate-y-0.5">

      {onDelete &&
      <button
        type="button"
        aria-label={`Remove ${goal.name}`}
        onClick={(e) => {e.preventDefault();e.stopPropagation();onDelete();}}
        className="text-muted-foreground hover:text-destructive absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">

          <Trash2 className="size-4" />
        </button>
      }
      <div className="flex items-start gap-3">
        <span className="bg-secondary text-secondary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate pr-5 font-semibold">{goal.name}</p>
              <p className="text-muted-foreground num mt-0.5 text-xs">
                {formatINRShort(goal.saved)} of {formatINRShort(goal.target)} · by{" "}
                {goal.targetYear}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>

          <div className="mt-3 flex items-center gap-3">
            <ProgressRing
              value={p.fundedPct}
              size={44}
              strokeWidth={5}
              tone={p.onTrack ? "success" : "gold"} />
            
            <div className="min-w-0 space-y-1">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  p.onTrack ?
                  "bg-success-soft text-success" :
                  "bg-warning-soft text-warning-foreground"
                )}>
                
                {p.onTrack ? "On track" : "Behind schedule"}
              </span>
              {!compact &&
              <p className="text-muted-foreground num text-xs">
                  {formatINR(goal.monthlyContribution)}/mo
                  {!p.onTrack &&
                ` · needs ${formatINR(Math.round(p.requiredMonthly))}/mo`}
                </p>
              }
            </div>
          </div>
        </div>
      </div>
    </Link>);

}