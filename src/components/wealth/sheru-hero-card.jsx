import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  Gauge,
  Headset,
  MessageSquareText,
  Percent,
  Receipt,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Vault } from
"lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";

import { cn } from "@/lib/utils";

const categoryIcon = {
  Protection: ShieldAlert,
  Debt: Percent,
  Retirement: TrendingUp,
  Tax: Receipt,
  Transfer: Vault,
  Liquidity: RotateCcw,
  Allocation: Sparkles
};

export function SheruHeroCard() {
  const {
    answers,
    sheruAdvisory,
    setRmOpen,
    focusArea,
    focusDescription,
    dynamicPriorities,
    discussWithSheru,
    canAccessRM,
    score,
    setStressMode
  } = useApp();
  const [expandedId, setExpandedId] = useState(null);

  const handleChatPrompt = (item) => {
    discussWithSheru(`Tell me more about ${item.title}: ${item.headline}`);
  };

  return (
    <div className="space-y-4">
      {/* Plain header — full width, not boxed, so the horizontal space is actually used */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              <Bot className="size-3.5" /> SHERU · AI Wealth Guide
            </span>
            <span className="border-border bg-muted text-muted-foreground rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
              {focusArea} Focus
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hi {answers.name.split(" ")[0] || "Rahul"} — {sheruAdvisory.length} things deserve your attention.
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {focusDescription}
            {dynamicPriorities.length > 0 &&
            <span className="text-foreground/80">
                {" "}
                {dynamicPriorities.map((priority, index) =>
              <span key={index} className="inline-flex items-center gap-1 whitespace-nowrap after:mx-1.5 after:text-muted-foreground/40 after:content-['·'] last:after:content-none">
                    <CheckCircle2 className="text-success size-3 shrink-0" />
                    {priority}
                  </span>
              )}
              </span>
            }
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setStressMode(true)}>
            Feeling overwhelmed?
          </Button>
          {canAccessRM &&
          <Button
            size="sm"
            className="bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
            onClick={() => setRmOpen(true)}>

              <Headset className="mr-1.5 size-3.5" /> Ask RM
            </Button>
          }
          <Button size="sm" variant="outline" asChild>
            <Link to="/insights">
              Insights <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link to="/coach">
              <MessageSquareText className="mr-1.5 size-3.5" /> Chat
            </Link>
          </Button>
        </div>
      </div>

      {/* Dark card: score + recommendations, everything visible at once */}
      <section className="relative overflow-hidden rounded-3xl border border-navy/20 bg-gradient-to-br from-[#0c192e] via-[#0f2444] to-[#081224] p-5 text-white shadow-2xl sm:p-6">
        {/* Background ambient lighting */}
        <span className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-gradient-to-br from-[var(--color-primary)]/25 to-gold/20 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">
              {sheruAdvisory.length} Active Recommendations
            </p>
            <p className="mt-0.5 hidden text-[11px] text-white/40 sm:block">Continuous Adaptive Evaluation</p>
          </div>
          <Link
            to="/score"
            className="group flex items-center gap-3 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/15 to-white/5 px-4 py-2 transition-colors hover:from-gold/25">

            <Gauge className="text-gold size-5 shrink-0" />
            <span className="font-display text-2xl leading-none font-bold text-white">{score.total}</span>
            <div className="text-left leading-tight">
              <p className="text-gold text-[10px] font-semibold tracking-wider uppercase">Financial Health</p>
              <p className="text-xs text-white/70">Grade {score.grade} · {score.gradeLabel}</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="relative z-10 mt-4 space-y-2">
          {sheruAdvisory.map((item) => {
            const Icon = categoryIcon[item.category] || Sparkles;
            const isExpanded = item.id === expandedId;
            const impact = item.financialImpact || item.expectedImpact;
            return (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex w-full items-center gap-3 p-3 text-left sm:p-3.5">

                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">{item.headline}</p>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase",
                          item.priorityLevel === "High" ?
                          "bg-red-500/20 text-red-300" :
                          "bg-amber-500/20 text-amber-300"
                        )}>

                        {item.priorityLevel}
                      </span>
                    </div>
                    {impact &&
                    <p className="mt-0.5 truncate text-xs font-medium text-cyan-200">{impact}</p>
                    }
                  </div>
                  <ChevronDown className={cn("size-4 shrink-0 text-white/50 transition-transform", isExpanded && "rotate-180")} />
                </button>

                {isExpanded &&
                <div className="border-t border-white/10 p-3 pt-3 sm:p-3.5 sm:pt-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-semibold tracking-wider text-amber-300 uppercase">Why this matters</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/90">{item.whyItMatters}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase">Suggested action</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/90">{item.suggestedAction}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold tracking-wider text-purple-300 uppercase">Expected outcome</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/90">{item.expectedOutcome || item.whatChanged}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" asChild className="bg-gold text-gold-foreground font-semibold hover:bg-gold/90">
                        <Link to={item.routeTo}>
                          Take Action <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                      <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 bg-white/5 text-white hover:bg-white/15"
                      onClick={() => handleChatPrompt(item)}>

                        <MessageSquareText className="mr-1.5 size-3.5" /> Discuss with SHERU
                      </Button>
                    </div>
                  </div>
                }
              </div>);

          })}
        </div>
      </section>
    </div>);

}
