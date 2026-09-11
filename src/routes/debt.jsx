import { ArrowRight, MessageSquareText, Scale, ShieldAlert } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { RecommendationGuardrails } from "@/components/wealth/recommendation-guardrails";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { derivedIncome, useApp } from "@/context/app-context";
import { debtSummary, repaymentStrategy } from "@/lib/debt";
import { formatINR, formatINRShort } from "@/lib/format";


export default function DebtPage() {
  const { answers, discussWithSheru } = useApp();
  const [extraMonthly, setExtraMonthly] = useState(15000);
  const liabilities = answers?.liabilities || [];
  const summary = debtSummary(liabilities, derivedIncome(answers));
  const accelerated = repaymentStrategy(summary, extraMonthly);
  const hybrid = repaymentStrategy(summary, Math.round(extraMonthly / 2));
  const highestCost = summary.highestCost;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeader as="h1" title="Debt Optimiser" description="Find a smarter balance between repaying debt and growing your wealth." />
          <Button size="sm" variant="outline" onClick={() => discussWithSheru("How can I optimize my loans, reduce EMIs, and save on interest with prepayment?")}>
            <MessageSquareText className="mr-1.5 size-3.5" /> Discuss with SHERU
          </Button>
        </div>
        <PillarNav />
        <section className="gradient-navy text-navy-foreground rounded-2xl p-6 sm:p-8">
          <p className="text-gold text-xs font-semibold tracking-wide uppercase">Grow · Debt Optimiser</p>
          <h2 className="font-display mt-2 text-2xl font-semibold">What should you do about your debt?</h2>
          <p className="mt-2 max-w-2xl text-sm opacity-80">Compare repayment, investing and hybrid paths using your recorded liabilities and monthly cashflow. These are illustrative projections, not financial advice.</p>
        </section>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile tone="navy" label="Outstanding debt" value={formatINRShort(summary.totalOutstanding)} />
          <StatTile label="Total EMI" value={formatINR(summary.totalEmi)} />
          <StatTile label="Debt-to-income" value={`${summary.debtToIncome.toFixed(0)}%`} sub={`${summary.weightedRate.toFixed(1)}% weighted rate`} />
        </div>
        {highestCost && <section className="surface-card border-destructive/30 p-5"><div className="flex items-start gap-3"><ShieldAlert className="text-destructive mt-0.5 size-5" /><div><p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">Priority alert</p><h2 className="mt-1 text-base font-semibold">{highestCost.type} is your highest-cost debt</h2><p className="text-muted-foreground mt-1 text-sm">{highestCost.interestRate}% annualised interest on {formatINRShort(highestCost.outstandingAmount)} outstanding.</p></div></div><RecommendationGuardrails data={{ why: "Your recorded liabilities show a materially higher interest rate on this balance than your other debt.", considered: ["Outstanding balance", "Interest rate", "Monthly EMI", "Recorded monthly income", "Other recorded liabilities"], missing: ["Future income changes", "Unreported assets or liabilities", "Tax circumstances", "Refinancing eligibility", "Contractual restrictions and rate changes", "Market volatility"], confidence: "Medium", freshness: "Based on your current recorded liabilities" }} /></section>}
        <section><SectionHeader title="Compare your options" description="There is no single answer. Explore the trade-offs before deciding." /><div className="mt-4 overflow-x-auto"><div className="grid min-w-[720px] grid-cols-4 gap-3"><Strategy title="Stay the course" detail="Continue existing EMI schedule" value={`${accelerated.baselineYears} yrs`} sub="Debt-free estimate" /><Strategy title="Accelerate debt" detail={`Add ${formatINR(extraMonthly)}/month`} value={`${accelerated.acceleratedYears} yrs`} sub={`${formatINRShort(accelerated.interestSaved)} interest estimate saved`} tone /><Strategy title="Invest more" detail="Keep debt schedule, invest surplus" value="Higher market exposure" sub="Returns are uncertain" /><Strategy title="Hybrid" detail="Split surplus between both" value={`${hybrid.acceleratedYears} yrs`} sub="Balanced illustrative path" /></div></div></section>
        <section className="surface-card p-5"><SectionHeader title="Repayment strategy" description="Model how an additional monthly amount could change the trade-off." /><div className="mt-5 max-w-xl"><div className="flex items-baseline justify-between gap-3"><span className="text-sm font-medium">Additional repayment</span><span className="num text-sm font-semibold">{formatINR(extraMonthly)}/month</span></div><input className="mt-4 w-full accent-[var(--color-primary)]" type="range" min="0" max="50000" step="5000" value={extraMonthly} onChange={(event) => setExtraMonthly(Number(event.target.value))} /></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label="Time saved" value={`${accelerated.monthsSaved} months`} /><Metric label="Interest saved" value={formatINRShort(accelerated.interestSaved)} /><Metric label="Monthly impact" value={formatINR(extraMonthly)} /></div><p className="text-muted-foreground mt-5 text-xs leading-relaxed">Illustrative projection. Investment returns are subject to market risk. Actual loan terms, prepayment rules and future rates may change.</p></section>
        <section className="grid gap-6 lg:grid-cols-2"><div><SectionHeader title="Your recorded liabilities" /><div className="mt-4 space-y-3">{liabilities.map((loan) => <div key={loan.id} className="surface-card flex items-center gap-3 p-4"><Scale className="text-primary size-4" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{loan.type}</p><p className="text-muted-foreground text-xs">{loan.provider} · {loan.remainingTenure} years remaining</p></div><div className="text-right"><p className="num text-sm font-semibold">{formatINRShort(loan.outstandingAmount)}</p><p className="text-muted-foreground num text-xs">{loan.interestRate}% · {formatINR(loan.emi)}/mo</p></div></div>)}</div></div><div className="surface-card p-5"><SectionHeader title="Debt → goals" description="Your monthly surplus is finite, so every choice has a trade-off." /><div className="mt-4 space-y-3 text-sm"><p>Accelerating debt may bring the debt-free date forward.</p><p className="text-muted-foreground text-xs">The same additional amount invested could improve long-term goal funding, but outcomes are market-linked and uncertain.</p><Button asChild variant="outline" size="sm"><a href="/goals">Review goals <ArrowRight className="size-3.5" /></a></Button></div></div></section>
      </div>
    </AppShell>);

}

function Strategy({ title, detail, value, sub, tone }) {return <div className={`surface-card p-4 ${tone ? "border-primary ring-1 ring-primary/20" : ""}`}><p className="text-sm font-semibold">{title}</p><p className="text-muted-foreground mt-1 min-h-8 text-xs">{detail}</p><p className="font-display mt-4 text-lg font-semibold">{value}</p><p className="text-muted-foreground mt-1 text-xs">{sub}</p></div>;}
function Metric({ label, value }) {return <div><p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p><p className="num mt-1 text-sm font-semibold">{value}</p></div>;}