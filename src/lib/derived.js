import { clamp } from "./format";
import { insurance, liabilities, monthlyCashflow } from "./mock-data";
import { nominationAccounts, transferDocs } from "./wealth-extra";









export function defaultNominations() {
  return Object.fromEntries(
    nominationAccounts.map((a) => [
    a.id,
    a.defaultNominee ? { name: a.defaultNominee, relation: "Spouse", share: 100 } : null]
    )
  );
}

export function defaultDocs() {
  return Object.fromEntries(transferDocs.map((d) => [d.id, d.done]));
}











export function nominationSummary(map) {
  const total = nominationAccounts.length;
  const missing = nominationAccounts.filter((a) => !map[a.id]);
  const covered = total - missing.length;
  const totalValue = nominationAccounts.reduce((s, a) => s + a.value, 0);
  const coveredValue = nominationAccounts.
  filter((a) => map[a.id]).
  reduce((s, a) => s + a.value, 0);
  return {
    covered,
    total,
    pct: covered / total * 100,
    coveredValue,
    totalValue,
    valuePct: coveredValue / totalValue * 100,
    missing
  };
}

/** How ready the wealth is to pass on: nominations by value, account coverage and paperwork. */
export function transferScore(map, docs) {
  const n = nominationSummary(map);
  const docPct =
  Object.values(docs).filter(Boolean).length / Math.max(1, Object.keys(docs).length) * 100;
  return Math.round(clamp(n.valuePct * 0.45 + n.pct * 0.3 + docPct * 0.25));
}







export const noExtraCover = { extraLife: 0, extraHealth: 0, criticalIllness: 0 };

export function totalLifeCover(c) {
  return insurance.lifeCover + c.extraLife;
}
export function totalHealthCover(c) {
  return insurance.healthCover + c.extraHealth;
}

/** Standalone protection score, shown alongside the Wealth360 score. */
export function protectionScore(c) {
  const life = clamp(totalLifeCover(c) / insurance.lifeCoverNeeded * 100);
  const health = clamp(totalHealthCover(c) / insurance.healthCoverNeeded * 100);
  const ci = clamp(c.criticalIllness / 2500000 * 100);
  return Math.round(clamp(life * 0.5 + health * 0.32 + ci * 0.18));
}

/** Income-replacement style needs analysis for term cover. */
export function lifeCoverNeedsBreakdown(annualIncome, goalsShortfall) {
  const incomeReplacement = annualIncome * 10;
  const loanPayoff = liabilities.reduce((s, l) => s + l.outstanding, 0);
  const goalFunding = Math.max(0, goalsShortfall);
  return {
    incomeReplacement,
    loanPayoff,
    goalFunding,
    total: incomeReplacement + loanPayoff + goalFunding
  };
}


































export function buildActions(ctx) {
  const out = [];
  const lifeGap = insurance.lifeCoverNeeded - totalLifeCover(ctx.cover);
  const healthGap = insurance.healthCoverNeeded - totalHealthCover(ctx.cover);
  const nom = nominationSummary(ctx.nominations);

  if (lifeGap > 0) {
    out.push({
      id: "life-cover",
      title: `Top up term cover by ${crore(lifeGap)}`,
      detail: `Your family needs about 10x income plus loan payoff. You are short ${crore(lifeGap)}.`,
      impact: "+9 to your score",
      severity: "high",
      to: "/protect",
      cta: "Review cover",
      weight: 9
    });
  }
  if (nom.missing.length > 0) {
    out.push({
      id: "nominations",
      title: `Add nominees to ${nom.missing.length} account${nom.missing.length > 1 ? "s" : ""}`,
      detail: `${crore(nom.totalValue - nom.coveredValue)} of your wealth has no nominee on record.`,
      impact: "+7 transfer readiness",
      severity: "high",
      to: "/know",
      cta: "Add nominees",
      weight: 8
    });
  }
  if (ctx.emergencyMonths < 6) {
    out.push({
      id: "emergency",
      title: `Build your emergency fund to 6 months`,
      detail: `You hold ${ctx.emergencyMonths.toFixed(1)} months of expenses. Target is 6.`,
      impact: "+6 to your score",
      severity: "high",
      to: "/goals",
      cta: "Open goal",
      weight: 6
    });
  }
  if (healthGap > 0) {
    out.push({
      id: "health-cover",
      title: `Raise health cover by ${lakh(healthGap)}`,
      detail: "A family floater plus a super top-up is the cheapest way to close this.",
      impact: "+4 to your score",
      severity: "medium",
      to: "/protect",
      cta: "See options",
      weight: 4
    });
  }
  if (ctx.cover.criticalIllness === 0) {
    out.push({
      id: "critical",
      title: "Add critical illness cover",
      detail: "With a home loan running, a lump-sum payout keeps the EMIs safe.",
      impact: "+3 to your score",
      severity: "medium",
      to: "/protect",
      cta: "See options",
      weight: 3
    });
  }
  if (ctx.taxHeadroom > 0) {
    out.push({
      id: "tax",
      title: `Use ${lakh(ctx.taxHeadroom)} of unused tax deductions`,
      detail: "80C, 80CCD(1B) and 80D headroom is still open for this financial year.",
      impact: "Saves tax now",
      severity: "medium",
      to: "/portfolio",
      cta: "Open tax saver",
      weight: 3
    });
  }
  if (ctx.idleSurplus > 0) {
    out.push({
      id: "idle-cash",
      title: `Move ${lakh(ctx.idleSurplus)} of idle savings to a liquid fund`,
      detail: "Savings interest is 3% against roughly 6.9% in a liquid fund.",
      impact: "+3 to your score",
      severity: "medium",
      to: "/portfolio",
      cta: "Plan it",
      weight: 3
    });
  }
  if (ctx.goalsOffTrack > 0) {
    out.push({
      id: "goals",
      title: `${ctx.goalsOffTrack} goal${ctx.goalsOffTrack > 1 ? "s are" : " is"} behind schedule`,
      detail: "Raising the monthly contribution now costs far less than catching up later.",
      impact: "+5 to your score",
      severity: "high",
      to: "/goals",
      cta: "Fix goals",
      weight: 5
    });
  }
  if (ctx.emiRatioPct > 20) {
    out.push({
      id: "debt",
      title: "Clear the car loan at 9.4% first",
      detail: `EMIs are ${ctx.emiRatioPct.toFixed(0)}% of income. The car loan is your costliest debt.`,
      impact: "+4 to your score",
      severity: "medium",
      to: "/debt",
      cta: "Compare options",
      weight: 4
    });
  }
  if (ctx.largestAssetSharePct > 35) {
    out.push({
      id: "concentration",
      title: `Trim your largest asset class below 35%`,
      detail: `It is ${ctx.largestAssetSharePct.toFixed(0)}% of the portfolio today.`,
      impact: "+2 to your score",
      severity: "low",
      to: "/know",
      cta: "See the map",
      weight: 2
    });
  }
  if (ctx.extraSip === 0) {
    out.push({
      id: "sip",
      title: "Step up your SIP by 8% a year",
      detail: "An annual step-up matched to your raise doubles the corpus over 15 years.",
      impact: "+3 to your score",
      severity: "low",
      to: "/portfolio",
      cta: "Simulate it",
      weight: 2
    });
  }
  if (!Object.values(ctx.docs).every(Boolean)) {
    out.push({
      id: "docs",
      title: "Finish your estate paperwork",
      detail: "A will and an asset register sit above nominations, not beside them.",
      impact: "+5 transfer readiness",
      severity: "low",
      to: "/know",
      cta: "Open checklist",
      weight: 2
    });
  }

  return out.sort((a, b) => b.weight - a.weight);
}

export function nextBestAction(actions) {
  return actions[0] ?? null;
}

export const annualIncome = monthlyCashflow.income * 12;

function crore(v) {
  const abs = Math.abs(v);
  if (abs >= 1_00_00_000) return `₹${round1(abs / 1_00_00_000)} Cr`;
  return `₹${round1(abs / 1_00_000)} L`;
}
function lakh(v) {
  const abs = Math.abs(v);
  if (abs >= 1_00_00_000) return `₹${round1(abs / 1_00_00_000)} Cr`;
  if (abs >= 1_00_000) return `₹${round1(abs / 1_00_000)} L`;
  return `₹${Math.round(abs).toLocaleString("en-IN")}`;
}
function round1(n) {
  return Number(n.toFixed(n < 10 ? 1 : 0));
}