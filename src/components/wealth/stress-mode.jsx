import { ArrowRight, HeartHandshake, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { derivedExpenses, derivedIncome } from "@/context/app-context";
import { formatINR } from "@/lib/format";

export function StressMode() {
  const { answers, setStressMode, nextAction, setRmOpen, canAccessRM } = useApp();
  const income = derivedIncome(answers);
  const expenses = derivedExpenses(answers);
  const surplus = income - expenses;

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4 sm:py-10">
      <div className="surface-card border-primary/20 p-6 sm:p-8">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Financial Stress Mode</p>
        <h1 className="font-display mt-3 text-3xl font-semibold">Let&apos;s take this one step at a time.</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          You don&apos;t need to solve everything today. We&apos;ll focus on what protects your immediate financial life.
        </p>
        <div className="mt-7 space-y-3">
          <FocusRow number="1" text="Understand your immediate cash position." />
          <FocusRow number="2" text="Identify urgent commitments." />
          <FocusRow number="3" text="Protect essential expenses." />
          <FocusRow number="4" text="Decide what can wait." />
        </div>
      </div>
      <div className="bg-secondary grid gap-4 rounded-xl p-5 sm:grid-cols-3">
        <Metric label="Available this month" value={formatINR(surplus)} />
        <Metric label="Essential expenses" value={formatINR(expenses)} />
        <Metric label="Current priority" value={nextAction?.title ?? "Review your cash buffer"} />
      </div>
      <div className="surface-card p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-success mt-0.5 size-5" />
          <div>
            <p className="font-semibold">Your next step</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {nextAction?.detail ?? "Start by reviewing your monthly cash position and emergency buffer."}
            </p>
            <Button className="mt-4" size="sm" onClick={() => setStressMode(false)}>
              Start <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
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

function FocusRow({ number, text }) {return <div className="flex items-center gap-3 text-sm"><span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold">{number}</span>{text}</div>;}
function Metric({ label, value }) {return <div><p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;}