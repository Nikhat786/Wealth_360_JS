import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ShieldAlert, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/wealth/section-header";
import {
  RecommendationGuardrails,
  guardrailsFor } from
"@/components/wealth/recommendation-guardrails";
import { useApp } from "@/context/app-context";

import {
  actionMeta,
  defaultActionMeta,
  MARKET_DISCLAIMER } from
"@/lib/wealth360";
import { cn } from "@/lib/utils";

const categoryMeta =





{
  high: {
    label: "PROTECTION",
    className: "bg-destructive-soft text-destructive"
  },
  medium: {
    label: "WEALTH CONTINUITY",
    className: "bg-gold-soft text-gold-foreground"
  },
  low: {
    label: "LIQUIDITY",
    className: "bg-secondary text-secondary-foreground"
  }
};

export function AttentionPanel({ limit = 3 }) {
  const { actions, dismissedActions, dismissAction } = useApp();

  const live = actions.
  filter((a) => !dismissedActions.includes(a.id)).
  slice(0, limit);

  return (
    <section className="space-y-5">
      <SectionHeader
        title="What needs your attention?"
        description="Three things worth your attention right now."
        action={
        <div className="text-right">
            <span className="num text-xs font-medium text-muted-foreground">
              {live.length} open {live.length === 1 ? "item" : "items"}
            </span>
          </div>
        } />
      

      <p className="-mt-2 text-xs text-muted-foreground">
        Prioritised by financial impact, urgency and confidence — not
        investment returns alone.
      </p>

      {live.length === 0 ?
      <div className="surface-card p-6 text-sm text-muted-foreground">
          Nothing urgent right now. Your next review is scheduled for
          December.
        </div> :

      <div className="grid gap-4 lg:grid-cols-3">
          {live.map((action, index) =>
        <ActionCard
          key={action.id}
          action={action}
          rank={index + 1}
          onDismiss={() => dismissAction(action.id)} />

        )}
        </div>
      }
    </section>);

}

function ActionCard({
  action,
  rank,
  onDismiss




}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const meta = actionMeta[action.id] ?? defaultActionMeta;
  const guardrails = guardrailsFor(
    action.id,
    meta.why,
    meta.confidence
  );

  const category = categoryMeta[action.severity];

  const impactText = action.impact.
  replace(" to your score", "").
  replace("to your score", "");

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-card p-5",
        "shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md"
      )}>
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="num text-xs font-semibold text-muted-foreground">
            {String(rank).padStart(2, "0")}
          </span>

          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide",
              category.className
            )}>
            
            {category.label}
          </span>
        </div>

        <button
          onClick={onDismiss}
          aria-label="Dismiss recommendation"
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          
          <X className="size-4" />
        </button>
      </div>

      {/* Recommendation */}
      <div className="mt-5">
        <h3 className="text-base font-semibold leading-snug tracking-tight">
          {action.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {action.detail}
        </p>
      </div>

      {/* Key information */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Potential impact
          </p>

          <p className="num mt-0.5 text-sm font-semibold">
            {impactText}
          </p>
        </div>

        <div className="h-7 w-px bg-border" />

        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Confidence
          </p>

          <p className="mt-0.5 text-sm font-semibold">
            {meta.confidence}
          </p>
        </div>
      </div>

      {/* Transparency */}
      <button
        type="button"
        onClick={() => setDetailsOpen((value) => !value)}
        className="mt-4 flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
        
        <span>Why this recommendation?</span>

        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            detailsOpen && "rotate-180"
          )} />
        
      </button>

      {detailsOpen &&
      <div className="mt-2 space-y-3 rounded-xl bg-muted/40 p-4">
          <div>
            <p className="text-xs font-semibold">Why we're suggesting this</p>

            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {meta.why}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <ShieldAlert className="size-3.5 text-muted-foreground" />

            <span className="text-muted-foreground">Risk</span>

            <span className="font-medium">{meta.risk}</span>
          </div>

          <RecommendationGuardrails data={guardrails} />

          {meta.marketLinked &&
        <p className="text-[10px] italic leading-relaxed text-muted-foreground">
              {MARKET_DISCLAIMER}
            </p>
        }
        </div>
      }

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 pt-5">
        <Button asChild size="sm" className="flex-1">
          <Link to={action.to}>
            Take action
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onDismiss}
          className="text-muted-foreground">
          
          Not now
        </Button>
      </div>
    </article>);

}