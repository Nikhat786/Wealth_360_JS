import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  Heart,
  Home,
  PauseCircle,
  Pencil,
  Plane,
  Plus,
  Sparkles,
  Sun,
  Trash2,
  TrendingDown,
  TrendingUp } from
"lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { FutureEventFormDialog } from "@/components/wealth/future-event-form-dialog";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { SectionHeader } from "@/components/wealth/section-header";

import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";
import { LIFE_EVENTS_CATALOG } from "@/lib/life-events";
import { cn } from "@/lib/utils";


const ICON_MAP = {
  Heart,
  Baby,
  Briefcase,
  PauseCircle,
  Building2,
  Home,
  Sun,
  Plane,
  Compass
};

export default function LifeEventsPage() {
  const {
    answers,
    score,
    plannedLifeEvents,
    togglePlannedLifeEvent,
    setRmOpen,
    canAccessRM,
    futureEvents,
    addFutureEvent,
    updateFutureEvent,
    removeFutureEvent
  } = useApp();

  const [activeEventId, setActiveEventId] = useState("event-child");
  const [eventDialog, setEventDialog] = useState({ open: false, event: null });

  const activeEvent =
  LIFE_EVENTS_CATALOG.find((e) => e.id === activeEventId) ?? LIFE_EVENTS_CATALOG[0];

  const IconComponent = ICON_MAP[activeEvent.iconName] || Sparkles;

  // Base current figures
  const baseMonthlyIncome = answers.salary || 250000;
  const baseMonthlyExpense =
  answers.household + answers.schoolFees + answers.emiExpenses + answers.lifestyle || 126500;
  const baseSurplus = baseMonthlyIncome - baseMonthlyExpense;
  const baseLifeCover = answers.lifeCover || 15000000;
  const baseScore = score.total;

  // Projected after figures
  const projectedIncome = baseMonthlyIncome + activeEvent.monthlyIncomeDelta;
  const projectedExpense = baseMonthlyExpense + activeEvent.monthlyExpenseDelta;
  const projectedSurplus = projectedIncome - projectedExpense;
  const projectedLifeCover = baseLifeCover + activeEvent.lifeCoverDelta;
  const projectedScore = Math.max(20, Math.min(100, baseScore + activeEvent.healthScoreDelta));

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              <Sparkles className="size-3.5" /> Predictive Life Planning
            </span>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Life Events Engine
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Simulate life milestones and visualize multi-dimensional impacts across cashflow, protection, net worth, and Wealth Health.
            </p>
          </div>

          <div className="flex gap-2">
            {canAccessRM &&
            <Button variant="outline" onClick={() => setRmOpen(true)}>
                Discuss with RM
              </Button>
            }
            <Button asChild className="bg-primary">
              <Link to="/goals">
                View Goals <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <PillarNav />

        {/* ------------------------------------------------------------- */}
        {/* Your Own Future Events (optional, personal log)               */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeader
              title="Your future events"
              description="Optional milestones you're planning for — add them whenever you're ready, no rush." />

            <Button size="sm" className="shrink-0 gap-1.5" onClick={() => setEventDialog({ open: true, event: null })}>
              <Plus className="size-4" /> Add event
            </Button>
          </div>

          {futureEvents.length > 0 ?
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {futureEvents.map((event) =>
            <div key={event.id} className="surface-card flex items-start gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{event.event}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{event.year} · {event.importance} importance</p>
                    <p className="text-muted-foreground mt-1 text-xs">Estimated cost {formatINRShort(event.estimatedCost)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" className="text-muted-foreground hover:text-primary" aria-label={`Edit ${event.event}`} onClick={() => setEventDialog({ open: true, event })}>
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${event.event}`} onClick={() => removeFutureEvent(event.id)}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
            )}
            </div> :

          <div className="surface-card rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              No future events on record yet. This is entirely optional — add one whenever a milestone comes up.
            </div>
          }
        </div>

        <FutureEventFormDialog
          open={eventDialog.open}
          onOpenChange={(open) => setEventDialog((prev) => ({ ...prev, open }))}
          initialEvent={eventDialog.event}
          onSubmit={(event) => {
            if (eventDialog.event) {
              updateFutureEvent(eventDialog.event.id, event);
            } else {
              addFutureEvent(event);
            }
          }} />

        {/* Life Event Selector Cards */}
        <div className="space-y-3">
          <SectionHeader
            title="Select a Life Milestone"
            description="Choose an event to evaluate how your WealthVerse flexes under changes." />
          

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {LIFE_EVENTS_CATALOG.map((item) => {
              const Icon = ICON_MAP[item.iconName] || Sparkles;
              const isSelected = item.id === activeEventId;
              const isPlanned = plannedLifeEvents.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveEventId(item.id)}
                  className={cn(
                    "relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
                    isSelected ?
                    "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md" :
                    "border-border bg-card hover:bg-muted/50"
                  )}>
                  
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl",
                        isSelected ? "bg-primary text-white" : "bg-muted text-foreground"
                      )}>
                      
                      <Icon className="size-4.5" />
                    </span>

                    {isPlanned &&
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        Planned
                      </span>
                    }
                  </div>

                  <p className="mt-3 font-display text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                    {item.category}
                  </p>
                </button>);

            })}
          </div>
        </div>

        {/* Active Milestone Deep Dive & Before/After Comparison */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b pb-6">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-gold text-white shadow-lg">
                <IconComponent className="size-7" />
              </span>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Simulation: {activeEvent.category}
                </span>
                <h2 className="font-display mt-1 text-2xl font-bold text-foreground">
                  {activeEvent.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                  {activeEvent.description}
                </p>
              </div>
            </div>

            <Button
              variant={plannedLifeEvents.includes(activeEvent.id) ? "outline" : "default"}
              onClick={() => togglePlannedLifeEvent(activeEvent.id)}
              className="shrink-0 gap-2">
              
              {plannedLifeEvents.includes(activeEvent.id) ?
              <>
                  <CheckCircle2 className="size-4 text-emerald-500" /> In Your Master Plan
                </> :

              <>
                  + Add to Master Plan
                </>
              }
            </Button>
          </div>

          {/* Before vs After Impact Grid */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-foreground">
              Before vs. After Impact Analysis
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Metric 1: Monthly Surplus */}
              <div className="rounded-2xl border bg-muted/30 p-4 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Monthly Surplus
                </p>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatINR(baseSurplus)}
                    </span>
                    <p className="font-display text-xl font-bold text-foreground">
                      {formatINR(projectedSurplus)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex items-center text-xs font-semibold",
                      activeEvent.monthlyIncomeDelta - activeEvent.monthlyExpenseDelta >= 0 ?
                      "text-emerald-600" :
                      "text-rose-600"
                    )}>
                    
                    {activeEvent.monthlyIncomeDelta - activeEvent.monthlyExpenseDelta >= 0 ?
                    <TrendingUp className="mr-1 size-3.5" /> :

                    <TrendingDown className="mr-1 size-3.5" />
                    }
                    {formatINRShort(activeEvent.monthlyIncomeDelta - activeEvent.monthlyExpenseDelta)}/mo
                  </span>
                </div>
              </div>

              {/* Metric 2: Required Life Cover */}
              <div className="rounded-2xl border bg-muted/30 p-4 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Family Life Cover Need
                </p>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {formatINRShort(baseLifeCover)}
                    </span>
                    <p className="font-display text-xl font-bold text-foreground">
                      {formatINRShort(projectedLifeCover)}
                    </p>
                  </div>
                  {activeEvent.lifeCoverDelta !== 0 &&
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      +{formatINRShort(activeEvent.lifeCoverDelta)}
                    </span>
                  }
                </div>
              </div>

              {/* Metric 3: 10-Year Net Worth Trajectory */}
              <div className="rounded-2xl border bg-muted/30 p-4 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  10-Yr Net Worth Impact
                </p>
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-xl font-bold text-foreground">
                    {activeEvent.netWorth10YrDelta >= 0 ? "+" : ""}
                    {formatINRShort(activeEvent.netWorth10YrDelta)}
                  </p>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      activeEvent.netWorth10YrDelta >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                    
                    Compounded Delta
                  </span>
                </div>
              </div>

              {/* Metric 4: Wealth Health Score */}
              <div className="rounded-2xl border bg-muted/30 p-4 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Wealth Health Score
                </p>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Base: {baseScore}</span>
                    <p className="font-display text-xl font-bold text-foreground">
                      {projectedScore} / 100
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-bold",
                      activeEvent.healthScoreDelta >= 0 ?
                      "bg-emerald-500/10 text-emerald-600" :
                      "bg-rose-500/10 text-rose-600"
                    )}>
                    
                    {activeEvent.healthScoreDelta >= 0 ? "+" : ""}
                    {activeEvent.healthScoreDelta} pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Strategy & Checklist */}
          <div className="grid gap-6 lg:grid-cols-2 pt-2">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Sheru Recommended Strategy
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
                &ldquo;{activeEvent.primaryAction}&rdquo;
              </p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Life events alter your risk capacity. Planning 6 to 12 months ahead guarantees your goals stay fully funded without dipping into high-interest debt.
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/40 p-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Milestone Preparation Checklist
              </p>
              <ul className="space-y-2 text-xs text-foreground">
                {activeEvent.checklist.map((task, i) =>
                <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span>{task}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>);

}