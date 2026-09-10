import { Link } from "react-router-dom";
import { ArrowRight, Vault } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { DnaCard } from "@/components/wealth/dna-card";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { WealthMap, mapIcons } from "@/components/wealth/wealth-map";
import { useApp, derivedExpenses, derivedIncome } from "@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";







import {
  assetProfile,
  debtToIncome,
  expenseHeads,
  family,
  incomeSources,
  lifeStage } from
"@/lib/wealth360";

import { cn } from "@/lib/utils";


export default function KnowPage() {
  const { answers, goals, goalsOffTrack, lifeCover, healthCover, dna, nominations_summary, totalAssets, totalLiabilities, netWorth } =
  useApp();
  const income = derivedIncome(answers);
  const expenses = derivedExpenses(answers);
  const flows = { savingsRate: income > 0 ? (income - expenses) / income * 100 : 0 };
  const emi = (answers?.homeLoanEmi || 0) + (answers?.carLoanEmi || 0) + (answers?.personalLoanEmi || 0);

  const liabilities = answers.liabilities || [];

  const allocationMap = (answers.assets || []).reduce((acc, h) => {
    acc[h.type] = (acc[h.type] || 0) + h.currentValue;
    return acc;
  }, {});

  const allocation = Object.entries(allocationMap).map(([name, value]) => ({
    name,
    value,
    share: totalAssets > 0 ? value / totalAssets * 100 : 0
  })).sort((a, b) => b.value - a.value);

  const lifeCoverNeeded = income * 10 + totalLiabilities;
  const healthCoverNeeded = 1000000;

  const nodes = [
  {
    id: "person",
    layer: "Person",
    icon: mapIcons.person,
    headline: `${answers?.name || "Rahul Mehta"}, ${answers?.age || 36}`,
    detail: `${answers?.city || "Mumbai"} · ${answers?.maritalStatus || "Married"} · ${lifeStage(answers?.age || 36, answers?.dependents || 0)}`,
    tone: "navy"
  },
  {
    id: "family",
    layer: "Family",
    icon: mapIcons.family,
    headline: `${family.length} people in your circle`,
    detail: family.map((f) => `${f.name.split(" ")[0]} (${f.relation}, ${f.age})`).join(" · "),
    tone: "plain"
  },
  {
    id: "cashflow",
    layer: "Income & cashflow",
    icon: mapIcons.cashflow,
    headline: `${formatINR(income)} in · ${formatINR(expenses)} out`,
    detail: `Monthly surplus ${formatINR(income - expenses)} — a savings rate of ${flows.savingsRate.toFixed(0)}%.`,
    tone: income - expenses > 0 ? "success" : "destructive"
  },
  {
    id: "assets",
    layer: "Assets",
    icon: mapIcons.assets,
    headline: `${formatINRShort(totalAssets)} across ${allocation.length} asset classes`,
    detail: allocation.
    map((a) => `${a.name} ${a.share.toFixed(0)}%`).
    join(" · "),
    tone: "plain"
  },
  {
    id: "liabilities",
    layer: "Liabilities",
    icon: mapIcons.liabilities,
    headline: `${formatINRShort(totalLiabilities)} outstanding`,
    detail: `${liabilities.map((l) => l.type).join(" and ")} · EMIs are ${debtToIncome(emi, income).toFixed(0)}% of income.`,
    tone: debtToIncome(emi, income) > 35 ? "destructive" : "plain"
  },
  {
    id: "goals",
    layer: "Goals",
    icon: mapIcons.goals,
    headline: `${goals.length} goals tracked, ${goalsOffTrack} behind`,
    detail: goals.map((g) => g.name).join(" · "),
    tone: goalsOffTrack > 0 ? "gold" : "success"
  },
  {
    id: "protection",
    layer: "Protection",
    icon: mapIcons.protection,
    headline: `Life ${formatINRShort(lifeCover)} · Health ${formatINRShort(healthCover)}`,
    detail: `Assessed need is ${formatINRShort(lifeCoverNeeded)} of life cover and ${formatINRShort(healthCoverNeeded)} of health cover.`,
    tone: lifeCover < lifeCoverNeeded ? "destructive" : "success"
  },
  {
    id: "transfer",
    layer: "Wealth transfer",
    icon: mapIcons.transfer,
    headline: `${nominations_summary?.covered ?? 0}/${nominations_summary?.total ?? 0} accounts have a nominee`,
    detail: answers?.hasWill ?
    "A will is on record and should be reviewed every few years." :
    "No will on record yet — nomination alone does not decide inheritance.",
    tone: nominations_summary?.missing?.length ? "gold" : "success"
  }];


  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Know — your Wealth Map"
          description="Everything that makes up your financial life, from the person at the centre to the wealth you pass on."
          action={
          <Button asChild variant="outline">
              <Link to="/transfer">
                <Vault className="mr-1.5 size-4" /> Family Wealth Vault
              </Link>
            </Button>
          } />
        

        <PillarNav />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile tone="navy" label="Net worth" value={formatINRShort(netWorth)} sub="Assets minus liabilities" />
          <StatTile label="Monthly surplus" value={formatINR(income - expenses)} sub={`${flows.savingsRate.toFixed(0)}% savings rate`} />
          <StatTile label="Debt-to-income" value={`${debtToIncome(emi, income).toFixed(0)}%`} sub="Healthy is under 35%" />
          <StatTile label="Dependents" value={String(answers.dependents)} sub={lifeStage(answers.age, answers.dependents)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <SectionHeader title="Your financial life, layer by layer" description="Each layer feeds the one below it." />
            <div className="mt-4">
              <WealthMap nodes={nodes} />
            </div>
          </div>

          <div className="space-y-6">
            <DnaCard archetype={dna.archetype} blurb={dna.blurb} dims={dna.dims} />

            <div className="surface-card p-5">
              <SectionHeader title="Cashflow detail" description="Where the money comes from and goes." />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Breakdown title="Income" rows={incomeSources} tone="success" />
                <Breakdown title="Expenses" rows={expenseHeads} tone="destructive" />
              </div>
            </div>
          </div>
        </div>

        <section>
          <SectionHeader
            title="Financial X-Ray"
            description="The same wealth, viewed through liquidity and risk."
            action={
            <Button asChild variant="ghost" size="sm">
                <Link to="/portfolio">
                  Holdings <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            } />
          
          <div className="surface-card mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-xs">
                  <th className="p-3 font-medium">Asset class</th>
                  <th className="p-3 font-medium">Value</th>
                  <th className="p-3 font-medium">Share</th>
                  <th className="p-3 font-medium">Liquidity</th>
                  <th className="p-3 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allocation.map((a) => {
                  const p = assetProfile[a.name] ?? { liquidity: "Medium", risk: "Moderate" };
                  return (
                    <tr key={a.name}>
                      <td className="p-3 font-medium">{a.name}</td>
                      <td className="num p-3">{formatINRShort(a.value)}</td>
                      <td className="num p-3">{a.share.toFixed(1)}%</td>
                      <td className="p-3 text-xs">{p.liquidity}</td>
                      <td className="p-3 text-xs">{p.risk}</td>
                    </tr>);

                })}
                <tr className="bg-muted/40">
                  <td className="p-3 font-semibold">Liabilities</td>
                  <td className="num text-destructive p-3 font-semibold">
                    −{formatINRShort(totalLiabilities)}
                  </td>
                  <td className="p-3" colSpan={3}>
                    <span className="text-muted-foreground text-xs">
                      {liabilities.map((l) => `${l.name} at ${l.rate}%`).join(" · ")}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>);

}

function Breakdown({
  title,
  rows,
  tone




}) {
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <div>
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{title}</p>
      <p className="num font-display mt-1 text-xl font-semibold">{formatINR(total)}</p>
      <ul className="mt-3 space-y-2">
        {rows.
        filter((r) => r.value > 0).
        map((r) =>
        <li key={r.label}>
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="text-muted-foreground truncate">{r.label}</span>
                <span className="num font-medium">{formatINR(r.value)}</span>
              </div>
              <div className="bg-muted mt-1 h-1 overflow-hidden rounded-full">
                <div
              className={cn("h-full rounded-full", tone === "success" ? "bg-success" : "bg-gold")}
              style={{ width: `${r.value / total * 100}%` }} />
            
              </div>
            </li>
        )}
      </ul>
    </div>);

}