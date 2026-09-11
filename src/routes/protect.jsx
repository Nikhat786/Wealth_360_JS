import { Link } from "react-router-dom";
import { ArrowRight, MessageSquareText, ShieldCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { derivedIncome, useApp } from "@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";
import {
  buildRecommendations,
  computeHealthCoverGap,
  computeLifeCoverGap } from
"@/lib/insurance-marketplace";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES = {
  High: "bg-red-500/15 text-red-600",
  Medium: "bg-amber-500/15 text-amber-700",
  Low: "bg-muted text-muted-foreground"
};

export default function ProtectPage() {
  const { answers, totalLiabilities, goalsShortfall, discussWithSheru, canAccessRM, setRmOpen } = useApp();

  const annualIncome = derivedIncome(answers) * 12;
  const lifeGap = computeLifeCoverGap({
    annualIncome,
    totalLiabilities,
    goalsShortfall,
    currentLifeCover: answers.lifeCover
  });
  const healthGap = computeHealthCoverGap({
    dependents: answers.dependents,
    currentHealthCover: answers.healthCover
  });
  const hasAccidentCover = answers.insurancePolicies.some((p) => p.type === "Personal Accident");

  const recommendations = buildRecommendations({ lifeGap, healthGap, hasAccidentCover });
  const totalGap = lifeGap.gap + healthGap.gap;

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Protect"
          description="Make sure your family and assets stay covered — matched to your real numbers, not guesswork." />


        <PillarNav />

        {/* Existing Coverage Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile
            label="Term Life Cover"
            value={formatINR(answers.lifeCover)}
            hint={
            lifeGap.gap > 0 ?
            `Gap of ${formatINR(lifeGap.gap)} against recommendation` :
            "Adequately covered"
            }
            tone={lifeGap.gap > 0 ? "warning" : "positive"} />
          
          <StatTile
            label="Health Cover"
            value={formatINR(answers.healthCover)}
            hint={
            healthGap.gap > 0 ?
            `Gap of ${formatINR(healthGap.gap)} for family size ${answers.dependents}` :
            "Meets guideline"
            }
            tone={healthGap.gap > 0 ? "warning" : "positive"} />
          
          <StatTile
            label="Accident Cover"
            value={hasAccidentCover ? "Active" : "None"}
            hint={hasAccidentCover ? "Policy on record" : "Recommended: ₹50L personal accident"}
            tone={hasAccidentCover ? "positive" : "danger"} />
          
        </div>

        {/* Gap alert banner if any gap */}
        {totalGap > 0 &&
        <div className="surface-card flex items-start gap-3 border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                You have an estimated coverage gap of {formatINRShort(totalGap)}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Based on your income of {formatINR(annualIncome)}/yr, outstanding liabilities of{" "}
                {formatINR(totalLiabilities)}, and family goals shortfall of {formatINR(goalsShortfall)}.
              </p>
            </div>
          </div>
        }

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader title="Recommended for you" description="Matched to your actual gaps, sourced from partner insurers." />
            <div className="flex flex-wrap gap-2">
              {canAccessRM &&
              <Button size="sm" variant="outline" onClick={() => setRmOpen(true)}>
                  Ask RM to review
                </Button>
              }
              <Button size="sm" variant="outline" onClick={() => discussWithSheru("Can you explain my insurance gaps and recommended policies in detail?")}>
                <MessageSquareText className="mr-1.5 size-3.5" /> Discuss with SHERU
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((r) => <ProductCard key={r.id} rec={r} />)}
          </div>
        </div>

        {/* Existing policies on record */}
        <div className="surface-card p-5">
          <SectionHeader title="Your policies on record" description="Captured during onboarding — update anytime." />
          {answers.insurancePolicies.length > 0 ?
          <div className="mt-4 grid gap-3 md:grid-cols-2">
              {answers.insurancePolicies.map((p) =>
            <div key={p.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{p.insurer}</p>
                      <p className="text-muted-foreground text-xs">{p.type} · {formatINRShort(p.sumAssured)} cover</p>
                    </div>
                    <ShieldCheck className="text-success size-4 shrink-0" />
                  </div>
                  <p className="text-muted-foreground num mt-3 text-xs">
                    Premium {formatINR(p.premium)}/yr · Nominee {p.nominee || "Not added"}
                  </p>
                </div>
            )}
            </div> :

          <p className="text-muted-foreground mt-3 text-sm">No policies on record yet.</p>
          }
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/wealth360/journey">Update in your Wealth360 journey</Link>
          </Button>
        </div>
      </div>
    </AppShell>);

}

function CoverBar({ label, current, recommended, pct }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{formatINRShort(current)} of {formatINRShort(recommended)} recommended</span>
      </div>
      <div className="bg-muted mt-1.5 h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full", pct >= 90 ? "bg-success" : pct >= 50 ? "bg-amber-500" : "bg-destructive")}
          style={{ width: `${Math.min(100, pct)}%` }} />

      </div>
    </div>);

}

function ProductCard({ rec }) {
  return (
    <div className="surface-card space-y-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase", PRIORITY_STYLES[rec.priority])}>
            {rec.priority} priority
          </span>
          <p className="mt-1.5 text-sm font-semibold">{rec.product}</p>
          <p className="text-muted-foreground text-xs">{rec.insurer} · {rec.type}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600">
          <Star className="size-3.5 fill-amber-500 text-amber-500" /> {rec.rating}
        </span>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">{rec.reason}</p>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Cover amount</p>
          <p className="font-semibold text-foreground">{formatINRShort(rec.coverAmount)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Est. annual premium</p>
          <p className="font-semibold text-foreground">{formatINR(rec.annualPremium)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Claim settlement</p>
          <p className="font-semibold text-foreground">{rec.claimSettlementRatio}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button size="sm" className="bg-primary">
          Get Quote <ArrowRight className="ml-1 size-3.5" />
        </Button>
        <Button size="sm" variant="outline">Compare plans</Button>
      </div>
    </div>);

}
