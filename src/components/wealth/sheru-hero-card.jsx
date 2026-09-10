import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,

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
    sendMessage,
    canAccessRM
  } = useApp();
  const [selectedId, setSelectedId] = useState(sheruAdvisory[0]?.id ?? "gap-protection");

  const activeItem = sheruAdvisory.find((item) => item.id === selectedId) ?? sheruAdvisory[0];

  const handleChatPrompt = (item) => {
    sendMessage(`Tell me more about ${item.title}: ${item.headline}`);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-navy/20 bg-gradient-to-br from-[#0c192e] via-[#0f2444] to-[#081224] p-6 text-white shadow-2xl sm:p-8">
      {/* Background ambient lighting */}
      <span className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-gradient-to-br from-[var(--color-primary)]/25 to-gold/20 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left column: AI Identity & Intro */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-gold uppercase backdrop-blur-md">
              <Bot className="size-3.5" /> SHERU · AI WEALTH GUIDE
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
              {focusArea} Focus
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-white">
            &ldquo;Hi {answers.name.split(" ")[0] || "Rahul"} — I&apos;ve reviewed your financial universe and identified {sheruAdvisory.length} opportunities that deserve attention.&rdquo;
          </h2>

          <p className="text-sm leading-relaxed text-white/75 sm:text-base">
            Continuous advisory intelligence analyzing cashflows, debt hurdles, tax deductions, retirement milestones, and family continuity.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {canAccessRM &&
            <Button
              size="lg"
              className="bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90"
              onClick={() => setRmOpen(true)}>
              
                <Headset className="mr-2 size-4" /> Ask RM To Review
              </Button>
            }
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white">
              
              <Link to="/insights">
                View Insights <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="text-white/90 hover:bg-white/10 hover:text-white">
              
              <Link to="/coach">
                <MessageSquareText className="mr-2 size-4" /> Chat With SHERU
              </Link>
            </Button>
          </div>
        </div>

        {/* Right column: Key Focus Pills */}
        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-5 lg:w-72">
          <p className="text-[11px] font-semibold tracking-wider text-gold uppercase">
            Strategic Focus · {focusArea}
          </p>
          <p className="mt-1 text-xs text-white/70">
            {focusDescription}
          </p>
          <ul className="mt-3 space-y-2 text-xs">
            {dynamicPriorities.map((priority, index) =>
            <li key={index} className="flex items-start gap-2 text-white/90">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                <span>{priority}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Dynamic Recommendation Tabs & Deep Dive */}
      <div className="relative z-10 mt-8 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">
            Sheru 5-Part Advisory Recommendations ({sheruAdvisory.length} Active)
          </p>
          <span className="text-[11px] text-white/50">Continuous Adaptive Evaluation</span>
        </div>

        {/* Category selector pills */}
        <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2">
          {sheruAdvisory.map((item) => {
            const Icon = categoryIcon[item.category] || Sparkles;
            const isSelected = item.id === (activeItem?.id ?? "");
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
                  isSelected ?
                  "bg-white text-navy shadow-lg" :
                  "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                )}>
                
                <Icon className={cn("size-3.5", isSelected ? "text-primary" : "text-gold")} />
                <span>{item.title}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase",
                    item.priorityLevel === "High" ?
                    isSelected ? "bg-red-500 text-white" : "bg-red-400/20 text-red-300" :
                    isSelected ? "bg-amber-500 text-white" : "bg-amber-400/20 text-amber-300"
                  )}>
                  
                  {item.priorityLevel}
                </span>
              </button>);

          })}
        </div>

        {/* Expanded Active Recommendation Card: 5-Part Standard */}
        {activeItem &&
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-md sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-orange-300 uppercase">
                    {activeItem.category}
                  </span>
                  <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                    activeItem.priorityLevel === "High" ?
                    "border-red-400/30 bg-red-500/20 text-red-300" :
                    "border-amber-400/30 bg-amber-500/20 text-amber-300"
                  )}>
                  
                    Priority Level: {activeItem.priorityLevel}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                    {activeItem.headline}
                  </h3>
                </div>

                {/* Structured Advisory 5-part layout */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
                  {/* 1. Why this matters */}
                  <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <p className="text-[10px] font-semibold tracking-wider text-amber-300 uppercase flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-amber-400" />
                      1. Why This Matters
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                      {activeItem.whyItMatters}
                    </p>
                  </div>

                  {/* 2. Financial Impact */}
                  <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <p className="text-[10px] font-semibold tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-cyan-400" />
                      2. Financial Impact
                    </p>
                    <p className="mt-1.5 text-xs font-semibold leading-relaxed text-cyan-200">
                      {activeItem.financialImpact || activeItem.expectedImpact}
                    </p>
                  </div>

                  {/* 3. Suggested Action */}
                  <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <p className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      3. Suggested Action
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                      {activeItem.suggestedAction}
                    </p>
                  </div>

                  {/* 4. Expected Outcome */}
                  <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <p className="text-[10px] font-semibold tracking-wider text-purple-300 uppercase flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-purple-400" />
                      4. Expected Outcome
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                      {activeItem.expectedOutcome || activeItem.whatChanged}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons for this specific item */}
              <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:flex-col lg:items-end">
                <Button
                size="sm"
                asChild
                className="bg-gold text-gold-foreground font-semibold hover:bg-gold/90">
                
                  <Link to={activeItem.routeTo}>
                    Take Action <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
                <Button
                size="sm"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/15"
                onClick={() => handleChatPrompt(activeItem)}>
                
                  <MessageSquareText className="mr-1.5 size-3.5" /> Discuss with SHERU
                </Button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>);

}