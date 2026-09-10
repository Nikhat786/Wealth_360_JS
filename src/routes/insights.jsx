import { Link } from "react-router-dom";
import {

  ArrowRight,
  Banknote,
  GraduationCap,

  Percent,
  PieChart as PieIcon,
  Receipt,

  ShieldAlert,

  TrendingDown,

  Vault } from
"lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
"recharts";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort, formatPlainPct } from "@/lib/format";
import {
  idleCash,
  insurance,
  largestAssetSharePct,
  monthlyCashflow,
  spendingBreakdown,
  taxSaving } from
"@/lib/mock-data";
import { cn } from "@/lib/utils";


const palette = [
"var(--color-primary)",
"var(--color-gold)",
"var(--color-success)",
"var(--color-muted-foreground)"];
















export default function InsightsPage() {
  const { answers } = useApp();

  const surplus =
  monthlyCashflow.income -
  monthlyCashflow.expenses -
  monthlyCashflow.emi -
  monthlyCashflow.investments;

  const idleExcess = idleCash.savingsBalance - idleCash.idealBalance;
  const lifeGap = monthlyCashflow.income * 12 * 10 - insurance.lifeCover;
  const c80Left = taxSaving.section80cLimit - taxSaving.section80cUsed;

  const insightsList = [
  {
    id: "ins-protection",
    issue: "Term Life Protection Deficit",
    category: "Protection Risk",
    severity: "high",
    icon: ShieldAlert,
    reason: `Current term life cover of ${formatINRShort(insurance.lifeCover)} is only ${(insurance.lifeCover / (monthlyCashflow.income * 12)).toFixed(1)}x annual income against the 10x safety standard.`,
    impact: `A ₹${(lifeGap / 10000000).toFixed(2)} Cr unhedged income gap in the event of primary earner loss.`,
    suggestedAction: "Procure a pure term life top-up of ₹1.5 Cr with level premiums locked in at current age 36.",
    expectedOutcome: "Immediate 100% family income replacement and a +9 point elevation to Wealth Health.",
    actionRoute: "/protect",
    actionText: "Fix Protection Gap"
  },
  {
    id: "ins-education",
    issue: "Child Education Goal Inflation Exposure",
    category: "Education Goal Risk",
    severity: "high",
    icon: GraduationCap,
    reason: "Higher education costs in India and abroad compound at 9–11% education inflation, doubling costs every 7 years.",
    impact: "Projected undergraduate tuition in 2034 lands ~₹14.5 Lakh short of target under standard 6% inflation assumptions.",
    suggestedAction: "Step up the dedicated monthly SIP by ₹6,000 in a balanced advantage or flexi-cap fund.",
    expectedOutcome: "Guarantees complete ₹35 Lakh corpus availability by target year 2034.",
    actionRoute: "/goals",
    actionText: "Adjust Education Goal"
  },
  {
    id: "ins-debt",
    issue: "High-Cost Vehicle & Personal Debt Drag",
    category: "Debt Alert",
    severity: "high",
    icon: Percent,
    reason: "Car loan at 9.2% interest costs significantly more than conservative post-tax fixed-income yields.",
    impact: "Unnecessary guaranteed interest outflow of ₹1.85 Lakh remaining over the next 4 years.",
    suggestedAction: "Apply ₹15,000/month of unallocated surplus towards car loan principal prepayment.",
    expectedOutcome: "Clears debt 19 months earlier, saving ~₹78,000 in direct interest and boosting monthly investible surplus.",
    actionRoute: "/debt",
    actionText: "Open Debt Optimiser"
  },
  {
    id: "ins-retirement",
    issue: "Retirement Milestone Funding Gap",
    category: "Retirement Gap",
    severity: "medium",
    icon: TrendingDown,
    reason: "At current monthly contribution of ₹20,000, projected corpus reaches ₹3.38 Cr vs. the ₹4.0 Cr inflation-adjusted target.",
    impact: "Retirement funding falls roughly 15% short, risking early capital depletion past age 75.",
    suggestedAction: "Increase monthly equity SIPs by ₹10,000 and maximize annual ₹50,000 NPS Tier-I contribution.",
    expectedOutcome: "Closes the ₹62 Lakh retirement gap and adds +12 points to Wealth Readiness.",
    actionRoute: "/goals",
    actionText: "Model Retirement Path"
  },
  {
    id: "ins-tax",
    issue: "Unclaimed Section 80C & 80CCD Deductions",
    category: "Tax Opportunity",
    severity: "medium",
    icon: Receipt,
    reason: `You have ${formatINR(c80Left)} of 80C headroom and ₹50,000 of 80CCD(1B) NPS allowance remaining unutilized.`,
    impact: `Cash leakage of ~${formatINR(Math.round((c80Left + 50000) * 0.312))} in avoidable income tax at your 31.2% slab.`,
    suggestedAction: "Deploy ₹50,000 into NPS Tier-I and remainder into top-rated 3-year ELSS equity funds before March 31.",
    expectedOutcome: "Instant tax deduction savings of ~₹46,800 retained directly in your wealth compounding pool.",
    actionRoute: "/insights",
    actionText: "Review Tax Options"
  },
  {
    id: "ins-nomination",
    issue: "Unregistered Account Nominations",
    category: "Nomination Risk",
    severity: "medium",
    icon: Vault,
    reason: "2 out of 5 financial investment accounts do not have an active nominee on institutional record.",
    impact: "In emergency situations, asset transfer will face legal delays, institutional holding periods, and court certification.",
    suggestedAction: "Complete the 3-step digital nomination flow in WealthVerse Transfer to assign spouse as 100% nominee.",
    expectedOutcome: "Lifts Wealth Continuity Score from 65 to 88+ and ensures seamless intergenerational transmission.",
    actionRoute: "/transfer",
    actionText: "Complete Nominations"
  },
  {
    id: "ins-idle",
    issue: "Idle Cash Inflation Erosion",
    category: "Liquidity Drag",
    severity: "low",
    icon: Banknote,
    reason: `Holding ${formatINRShort(idleCash.savingsBalance)} in bank savings accounts earning only ${idleCash.savingsRate}% annual interest.`,
    impact: `Foregoing ~${formatINR(Math.round(idleExcess * (idleCash.liquidFundRate - idleCash.savingsRate) / 100))} per year compared to instant-redemption liquid funds.`,
    suggestedAction: "Move ₹2.5 Lakh of surplus savings into a high-liquidity overnight or liquid fund.",
    expectedOutcome: "Yield jumps from 3.0% to ~6.9% while retaining T+0 same-day withdrawal access.",
    actionRoute: "/portfolio",
    actionText: "Rebalance Cash"
  },
  {
    id: "ins-concentration",
    issue: "Asset Class Allocation Concentration",
    category: "Concentration Risk",
    severity: "low",
    icon: PieIcon,
    reason: `Single largest asset class accounts for ${formatPlainPct(largestAssetSharePct, 1)} of total portfolio assets.`,
    impact: "Heightened portfolio volatility and drawdowns during sector or asset-specific market pullbacks.",
    suggestedAction: "Channel fresh monthly investments into fixed income, gold SGBs, and international equities.",
    expectedOutcome: "Smooths drawdowns and bounds largest asset class comfortably below the 35% comfort line.",
    actionRoute: "/portfolio",
    actionText: "View Allocation"
  }];


  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
              Adaptive Intelligence
            </span>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              WealthVerse Insights
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every insight structured with Issue, Root Reason, Quantified Impact, Suggested Action, and Expected Outcome.
            </p>
          </div>

          <span className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-semibold text-foreground">
            Profile Calibrated: <strong className="text-primary">Personalized</strong>
          </span>
        </div>

        <PillarNav />

        {/* Top Metric Tiles */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="navy" label="Monthly income" value={formatINR(monthlyCashflow.income)} />
          <StatTile label="Expenses" value={formatINR(monthlyCashflow.expenses)} />
          <StatTile label="EMIs" value={formatINR(monthlyCashflow.emi)} />
          <StatTile
            label="Unallocated surplus"
            value={formatINR(surplus)}
            sub={surplus > 0 ? "Available to optimize" : "Overcommitted"} />
          
        </div>

        {/* Monthly Spending Breakdown Chart */}
        <div className="surface-card p-5">
          <SectionHeader
            title="Monthly Cashflow Ingestion"
            description="Recurring spending breakdown across household, commitments, and lifestyle." />
          
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingBreakdown} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatINRShort(v)}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11} />
                
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={130}
                  fontSize={11} />
                
                <Tooltip
                  formatter={(v) => formatINR(Number(v))}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12
                  }} />
                
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {spendingBreakdown.map((_, i) =>
                  <Cell key={i} fill={palette[i % palette.length]} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Adaptive 5-Part Insights Grid                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <SectionHeader
            title="Actionable Opportunities & Risk Radar"
            description="Prioritized by financial consequence to your household." />
          

          <div className="grid gap-5 md:grid-cols-2">
            {insightsList.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="surface-card flex flex-col justify-between rounded-3xl border p-5 shadow-sm transition-all hover:shadow-md sm:p-6">
                  
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-xl",
                            item.severity === "high" ?
                            "bg-rose-500/10 text-rose-600" :
                            item.severity === "medium" ?
                            "bg-amber-500/10 text-amber-600" :
                            "bg-primary/10 text-primary"
                          )}>
                          
                          <Icon className="size-4.5" />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {item.category}
                          </span>
                          <h3 className="font-display text-base font-bold text-foreground">
                            {item.issue}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          item.severity === "high" ?
                          "bg-rose-500/10 text-rose-600" :
                          item.severity === "medium" ?
                          "bg-amber-500/10 text-amber-600" :
                          "bg-muted text-muted-foreground"
                        )}>
                        
                        {item.severity} priority
                      </span>
                    </div>

                    {/* 5-part structure */}
                    <div className="space-y-2 text-xs pt-1">
                      <div className="rounded-xl border bg-muted/30 p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          1. Root Reason
                        </p>
                        <p className="mt-0.5 text-foreground leading-relaxed">{item.reason}</p>
                      </div>

                      <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-2.5 text-rose-950 dark:text-rose-200">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                          2. Quantified Impact
                        </p>
                        <p className="mt-0.5 font-medium leading-relaxed">{item.impact}</p>
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                          3. Suggested Action
                        </p>
                        <p className="mt-0.5 text-foreground leading-relaxed">{item.suggestedAction}</p>
                      </div>

                      <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-2.5 text-emerald-950 dark:text-emerald-200">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          4. Expected Outcome
                        </p>
                        <p className="mt-0.5 font-medium leading-relaxed">{item.expectedOutcome}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 mt-2 border-t flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground italic">
                      Grounded in profile data
                    </span>
                    <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs">
                      <Link to={item.actionRoute}>
                        {item.actionText} <ArrowRight className="ml-1 size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </article>);

            })}
          </div>
        </div>
      </div>
    </AppShell>);

}