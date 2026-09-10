/**
 * Protect page — insurance gap analysis, third-party product matching, and the
 * commission-based revenue model behind it. Pure functions, computed off the
 * client's real recorded data (income, liabilities, goals, existing policies).
 */
import { clamp, formatINRShort } from "./format";

/** Term life is sized on income replacement + outstanding liabilities + any
 * unfunded goal shortfall — the standard "10x income" rule extended for debt and goals. */
export function computeLifeCoverGap({ annualIncome, totalLiabilities, goalsShortfall, currentLifeCover }) {
  const recommended = annualIncome * 10 + totalLiabilities + Math.max(0, goalsShortfall);
  const gap = Math.max(0, recommended - currentLifeCover);
  return {
    recommended,
    current: currentLifeCover,
    gap,
    coveredPct: recommended > 0 ? clamp(currentLifeCover / recommended * 100) : 100
  };
}

/** Health cover sized on a base floater plus a per-dependent allowance. */
export function computeHealthCoverGap({ dependents, currentHealthCover }) {
  const recommended = 1000000 + Math.max(0, dependents) * 500000;
  const gap = Math.max(0, recommended - currentHealthCover);
  return {
    recommended,
    current: currentHealthCover,
    gap,
    coveredPct: recommended > 0 ? clamp(currentHealthCover / recommended * 100) : 100
  };
}

export const INSURER_CATALOG = [
{
  id: "term-hdfc",
  type: "Term Life",
  insurer: "HDFC Life",
  product: "Click 2 Protect Super",
  claimSettlementRatio: 99.4,
  rating: 4.6,
  commissionPct: 22,
  premiumPerCrorePerYear: 9800
},
{
  id: "health-care",
  type: "Health",
  insurer: "Care Health",
  product: "Care Supreme (Family Floater)",
  claimSettlementRatio: 98.1,
  rating: 4.5,
  commissionPct: 20,
  premiumPerLakhPerYear: 1600
},
{
  id: "accident-bajaj",
  type: "Personal Accident",
  insurer: "Bajaj Allianz",
  product: "Personal Guard",
  claimSettlementRatio: 97.5,
  rating: 4.2,
  commissionPct: 25,
  premiumPerLakhPerYear: 120
},
{
  id: "ci-max",
  type: "Critical Illness",
  insurer: "Max Life",
  product: "Critical Illness Rider Plus",
  claimSettlementRatio: 98.6,
  rating: 4.4,
  commissionPct: 24,
  premiumPerLakhPerYear: 350
}];


/** Builds actionable, priced product recommendations from the computed gaps.
 * Life/Health only appear when a real shortfall exists; Personal Accident and
 * Critical Illness are offered as smart additions since the app doesn't yet
 * track those cover types on existing policies. */
export function buildRecommendations({ lifeGap, healthGap, hasAccidentCover }) {
  const recs = [];

  if (lifeGap.gap > 0) {
    const plan = INSURER_CATALOG.find((p) => p.type === "Term Life");
    const coverCr = lifeGap.gap / 10000000;
    const annualPremium = Math.max(1000, Math.round(coverCr * plan.premiumPerCrorePerYear));
    recs.push({
      ...plan,
      coverAmount: lifeGap.gap,
      annualPremium,
      commission: Math.round(annualPremium * plan.commissionPct / 100),
      priority: "High",
      reason: `Closes your ${formatINRShort(lifeGap.gap)} term life shortfall against income, liabilities and goals.`
    });
  }

  if (healthGap.gap > 0) {
    const plan = INSURER_CATALOG.find((p) => p.type === "Health");
    const coverL = healthGap.gap / 100000;
    const annualPremium = Math.max(1000, Math.round(coverL * plan.premiumPerLakhPerYear));
    recs.push({
      ...plan,
      coverAmount: healthGap.gap,
      annualPremium,
      commission: Math.round(annualPremium * plan.commissionPct / 100),
      priority: "High",
      reason: `Tops up your family floater by ${formatINRShort(healthGap.gap)} to match your household size.`
    });
  }

  if (!hasAccidentCover) {
    const plan = INSURER_CATALOG.find((p) => p.type === "Personal Accident");
    const coverAmount = 5000000;
    const annualPremium = Math.round(coverAmount / 100000 * plan.premiumPerLakhPerYear);
    recs.push({
      ...plan,
      coverAmount,
      annualPremium,
      commission: Math.round(annualPremium * plan.commissionPct / 100),
      priority: "Medium",
      reason: "No personal accident cover on record — a low-cost way to protect income from disability."
    });
  }

  const ciPlan = INSURER_CATALOG.find((p) => p.type === "Critical Illness");
  const ciCoverAmount = 2500000;
  const ciAnnualPremium = Math.round(ciCoverAmount / 100000 * ciPlan.premiumPerLakhPerYear);
  recs.push({
    ...ciPlan,
    coverAmount: ciCoverAmount,
    annualPremium: ciAnnualPremium,
    commission: Math.round(ciAnnualPremium * ciPlan.commissionPct / 100),
    priority: "Low",
    reason: "A lump-sum payout on diagnosis keeps goals and EMIs on track through treatment and recovery."
  });

  const rank = { High: 0, Medium: 1, Low: 2 };
  return recs.sort((a, b) => rank[a.priority] - rank[b.priority]);
}

export function summarizeRevenue(recommendations) {
  return recommendations.reduce(
    (acc, r) => ({
      totalAnnualPremium: acc.totalAnnualPremium + r.annualPremium,
      totalCommission: acc.totalCommission + r.commission
    }),
    { totalAnnualPremium: 0, totalCommission: 0 }
  );
}
