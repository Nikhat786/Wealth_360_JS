
import { useState } from "react";
import {
  Calculator,
  Flame,
  MessageSquareText,
  Plus } from
"lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { GoalCard } from "@/components/wealth/goal-card";
import { GoalFormDialog } from "@/components/wealth/goal-form-dialog";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { derivedExpenses, derivedIncome, useApp } from "@/context/app-context";
import { formatINR, formatINRShort, formatPlainPct } from "@/lib/format";
import { futureValue, projectGoal } from "@/lib/goal-math";
import { computeFire } from "@/lib/fire-math";
import { cn } from "@/lib/utils";


function categorizeGoal(targetYear) {
  const currentYear = new Date().getFullYear();
  const diff = targetYear - currentYear;
  if (diff <= 3) return "short";
  if (diff <= 7) return "mid";
  return "long";
}

export default function GoalsPage() {
  const { goals, contributions, answers, addGoal, updateGoal, removeGoal, discussWithSheru } = useApp();
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id ?? null);
  const [filter, setFilter] = useState("all");
  const [goalDialog, setGoalDialog] = useState({ open: false, goal: null });

  // What-if simulator state for individual goal
  const [whatIfMonthly, setWhatIfMonthly] = useState(20000);
  const [whatIfYears, setWhatIfYears] = useState(8);
  const [whatIfReturn, setWhatIfReturn] = useState(10);

  // FIRE Calculator state
  const annualExpenses = (derivedExpenses(answers) || 0) * 12 || 1500000;
  const currentInvestments =
  (answers?.equity || 0) + (
  answers?.mutualFunds || 0) + (
  answers?.deposits || 0) + (
  answers?.gold || 0) + (
  answers?.retirementCorpus || 0) ||
  6800000;
  const monthlySavings = (derivedIncome(answers) || 0) - (derivedExpenses(answers) || 0) || 88000;

  const [fireExpenses, setFireExpenses] = useState(annualExpenses);
  const [swrPct, setSwrPct] = useState(3.5);
  const [fireRealReturn, setFireRealReturn] = useState(6.0);

  const fireResult = computeFire({
    annualExpenses: fireExpenses,
    currentInvestments,
    monthlySavings,
    safeWithdrawalRatePct: swrPct,
    expectedRealReturnPct: fireRealReturn,
    currentAge: answers?.age || 36
  });

  const projections = goals.map((g) => projectGoal(g, contributions[g.id] ?? g.monthlyContribution));
  const onTrack = projections.filter((p) => p.onTrack).length;
  const monthly = goals.reduce((s, g) => s + (contributions[g.id] ?? g.monthlyContribution), 0);
  const targetSum = goals.reduce((s, g) => s + g.target, 0);
  const savedSum = goals.reduce((s, g) => s + g.saved, 0);

  const filteredGoals = goals.filter((g) => {
    if (filter === "all") return true;
    return categorizeGoal(g.targetYear) === filter;
  });

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? goals[0];
  const whatIfProjected = selectedGoal ?
  futureValue(selectedGoal.saved, whatIfMonthly, whatIfReturn, whatIfYears) :
  0;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeader
            as="h1"
            title="Goals & FIRE Calculator"
            description="Every family milestone with mathematical projections, required monthly commitments, and Financial Independence modeling." />
          <Button size="sm" variant="outline" onClick={() => discussWithSheru("How do I bridge my goal milestone shortfalls and calculate required SIP adjustments?")}>
            <MessageSquareText className="mr-1.5 size-3.5" /> Discuss with SHERU
          </Button>
        </div>
        

        <PillarNav />

        {/* Top Stat Tiles */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="navy" label="Goals on track" value={`${onTrack} of ${goals.length}`} />
          <StatTile label="Monthly commitment" value={formatINR(monthly)} />
          <StatTile label="Total target corpus" value={formatINRShort(targetSum)} />
          <StatTile
            label="Funded so far"
            value={formatINRShort(savedSum)}
            sub={formatPlainPct(targetSum > 0 ? savedSum / targetSum * 100 : 0, 1)} />
          
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FIRE Calculator Section (NEW FEATURE)                         */}
        {/* ------------------------------------------------------------- */}
        <section className="rounded-3xl border bg-gradient-to-br from-[#0c192e] via-[#0f2444] to-[#081224] p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold uppercase tracking-wider">
                <Flame className="size-3.5 text-orange-400" /> Financial Independence / Retire Early
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-white">
                WealthVerse FIRE Engine
              </h2>
              <p className="text-xs text-white/70 max-w-xl">
                Evaluate your safe withdrawal capacity and projected date to achieve complete financial autonomy.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">FI Target Corpus</p>
                <p className="font-display text-2xl font-bold text-gold">{formatINRShort(fireResult.requiredCorpus)}</p>
              </div>
              <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-gold">
                <Calculator className="size-6" />
              </div>
            </div>
          </div>

          {/* Interactive FIRE Controls */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-white/80">Annual Household Expenses</span>
                <span className="font-semibold text-gold">{formatINR(fireExpenses)}</span>
              </div>
              <input
                type="range"
                min={600000}
                max={4000000}
                step={50000}
                value={fireExpenses}
                onChange={(e) => setFireExpenses(Number(e.target.value))}
                className="mt-3 w-full accent-gold" />
              
              <p className="mt-1 text-[10px] text-white/50">Current lifestyle expenditure baseline</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-white/80">Safe Withdrawal Rate (SWR)</span>
                <span className="font-semibold text-gold">{swrPct}% ({fireResult.ruleOfThumbMultiplier}x)</span>
              </div>
              <input
                type="range"
                min={3.0}
                max={4.5}
                step={0.1}
                value={swrPct}
                onChange={(e) => setSwrPct(Number(e.target.value))}
                className="mt-3 w-full accent-gold" />
              
              <p className="mt-1 text-[10px] text-white/50">3.5% is conservative standard for 30+ year horizons</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-white/80">Post-Inflation Real Return</span>
                <span className="font-semibold text-gold">{fireRealReturn}% p.a.</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={8.0}
                step={0.5}
                value={fireRealReturn}
                onChange={(e) => setFireRealReturn(Number(e.target.value))}
                className="mt-3 w-full accent-gold" />
              
              <p className="mt-1 text-[10px] text-white/50">Assumed real equity + debt return after inflation</p>
            </div>
          </div>

          {/* Output Benchmarks Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase text-white/50 tracking-wider">Current Progress</p>
              <p className="font-display text-xl font-bold text-white mt-1">{fireResult.fireProgressPct}%</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-emerald-400" style={{ width: `${fireResult.fireProgressPct}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase text-white/50 tracking-wider">Withdrawal Capacity Today</p>
              <p className="font-display text-xl font-bold text-emerald-400 mt-1">{formatINR(fireResult.currentMonthlyWithdrawalCapacity)}/mo</p>
              <p className="text-[10px] text-white/50 mt-1">Safe perpetual monthly yield today</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase text-white/50 tracking-wider">Years to FI Crossover</p>
              <p className="font-display text-xl font-bold text-cyan-300 mt-1">{fireResult.yearsToFi} Years</p>
              <p className="text-[10px] text-white/50 mt-1">Projected crossover age: {fireResult.projectedFiAge}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase text-white/50 tracking-wider">Projected FI Date</p>
              <p className="font-display text-xl font-bold text-gold mt-1">Year {fireResult.projectedFiYear}</p>
              <p className="text-[10px] text-white/50 mt-1">At monthly saving rate of {formatINR(monthlySavings)}</p>
            </div>
          </div>

          {/* Lean, Standard, Fat Benchmarks */}
          <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs">
            <span className="text-white/70">
              <strong>LeanFIRE (75%):</strong> {formatINRShort(fireResult.leanFireCorpus)}
            </span>
            <span className="text-white/70">
              <strong>Standard FIRE:</strong> {formatINRShort(fireResult.requiredCorpus)}
            </span>
            <span className="text-white/70">
              <strong>FatFIRE (140%):</strong> {formatINRShort(fireResult.fatFireCorpus)}
            </span>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* Goals Taxonomy & Filter Tabs                                  */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeader
              title="Family Goals Portfolio"
              description="Grouped by investment horizon and milestone priority." />


            <div className="flex flex-wrap items-center gap-2">
              {/* Taxonomy Tabs */}
              <div className="flex flex-wrap gap-1.5 rounded-xl border bg-muted/50 p-1 text-xs">
                <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-semibold transition-all",
                  filter === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>

                All Goals ({goals.length})
              </button>
                <button
                type="button"
                onClick={() => setFilter("short")}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-semibold transition-all",
                  filter === "short" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>

                Short-Term (&lt; 3 yrs)
              </button>
                <button
                type="button"
                onClick={() => setFilter("mid")}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-semibold transition-all",
                  filter === "mid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>

                Mid-Term (3–7 yrs)
              </button>
                <button
                type="button"
                onClick={() => setFilter("long")}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-semibold transition-all",
                  filter === "long" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>

                Long-Term (7+ yrs)
              </button>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setGoalDialog({ open: true, goal: null })}>
                <Plus className="size-4" /> Add goal
              </Button>
            </div>
          </div>

          {/* Goal Cards Grid */}
          {filteredGoals.length > 0 ?
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredGoals.map((g) =>
            <GoalCard key={g.id} goal={g} onDelete={() => removeGoal(g.id)} />
            )}
            </div> :

          <div className="surface-card rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No goals in this view yet. <button type="button" className="text-primary font-semibold underline" onClick={() => setGoalDialog({ open: true, goal: null })}>Add your first goal</button>.
            </div>
          }
        </div>

        <GoalFormDialog
          open={goalDialog.open}
          onOpenChange={(open) => setGoalDialog((prev) => ({ ...prev, open }))}
          initialGoal={goalDialog.goal}
          onSubmit={(goal) => {
            if (goalDialog.goal) {
              updateGoal(goalDialog.goal.id, goal);
            } else {
              const id = addGoal(goal);
              setSelectedGoalId(id);
            }
          }} />

        {/* ------------------------------------------------------------- */}
        {/* Single Goal What-If Simulator                                 */}
        {/* ------------------------------------------------------------- */}
        {selectedGoal &&
        <section className="surface-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <SectionHeader
              title={`Simulate "${selectedGoal.name}" Path`}
              description="Explore alternative monthly commitments and return assumptions, or pick a different goal below." />

              <div className="flex shrink-0 items-center gap-2">
                <select
                value={selectedGoal.id}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="border-input bg-background h-9 rounded-md border px-2 text-xs outline-none focus:ring-1 focus:ring-ring">

                  {goals.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <Button size="sm" variant="outline" onClick={() => setGoalDialog({ open: true, goal: selectedGoal })}>Edit</Button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <WhatIfControl
              label="Monthly contribution"
              value={whatIfMonthly}
              min={0}
              max={100000}
              step={5000}
              display={formatINR}
              onChange={setWhatIfMonthly} />
            
              <WhatIfControl
              label="Years to target"
              value={whatIfYears}
              min={1}
              max={30}
              step={1}
              display={(value) => `${value} years`}
              onChange={setWhatIfYears} />
            
              <WhatIfControl
              label="Expected return"
              value={whatIfReturn}
              min={6}
              max={14}
              step={1}
              display={(value) => `${value}%`}
              onChange={setWhatIfReturn} />
            
            </div>
            <div className="bg-secondary mt-5 grid gap-4 rounded-xl p-4 sm:grid-cols-3">
              <Metric
              label="Current plan projection"
              value={formatINRShort(projectGoal(selectedGoal, selectedGoal.monthlyContribution).projected)} />
            
              <Metric label="Adjusted plan projection" value={formatINRShort(whatIfProjected)} />
              <Metric label="Target goal corpus" value={formatINRShort(selectedGoal.target)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Simulation Result:{" "}
              <strong className="text-foreground">
                {whatIfProjected >= selectedGoal.target ? "On track for full funding" : "Funding gap remains"}
              </strong>
              . Returns are illustrative and subject to market conditions.
            </p>
          </section>
        }
      </div>
    </AppShell>);

}

function WhatIfControl({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange








}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="num text-sm font-semibold">{display(value)}</span>
      </div>
      <input
        className="mt-3 w-full accent-[var(--color-primary)]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))} />
      
    </div>);

}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase text-muted-foreground">{label}</p>
      <p className="num mt-1 text-sm font-semibold">{value}</p>
    </div>);

}