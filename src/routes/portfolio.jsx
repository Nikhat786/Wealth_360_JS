import { Link } from "react-router-dom";
import { MessageSquareText } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { AppShell } from "@/components/wealth/app-shell";
import { Button } from "@/components/ui/button";
import { HoldingsTable } from "@/components/wealth/holdings-table";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { formatINR, formatINRShort, formatPlainPct } from "@/lib/format";
import { bucketAssets, rebalancePlan, riskProfileLabel } from "@/lib/wealth360";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";


const palette = [
"var(--color-primary)",
"var(--color-gold)",
"var(--color-success)",
"var(--color-chart-4, #7c93b8)",
"var(--color-chart-5, #c8b273)",
"var(--color-muted-foreground)"];


export default function PortfolioPage() {
  const { answers, totalAssets, totalLiabilities, discussWithSheru } = useApp();
  const holdings = answers.assets;
  const liabilities = answers.liabilities;
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);

  const gain = totalAssets - totalInvested;
  const gainPct = totalInvested > 0 ? gain / totalInvested * 100 : 0;

  const allocationMap = holdings.reduce((acc, h) => {
    acc[h.type] = (acc[h.type] || 0) + h.currentValue;
    return acc;
  }, {});

  const allocation = Object.entries(allocationMap).map(([name, value]) => ({
    name,
    value,
    share: totalAssets > 0 ? value / totalAssets * 100 : 0
  })).sort((a, b) => b.value - a.value);

  const riskLabel = riskProfileLabel(answers.riskAppetite);
  const { illiquidValue, buckets } = bucketAssets(holdings);
  const reallocationPlan = rebalancePlan(riskLabel, buckets);
  const topDrift = reallocationPlan[0];
  const needsRebalancing = topDrift && Math.abs(topDrift.driftPct) >= 3;

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Portfolio"
          description={`${holdings.length} holdings across ${allocation.length} asset classes.`} />
        

        <PillarNav />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="navy" label="Current value" value={formatINRShort(totalAssets)} />
          <StatTile label="Invested" value={formatINRShort(totalInvested)} />
          <StatTile
            label="Unrealised gain"
            value={formatINRShort(gain)}
            sub={`${formatPlainPct(gainPct, 1)} overall`}
            change={Number(gainPct.toFixed(1))} />
          
          <StatTile label="Loans outstanding" value={formatINRShort(totalLiabilities)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="surface-card p-5">
            <SectionHeader title="Asset allocation" />
            <div className="mt-2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    stroke="none">
                    
                    {allocation.map((_, i) =>
                    <Cell key={i} fill={palette[i % palette.length]} />
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatINR(Number(v))}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12
                    }} />
                  
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2">
              {allocation.map((item, i) =>
              <li key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: palette[i % palette.length] }} />
                  
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">
                      {formatINRShort(item.value)}
                    </span>
                    <span className="w-8 text-right font-semibold text-primary">
                      {Math.round(item.share)}%
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="surface-card overflow-hidden p-5">
            <SectionHeader title="Holdings" description="Sorted by current value." />
            <div className="mt-4">
              <HoldingsTable holdings={holdings} />
            </div>
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeader
              title="SHERU's reallocation suggestions"
              description={`Benchmarked against a ${riskLabel} model portfolio, based on your risk comfort.`} />

            <Button
              size="sm"
              variant="outline"
              onClick={() => discussWithSheru("Can you walk me through my asset allocation drift and reallocation suggestions?")}>

              <MessageSquareText className="mr-1.5 size-3.5" /> Discuss with SHERU
            </Button>
          </div>

          {needsRebalancing ?
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">Highest-priority move</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {topDrift.driftPct > 0 ? "Overweight" : "Underweight"} in {topDrift.name} by {Math.abs(Math.round(topDrift.driftPct))} points
                — {topDrift.action.toLowerCase()} ~{formatINRShort(topDrift.amount)}.
              </p>
            </div> :

          <div className="bg-success-soft text-success mt-4 rounded-xl p-4 text-sm">
              Your liquid allocation is within band of your {riskLabel} target — no rebalancing needed right now.
            </div>
          }

          <div className="mt-4 space-y-3">
            {reallocationPlan.map((bucket) =>
            <div key={bucket.name}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-foreground">{bucket.name}</span>
                  <span className="text-muted-foreground text-right">
                    {Math.round(bucket.currentPct)}% now → {bucket.targetPct}% target
                    {bucket.amount > 0 && ` · ${bucket.action} ~${formatINRShort(bucket.amount)}`}
                  </span>
                </div>
                <div className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                  className={cn("h-full", Math.abs(bucket.driftPct) < 3 ? "bg-success" : "bg-primary")}
                  style={{ width: `${Math.min(100, bucket.currentPct)}%` }} />

                  <div
                  className="bg-foreground/50 absolute top-0 h-full w-0.5"
                  style={{ left: `${Math.min(100, bucket.targetPct)}%` }} />

                </div>
              </div>
            )}
          </div>

          {illiquidValue > 0 &&
          <p className="text-muted-foreground mt-4 text-xs">
              {formatINRShort(illiquidValue)} held in Real Estate / other illiquid assets sits outside this liquid-rebalancing view.
            </p>
          }

          <p className="text-muted-foreground mt-3 text-[11px]">
            Suggestions only, based on your recorded holdings and risk comfort — no trades are placed automatically.
          </p>
        </div>

        <div className="surface-card p-5">
          <SectionHeader title="Loans" description="Outstanding balances and EMIs." />
          <Button asChild variant="outline" size="sm" className="mt-3"><Link to="/debt">Open Debt Optimiser</Link></Button>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {liabilities.map((l) =>
            <div key={l.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{l.type}</p>
                    <p className="text-muted-foreground text-xs">{l.provider}</p>
                  </div>
                  <p className="num font-semibold">{formatINRShort(l.outstandingAmount)}</p>
                </div>
                <div className="text-muted-foreground num mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span>EMI {formatINR(l.emi)}</span>
                  <span>{l.interestRate}% p.a.</span>
                  <span>{l.remainingTenure} yrs left</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>);

}