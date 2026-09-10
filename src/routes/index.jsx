import { Link } from "react-router-dom";
import {
  ArrowRight,

  IndianRupee,
  Landmark,
  PiggyBank,

  TrendingUp } from
"lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
"recharts";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { AttentionPanel } from "@/components/wealth/attention-panel";
import { RiskProfilePrompt } from "@/components/wealth/risk-profile-prompt";
import { StressMode } from "@/components/wealth/stress-mode";

import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { WealthMap, mapIcons } from "@/components/wealth/wealth-map";
import { SheruHeroCard } from "@/components/wealth/sheru-hero-card";
import { derivedExpenses, derivedIncome, useApp } from "@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";
import { projectGoal } from "@/lib/goal-math";
import { netWorthHistory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";


export default function Dashboard() {
  const {
    answers,
    score,
    goals,
    protection,
    wealthReadiness,
    wealthContinuity,
    nextAction,
    stressMode,
    totalAssets,
    netWorth,
    totalLiabilities
  } = useApp();

  const totalInvested = answers.assets.reduce((sum, a) => sum + a.investedValue, 0);

  const income = derivedIncome(answers);
  const expenses = derivedExpenses(answers);
  const surplus = income - expenses;
  const gain = totalAssets - totalInvested;

  const mapNodes = [
  {
    id: "cashflow",
    layer: "Cashflow",
    icon: mapIcons.cashflow,
    headline: `${formatINRShort(surplus)} monthly surplus`,
    detail: `${formatINRShort(income)} income against ${formatINRShort(expenses)} expenses.`,
    tone: surplus > 0 ? "success" : "destructive"
  },
  {
    id: "assets",
    layer: "Assets",
    icon: mapIcons.assets,
    headline: formatINRShort(totalAssets),
    detail: `${formatINRShort(totalInvested)} invested across your portfolio.`,
    tone: "navy"
  },
  {
    id: "goals",
    layer: "Goals",
    icon: mapIcons.goals,
    headline: `${goals.length} goals in motion`,
    detail: `${goals.filter((goal) => goal.monthlyContribution > 0).length} have active monthly contributions.`,
    tone: "gold"
  }];


  if (stressMode) {
    return (
      <AppShell>
        <StressMode />
      </AppShell>);

  }

  return (
    <AppShell>
      <div className="space-y-8">
        <RiskProfilePrompt />

        {/* ------------------------------------------------------------- */}
        {/* SHERU AI RELATIONSHIP MANAGER HERO CARD                       */}
        {/* ------------------------------------------------------------- */}
        <SheruHeroCard />

        {/* Three Primary Scores */}
        <section>
          <SectionHeader
            title="Your WealthVerse Dimensions"
            description="Where you stand today, readiness for tomorrow, and continuity for your family." />
          
          <div className="surface-card mt-3 grid divide-y p-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Dimension
              label="Wealth Health"
              value={score.total}
              description="Healthy today · 6 pillars"
              tone="health" />
            
            <Dimension
              label="Wealth Readiness"
              value={wealthReadiness}
              description="Preparing for future goals"
              tone="readiness" />
            
            <Dimension
              label="Wealth Continuity"
              value={wealthContinuity}
              description="Family preparedness & nominations"
              tone="continuity" />
            
          </div>
        </section>

        {/* Net Worth & Stat Tiles */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            tone="navy"
            label="Net worth"
            value={formatINRShort(netWorth)}
            sub="Assets minus liabilities"
            change={4.2}
            icon={Landmark} />
          
          <StatTile
            label="Total assets"
            value={formatINRShort(totalAssets)}
            sub={`${formatINRShort(gain)} unrealised gain`}
            change={2.8}
            icon={TrendingUp} />
          
          <StatTile
            label="Liabilities"
            value={formatINRShort(totalLiabilities)}
            sub="Home & vehicle debt"
            change={-1.1}
            icon={IndianRupee} />
          
          <StatTile
            label="Monthly investing"
            value={formatINR(surplus)}
            sub={`${Math.max(0, Math.round(surplus / Math.max(1, income) * 100))}% savings rate`}
            icon={PiggyBank} />
          
        </div>

        {/* 12-Month Net Worth Trend AreaChart */}
        <div className="surface-card p-5">
          <SectionHeader
            title="Net worth trajectory"
            description="12-month evolution of total assets against amortizing liabilities." />
          
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthHistory}>
                <defs>
                  <linearGradient id="assetsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="liabFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis
                  tickFormatter={(v) => formatINRShort(v)}
                  tickLine={false}
                  axisLine={false}
                  width={64}
                  fontSize={11} />
                
                <Tooltip
                  formatter={(v) => formatINR(Number(v))}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12
                  }} />
                
                <Area
                  type="monotone"
                  dataKey="assets"
                  name="Assets"
                  stroke="var(--color-primary)"
                  fill="url(#assetsFill)"
                  strokeWidth={2} />
                
                <Area
                  type="monotone"
                  dataKey="liabilities"
                  name="Liabilities"
                  stroke="var(--color-gold)"
                  fill="url(#liabFill)"
                  strokeWidth={2} />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attention Panel & Next Best Action */}
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <AttentionPanel limit={3} />
          </div>
          <div className="surface-card flex flex-col justify-between p-5">
            <div>
              <p className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground">
                Next Best Action
              </p>
              <h2 className="font-display mt-2 text-lg font-semibold">
                {nextAction?.title ?? "Your financial picture is in good shape"}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {nextAction?.detail ?? "Review your WealthVerse regularly as life and markets evolve."}
              </p>
            </div>
            <Button asChild size="sm" className="mt-5 self-start bg-primary text-primary-foreground">
              <Link to={nextAction?.to ?? "/score"}>
                Take action <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Goals Grid */}
        <section>
          <SectionHeader
            title="Family Goals & Milestones"
            description="Live tracking across education, retirement, home and lifestyle goals."
            action={
            <Button asChild variant="ghost" size="sm">
                <Link to="/goals">
                  View all goals & FIRE <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            } />
          
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {goals.
            map((goal) => ({ goal, projection: projectGoal(goal, goal.monthlyContribution) })).
            sort((a, b) => Number(a.projection.onTrack) - Number(b.projection.onTrack)).
            map(({ goal, projection }) =>
            <Link
              key={goal.id}
              to={`/goals/${goal.id}`}
              className="surface-card hover:shadow-raised p-4 transition-shadow">

                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{goal.name}</p>
                    <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    projection.onTrack ?
                    "bg-success-soft text-success" :
                    "bg-warning-soft text-warning-foreground"
                  )}>
                  
                      {projection.onTrack ? "On track" : "Needs attention"}
                    </span>
                  </div>
                  <p className="num mt-2 text-xs text-muted-foreground">
                    {formatINRShort(goal.saved)} → {formatINRShort(goal.target)} · {goal.targetYear}
                  </p>
                  <div className="bg-muted mt-3 h-1.5 overflow-hidden rounded-full">
                    <div
                  className={projection.onTrack ? "bg-success h-full" : "bg-gold h-full"}
                  style={{ width: `${Math.min(100, projection.fundedPct)}%` }} />
                
                  </div>
                  <p className="num mt-2 text-[11px] text-muted-foreground">
                    Progress {Math.round(projection.fundedPct)}%
                    {projection.onTrack ?
                "" :
                ` · Needs ${formatINR(Math.round(projection.requiredMonthly))}/mo`}
                  </p>
                </Link>
            )}
          </div>
        </section>

        {/* Financial X-Ray & Wealth Map */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader
              title="Financial X-Ray"
              description="Core vitals that define the shape of your wealth." />
            
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <StatTile
                label="Monthly income"
                value={formatINRShort(income)}
                sub="All recurring inflows" />
              
              <StatTile
                label="Monthly expenses"
                value={formatINRShort(expenses)}
                sub="Household & commitments" />
              
              <StatTile
                label="Protection score"
                value={`${protection}/100`}
                sub="Life, health & critical illness" />
              
              <StatTile
                label="Total liabilities"
                value={formatINRShort(totalLiabilities)}
                sub="Amortizing loans" />
              
            </div>
          </div>
          <div>
            <SectionHeader title="At a glance" description="Flowing through your universe." />
            <div className="mt-4">
              <WealthMap nodes={mapNodes} />
            </div>
          </div>
        </div>

        {/* Pillar Navigation */}
        {/* <section className="surface-card p-5">
           <SectionHeader
             title="Explore WealthVerse Pillars"
             description="Deep dive into each layer of your wealth operating system."
           />
           <div className="mt-4">
             <PillarNav compact />
           </div>
          </section> */}
      </div>
    </AppShell>);

}

function Dimension({
  label,
  value,
  description,
  tone





}) {
  const toneClass = {
    health: "border-success/30",
    readiness: "border-primary/30",
    continuity: "border-gold/40"
  }[tone];
  return (
    <div className={`border-l-2 px-4 py-3 first:border-l-0 ${toneClass}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold sm:text-sm">{label}</p>
        <p className="font-display text-xl font-semibold">
          {value}
          <span className="text-[10px] font-normal text-muted-foreground"> / 100</span>
        </p>
      </div>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
    </div>);

}