import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, ShieldCheck, Wind } from "lucide-react";

import { Button } from "@/components/ui/button";
import { derivedExpenses, derivedIncome, useApp } from "@/context/app-context";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StressMode() {
  const { answers, setStressMode, actions, dismissedActions, setRmOpen, canAccessRM } = useApp();
  const income = derivedIncome(answers);
  const expenses = derivedExpenses(answers);
  const surplus = income - expenses;

  const activeActions = actions.filter((a) => !dismissedActions.includes(a.id));
  const urgent = activeActions.filter((a) => a.severity === "high").slice(0, 3);
  const canWait = activeActions.filter((a) => a.severity !== "high").slice(0, 4);

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4 sm:py-10">
      <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6 text-center sm:p-8">
        <span className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
          <Wind className="size-6" />
        </span>
        <p className="text-muted-foreground mt-3 text-xs font-semibold tracking-wide uppercase">Financial Stress Mode</p>
        <h1 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">Let&apos;s take this one step at a time.</h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
          You don&apos;t need to solve everything today. Here&apos;s what genuinely needs your attention right now — and what can wait.
        </p>
      </div>

      <div className="bg-secondary grid gap-4 rounded-xl p-5 sm:grid-cols-2">
        <Metric label="Available this month" value={formatINR(surplus)} tone={surplus >= 0 ? "success" : "destructive"} />
        <Metric label="Essential expenses" value={formatINR(expenses)} />
      </div>

      {urgent.length > 0 ?
      <div className="surface-card border-destructive/20 space-y-3 p-5">
          <p className="text-destructive text-xs font-semibold tracking-wide uppercase">Do this first</p>
          {urgent.map((a) =>
        <div key={a.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{a.detail}</p>
              </div>
              <Button asChild size="sm" className="shrink-0" onClick={() => setStressMode(false)}>
                <Link to={a.to}>{a.cta} <ArrowRight className="size-3.5" /></Link>
              </Button>
            </div>
        )}
        </div> :

      <div className="surface-card border-success/20 bg-success-soft p-5 text-center">
          <ShieldCheck className="text-success mx-auto size-6" />
          <p className="text-success mt-2 text-sm font-semibold">Nothing urgent on record right now.</p>
          <p className="text-success/80 mt-1 text-xs">You&apos;re in a stable position — anything below can wait until you&apos;re ready.</p>
        </div>
      }

      {canWait.length > 0 &&
      <div className="surface-card p-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Can wait until you&apos;re ready</p>
          <div className="mt-3 divide-y">
            {canWait.map((a) =>
          <div key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="text-muted-foreground min-w-0 truncate">{a.title}</span>
                <Link to={a.to} onClick={() => setStressMode(false)} className="text-primary shrink-0 text-xs font-semibold hover:underline">
                  {a.cta}
                </Link>
              </div>
          )}
          </div>
        </div>
      }

      <div className="flex flex-wrap justify-center gap-2">
        {canAccessRM &&
        <Button variant="outline" onClick={() => setRmOpen(true)}>
            <HeartHandshake className="size-4" /> Talk to RM
          </Button>
        }
        <Button variant="ghost" onClick={() => setStressMode(false)}>
          Exit Financial Stress Mode
        </Button>
      </div>
    </div>);

}

function Metric({ label, value, tone }) {
  return (
    <div>
      <p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold", tone === "success" && "text-success", tone === "destructive" && "text-destructive")}>{value}</p>
    </div>);

}
