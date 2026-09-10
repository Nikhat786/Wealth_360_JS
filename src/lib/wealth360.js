/**
 * Wealth360 framework layer — KNOW / GROW / PROTECT / PLAN / TRANSFER.
 * Pure mock data + pure derivations. No backend, no network.
 * Architecture note: every block below is shaped so a future Account
 * Aggregator feed can replace the manual/mock source without UI changes.
 */
import { clamp } from "./format";
import { projectGoal } from "./goal-math";
import {
  allocation } from









"./mock-data";

/* ------------------------------------------------------------------ */
/* KNOW — person, family, cashflow                                     */
/* ------------------------------------------------------------------ */










export const family = [
{ id: "f1", name: "Neha Sharma", relation: "Spouse", age: 32, dependent: false, note: "Works part-time, own health cover through employer" },
{ id: "f2", name: "Aarav Sharma", relation: "Son", age: 7, dependent: true, note: "Undergraduate funding needed from 2038" },
{ id: "f3", name: "Sunita Sharma", relation: "Mother", age: 62, dependent: true, note: "Covered under the family floater" }];


export const lifeStage = (age, dependents) => {
  if (age < 30) return dependents > 0 ? "Young family, early accumulation" : "Early career, wealth building";
  if (age < 45) return dependents > 1 ? "Peak responsibility, family provider" : "Mid career, accumulation";
  if (age < 58) return "Pre-retirement consolidation";
  return "Retirement / distribution";
};

export const incomeSources = [
{ label: "Salary (take-home)", value: 255000 },
{ label: "Annual bonus (monthly equivalent)", value: 25000 },
{ label: "Rental income", value: 0 },
{ label: "Dividends & interest", value: 5000 }];


export const expenseHeads = [
{ label: "Household", value: 38500 },
{ label: "Education", value: 24000 },
{ label: "Loan EMIs", value: 57000 },
{ label: "Insurance premiums", value: 11400 },
{ label: "Lifestyle & travel", value: 17600 },
{ label: "Everything else", value: 19500 }];


export const cashflowTotals = () => {
  const income = incomeSources.reduce((s, i) => s + i.value, 0);
  const expenses = expenseHeads.reduce((s, e) => s + e.value, 0);
  return {
    income,
    expenses,
    surplus: income - expenses,
    savingsRate: (income - expenses) / income * 100
  };
};

/** Liquidity + risk read on each asset class, used by the Financial X-Ray. */
export const assetProfile = {
  Equity: { liquidity: "High", risk: "High" },
  "Mutual Funds": { liquidity: "High", risk: "Moderate" },
  Gold: { liquidity: "Medium", risk: "Moderate" },
  Deposits: { liquidity: "Medium", risk: "Low" },
  Retirement: { liquidity: "Low", risk: "Moderate" },
  "Real Estate": { liquidity: "Low", risk: "Moderate" },
  Cash: { liquidity: "High", risk: "Low" }
};

export const debtToIncome = (emi, income) => income > 0 ? emi / income * 100 : 0;

/* ------------------------------------------------------------------ */
/* Three headline scores                                               */
/* ------------------------------------------------------------------ */

/** How prepared the plan is for future goals (0-100). */
export function readinessScore(goals) {
  if (!goals.length) return 0;
  const rows = goals.map((g) => projectGoal(g, g.monthlyContribution));
  const funded = rows.reduce((s, r) => s + clamp(r.fundedPct), 0) / rows.length;
  const onTrack = rows.filter((r) => r.onTrack).length / rows.length * 100;
  const horizon = rows.reduce((s, r) => s + clamp(r.projected / Math.max(1, r.projected + Math.max(0, r.gap)) * 100), 0) / rows.length;
  return Math.round(clamp(funded * 0.3 + onTrack * 0.4 + horizon * 0.3));
}

export const scoreBand = (v) =>
v >= 75 ? "Strong" : v >= 60 ? "Healthy" : v >= 45 ? "Building" : "Needs work";

/* ------------------------------------------------------------------ */
/* GROW — rebalancing, tax, debt, inflation                            */
/* ------------------------------------------------------------------ */



export const targetAllocations = {
  Conservative: { Equity: 15, "Mutual Funds": 20, Deposits: 25, Gold: 10, Retirement: 20, Cash: 10 },
  Moderate: { Equity: 22, "Mutual Funds": 30, Deposits: 15, Gold: 8, Retirement: 18, Cash: 7 },
  Aggressive: { Equity: 32, "Mutual Funds": 34, Deposits: 8, Gold: 6, Retirement: 15, Cash: 5 }
};

/** Maps a recorded asset's onboarding `type` to a rebalancing bucket. Real Estate and
 * Other Assets are intentionally excluded — illiquid, outside the liquid-rebalancing scope. */
export const ASSET_TYPE_TO_BUCKET = {
  "Stocks": "Equity",
  "ETFs": "Equity",
  "Mutual Funds": "Mutual Funds",
  "FD/RD": "Deposits",
  "Bonds": "Deposits",
  "Gold/SGB": "Gold",
  "EPF/PPF/NPS": "Retirement",
  "Pension": "Retirement",
  "Cash & Savings": "Cash"
};

export function riskProfileLabel(riskAppetite) {
  if (riskAppetite <= 4) return "Conservative";
  if (riskAppetite <= 7) return "Moderate";
  return "Aggressive";
}

/** Groups recorded assets into rebalancing buckets, separating out illiquid holdings
 * (Real Estate, Other Assets) that sit outside the liquid-rebalancing framework. */
export function bucketAssets(assets) {
  const totals = {};
  let illiquidValue = 0;
  for (const asset of assets) {
    const bucket = ASSET_TYPE_TO_BUCKET[asset.type];
    if (!bucket) {
      illiquidValue += asset.currentValue;
      continue;
    }
    totals[bucket] = (totals[bucket] || 0) + asset.currentValue;
  }
  return {
    illiquidValue,
    buckets: Object.entries(totals).map(([name, value]) => ({ name, value }))
  };
}










/** Compares live bucketed holdings (see bucketAssets) against a target model
 * allocation for the given risk profile, sorted by largest drift first. */
export function rebalancePlan(profile, liveBuckets = allocation) {
  const target = targetAllocations[profile] ?? targetAllocations.Moderate;
  const liquidTotal = liveBuckets.reduce((s, a) => s + a.value, 0);
  const names = new Set([...Object.keys(target), ...liveBuckets.map((b) => b.name)]);
  return Array.from(names).
  map((name) => {
    const current = liveBuckets.find((a) => a.name === name);
    const currentValue = current?.value ?? 0;
    const currentPct = liquidTotal > 0 ? currentValue / liquidTotal * 100 : 0;
    const targetPct = target[name] ?? 0;
    const driftPct = currentPct - targetPct;
    const amount = Math.abs(driftPct / 100 * liquidTotal);
    return {
      name,
      currentValue,
      currentPct,
      targetPct,
      driftPct,
      action: Math.abs(driftPct) < 3 ? "In band" : driftPct > 0 ? "Trim over time" : "Add on dips",
      amount: Math.abs(driftPct) < 3 ? 0 : amount
    };
  }).
  sort((a, b) => Math.abs(b.driftPct) - Math.abs(a.driftPct));
}













export function debtStrategies(surplus) {
  const base = 3120000;
  const prepay = Math.max(0, surplus);
  return [
  {
    id: "current",
    name: "Keep current repayment",
    description: "Pay both EMIs as scheduled, invest the surplus as you do today.",
    interestPaid: base,
    debtFree: "Nov 2039",
    wealthAt2035: 21400000,
    note: "Simplest, but the home loan runs its full course."
  },
  {
    id: "high-first",
    name: "Highest interest first",
    description: `Direct ${inr(prepay)} a month at the car loan (9.4%), then the home loan.`,
    interestPaid: Math.round(base - prepay * 5.6),
    debtFree: "Mar 2036",
    wealthAt2035: 19850000,
    note: "Fastest route to debt-free. Lower investible surplus meanwhile."
  },
  {
    id: "balanced",
    name: "Balanced: prepay + invest",
    description: `Split ${inr(prepay)} — half to loan prepayment, half to equity SIPs.`,
    interestPaid: Math.round(base - prepay * 3.1),
    debtFree: "Jul 2037",
    wealthAt2035: 21950000,
    note: "Usually the best all-round outcome, but the equity half is market-linked."
  }];

}

const inr = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

export function inflationImpact(goal, inflation = 6) {
  const years = Math.max(0, goal.targetYear - 2025);
  const futureCost = goal.target * Math.pow(1 + inflation / 100, years);
  return { years, todayCost: goal.target, futureCost, extra: futureCost - goal.target };
}

/* ------------------------------------------------------------------ */
/* Comparison engine (categories, not just funds)                      */
/* ------------------------------------------------------------------ */




















export const compareCategories = [
{
  id: "mf",
  label: "Mutual funds",
  assumption: "Illustrative category ranges, not a forecast for any single scheme.",
  options: [
  { id: "mf1", name: "Flexi-cap fund — illustrative", provider: "Sample AMC A", benefit: "Long-term equity growth", risk: "Market-linked", liquidity: "T+2", tenure: "7 yrs+", cost: "~0.8% TER (direct)", suitability: "Core equity for 7-year-plus goals" },
  { id: "mf2", name: "Balanced advantage — illustrative", provider: "Sample AMC B", benefit: "Lower drawdowns", risk: "Moderate", liquidity: "T+2", tenure: "3-5 yrs", cost: "~1.0% TER", suitability: "Mid-horizon goals like the home upgrade" },
  { id: "mf3", name: "Short-duration debt — illustrative", provider: "Sample AMC C", benefit: "Stability", risk: "Low", liquidity: "T+1", tenure: "1-3 yrs", cost: "~0.4% TER", suitability: "Money needed within three years" }]

},
{
  id: "etf",
  label: "ETFs",
  assumption: "Index-tracking; tracking error and brokerage apply.",
  options: [
  { id: "e1", name: "Nifty 50 ETF — illustrative", provider: "Sample AMC A", benefit: "Broad market", risk: "Market-linked", liquidity: "Intraday", tenure: "7 yrs+", cost: "~0.05%", suitability: "Low-cost core equity" },
  { id: "e2", name: "Gold ETF — illustrative", provider: "Sample AMC D", benefit: "Diversifier", risk: "Moderate", liquidity: "Intraday", tenure: "5 yrs+", cost: "~0.5%", suitability: "Caps your gold at a planned share" }]

},
{
  id: "fd",
  label: "FDs & deposits",
  assumption: "Rates shown are illustrative and change frequently.",
  options: [
  { id: "f1", name: "Bank FD 1 yr — illustrative", provider: "Sample Bank A", benefit: "~7.0% p.a.", risk: "Low", liquidity: "Premature penalty", tenure: "1 yr", cost: "Nil", suitability: "Near-term certainty" },
  { id: "f2", name: "Corporate deposit — illustrative", provider: "Sample NBFC B", benefit: "~7.8% p.a.", risk: "Moderate", liquidity: "Lock-in", tenure: "3 yrs", cost: "Nil", suitability: "Only with rating comfort" },
  { id: "f3", name: "Liquid fund — illustrative", provider: "Sample AMC C", benefit: "~6.9% p.a.", risk: "Low", liquidity: "Same day up to limits", tenure: "Open", cost: "~0.2%", suitability: "Emergency fund parking" }]

},
{
  id: "bond",
  label: "Bonds & NPS",
  assumption: "Yields are indicative and subject to interest-rate risk.",
  options: [
  { id: "b1", name: "G-Sec 10 yr — illustrative", provider: "Government", benefit: "~7.1% yield", risk: "Low", liquidity: "Secondary market", tenure: "10 yrs", cost: "Nil", suitability: "Predictable long-dated income" },
  { id: "b2", name: "NPS Tier-I (E-C-G 50:30:20)", provider: "PFRDA registered", benefit: "Retirement corpus + 80CCD(1B)", risk: "Market-linked", liquidity: "Locked till 60", tenure: "Till 60", cost: "Very low", suitability: "Retirement money you will not touch" }]

},
{
  id: "loan",
  label: "Loans",
  assumption: "Illustrative rates; actual offers depend on credit profile.",
  options: [
  { id: "l1", name: "Home loan balance transfer", provider: "Sample Lender A", benefit: "8.35% vs your 8.6%", risk: "Low", liquidity: "n/a", tenure: "14 yrs left", cost: "~0.5% processing", suitability: "Worth it only if you stay 5+ years" },
  { id: "l2", name: "Car loan prepayment", provider: "Existing lender", benefit: "Removes 9.4% cost", risk: "Low", liquidity: "Uses your cash", tenure: "2 yr 5 mo left", cost: "Foreclosure charges may apply", suitability: "Guaranteed saving vs uncertain returns" }]

}];


/* ------------------------------------------------------------------ */
/* Autopilot, calendar, DNA                                            */
/* ------------------------------------------------------------------ */








export const autopilotAlerts = [
{ id: "ap1", title: "Equity is 4pts above your preferred band", detail: "Equity plus equity funds are 58% of liquid assets against a 54% target for a moderate profile.", tone: "gold" },
{ id: "ap2", title: "FD of ₹2.4 L matures on 18 Nov", detail: "Decide in advance whether it rolls over or funds the emergency goal.", tone: "primary" },
{ id: "ap3", title: "Health policy renews on 02 Dec", detail: "Premium ₹26,800. A super top-up at renewal is usually the cheapest way to scale cover.", tone: "gold" },
{ id: "ap4", title: "Europe trip goal is running behind", detail: "At the current ₹8,000 a month the 2028 target lands about 14% short.", tone: "destructive" },
{ id: "ap5", title: "Demat nomination still missing", detail: "Two minutes to fix, and it lifts your continuity score.", tone: "destructive" },
{ id: "ap6", title: "Half-yearly portfolio review due", detail: "Last reviewed in March. Book 30 minutes with your RM.", tone: "primary" }];










export const wealthCalendar = [
{ id: "c1", date: "18", month: "Nov", title: "HDFC FD ₹2.4 L matures", kind: "Maturity" },
{ id: "c2", date: "02", month: "Dec", title: "Family floater renewal — ₹26,800", kind: "Renewal" },
{ id: "c3", date: "31", month: "Dec", title: "Half-yearly SIP and allocation review", kind: "Review" },
{ id: "c4", date: "15", month: "Feb", title: "Submit tax proofs — 80C headroom closes", kind: "Tax" },
{ id: "c5", date: "05", month: "Mar", title: "Car loan crosses 50% repaid", kind: "EMI" },
{ id: "c6", date: "01", month: "Apr", title: "Emergency fund milestone — 5 months held", kind: "Goal" }];









export function financialDNA(input)






{
  const dims = [
  { key: "growth", label: "Growth", value: Math.round(clamp(input.savingsRate * 2.2)), note: "How much of your income compounds every month" },
  { key: "protection", label: "Protection", value: Math.round(clamp(input.protection)), note: "Life, health and critical illness cover against need" },
  { key: "liquidity", label: "Liquidity", value: Math.round(clamp(input.emergencyMonths / 6 * 100)), note: "Cash you can reach within 24 hours" },
  { key: "discipline", label: "Discipline", value: Math.round(clamp(100 - Math.max(0, input.emiRatio - 20) * 2.5)), note: "Fixed commitments against free cashflow" },
  { key: "risk", label: "Risk appetite", value: Math.round(clamp(input.riskAppetite * 10)), note: "Stated comfort with market swings" },
  { key: "planning", label: "Planning", value: Math.round(clamp(input.goalsOnTrackPct)), note: "Goals with a funded, on-track path" }];

  const growth = dims[0].value;
  const protection = dims[1].value;
  const archetype =
  growth >= 70 && protection >= 65 ?
  "Balanced Wealth Builder" :
  growth >= 70 ?
  "Ambitious Accumulator" :
  protection >= 70 ?
  "Guarded Provider" :
  "Steady Starter";
  const blurb = {
    "Balanced Wealth Builder": "You invest consistently and your family is largely covered. The upside now comes from tightening allocation and closing the last protection gaps.",
    "Ambitious Accumulator": "You put a lot of money to work, but the safety net has not kept pace with the portfolio. Protection first, returns second.",
    "Guarded Provider": "Your family is well protected. The next step is making idle and low-yield money work harder against your goals.",
    "Steady Starter": "The foundations are being laid. Small, automated increases will move every one of these dials over the next year."
  };
  return { archetype, blurb: blurb[archetype], dims };
}

/* ------------------------------------------------------------------ */
/* PLAN — life impact simulator                                        */
/* ------------------------------------------------------------------ */










export const emptySim = {
  sipDelta: 0,
  prepay: 0,
  careerBreakMonths: 0,
  inflationDelta: 0,
  newChild: false,
  homePurchase: false
};












export function simulate(sim, base) {
  const baseNetWorth2035 = 21400000;
  const notes = [];

  let surplus = base.surplus - sim.sipDelta - sim.prepay / 12;
  let netWorth = baseNetWorth2035 + sim.sipDelta * 12 * 10 * 1.55 + sim.prepay * 1.9;
  let debtFreeYear = 2039 - Math.min(6, Math.round(sim.prepay / 250000));
  let goalsOnTrack = base.goalsOnTrack + (sim.sipDelta >= 15000 ? 1 : 0);
  let health = sim.sipDelta / 4000 + sim.prepay / 400000;

  if (sim.sipDelta > 0) notes.push(`An extra ${inr(sim.sipDelta)} a month compounds to roughly ${inr(sim.sipDelta * 12 * 10 * 1.55)} more by 2035 at an assumed 11% return.`);
  if (sim.prepay > 0) notes.push(`A ${inr(sim.prepay)} prepayment pulls your debt-free date forward and saves interest at 8.6%.`);

  if (sim.careerBreakMonths > 0) {
    const lost = base.surplus * sim.careerBreakMonths;
    netWorth -= lost * 2.1;
    health -= sim.careerBreakMonths * 0.9;
    goalsOnTrack = Math.max(0, goalsOnTrack - (sim.careerBreakMonths >= 6 ? 1 : 0));
    notes.push(`${sim.careerBreakMonths} months without salary pauses roughly ${inr(lost)} of saving. Your emergency fund carries the household through ${Math.min(6, sim.careerBreakMonths)} of those months.`);
  }
  if (sim.newChild) {
    surplus -= 22000;
    health -= 4;
    netWorth -= 2600000;
    notes.push("A second child adds about ₹22,000 a month of costs and a new education goal from 2045. Life cover need rises by roughly ₹75 L.");
  }
  if (sim.homePurchase) {
    surplus -= 38000;
    debtFreeYear += 8;
    health -= 6;
    netWorth += 1800000;
    notes.push("A ₹1.2 Cr home adds an EMI of about ₹38,000 and a fresh 20-year loan, though the asset itself joins your net worth.");
  }
  if (sim.inflationDelta > 0) {
    netWorth -= sim.inflationDelta * 900000;
    health -= sim.inflationDelta * 1.8;
    goalsOnTrack = Math.max(0, goalsOnTrack - (sim.inflationDelta >= 2 ? 1 : 0));
    notes.push(`Inflation ${sim.inflationDelta}pts higher raises every future goal cost. Retirement is the most sensitive because it is 24 years away.`);
  }

  if (!notes.length) notes.push("Move any control to see how that decision reshapes your net worth, goals, cashflow, debt and Wealth Health.");

  return {
    netWorth2035: Math.round(netWorth),
    netWorthDelta: Math.round(netWorth - baseNetWorth2035),
    surplus: Math.round(surplus),
    surplusDelta: Math.round(surplus - base.surplus),
    debtFreeYear,
    goalsOnTrack: Math.min(base.goalsTotal, goalsOnTrack),
    healthDelta: Math.round(health),
    notes
  };
}

/* ------------------------------------------------------------------ */
/* Family Wealth Vault + trust                                         */
/* ------------------------------------------------------------------ */



export const emergencyContacts = [
{ id: "e1", label: "Relationship Manager", value: "Priya Menon · +91 22 6136 2200" },
{ id: "e2", label: "Life insurer helpline", value: "Sample Life Insurer A · 1800 000 000" },
{ id: "e3", label: "Health insurer helpline", value: "Sample Health Insurer C · 1800 111 000" },
{ id: "e4", label: "Home loan servicing", value: "HDFC Ltd · loan a/c ****4471" }];


export const privacyPoints = [
{ id: "p1", title: "What we collect", detail: "Only what you type in: household details, income, assets, loans, cover and goals. Nothing is pulled from your bank in this prototype." },
{ id: "p2", title: "Why we use it", detail: "To compute your scores, spot gaps and rank recommendations. It is never used to place a trade." },
{ id: "p3", title: "Your consent", detail: "You can view, edit or remove any section from Profile at any time, and see when each consent was given." },
{ id: "p4", title: "No action without you", detail: "Wealth360 never buys, sells, switches or renews anything on your behalf. Every action needs your explicit confirmation." },
{ id: "p5", title: "Coming later: Account Aggregator", detail: "In future you will be able to link accounts through a regulated Account Aggregator instead of typing figures. Not enabled in this prototype." }];


export const MARKET_DISCLAIMER =
"Returns are market-linked and subject to market risk. Past performance does not guarantee future results.";

export const EDUCATION_DISCLAIMER = "Educational insight only — not financial advice.";

/* ------------------------------------------------------------------ */
/* Priority engine metadata (confidence / why)                         */
/* ------------------------------------------------------------------ */

export const actionMeta = {
  "life-cover": { why: "You have 3 dependents and ₹46.5 L of outstanding loans, and your cover is 4.4x annual income.", assumptions: ["Income replacement of 10x annual income", "Loans repaid in full", "Existing cover stays in force"], confidence: "High", risk: "Low", marketLinked: false, horizon: "Today" },
  nominations: { why: "Nomination is missing on accounts holding a meaningful share of your wealth.", assumptions: ["Nominee details as recorded with each institution"], confidence: "High", risk: "Low", marketLinked: false, horizon: "Today" },
  emergency: { why: "Your liquid savings cover fewer than 6 months of household expenses.", assumptions: ["Monthly expenses of ₹1.68 L", "Only savings and liquid funds counted"], confidence: "High", risk: "Low", marketLinked: false, horizon: "This year" },
  "health-cover": { why: "A family floater of ₹7 L is below the ₹15 L benchmark for a metro family of four.", assumptions: ["Metro hospitalisation costs", "3 members covered"], confidence: "Medium", risk: "Low", marketLinked: false, horizon: "This year" },
  concentration: { why: "One asset class is above 35% of your portfolio.", assumptions: ["Current market values", "Moderate risk profile bands"], confidence: "Medium", risk: "Market-linked", marketLinked: true, horizon: "This year" },
  tax: { why: "You still have unused deduction headroom for this financial year.", assumptions: ["31.2% marginal tax slab", "Old tax regime"], confidence: "Medium", risk: "Market-linked", marketLinked: true, horizon: "This year" },
  "idle-cash": { why: "Your savings balance is well above the buffer you actually use each month.", assumptions: ["Liquid fund yield of 6.9% vs 3% savings", "Same-day redemption up to limits"], confidence: "High", risk: "Low", marketLinked: true, horizon: "Today" },
  goals: { why: "One or more goals are projected to fall short at the current contribution.", assumptions: ["Assumed returns per goal", "Contributions continue unchanged"], confidence: "Medium", risk: "Market-linked", marketLinked: true, horizon: "This year" },
  emi: { why: "EMIs take up a high share of your monthly income.", assumptions: ["Current interest rates", "No change in income"], confidence: "High", risk: "Low", marketLinked: false, horizon: "Later" },
  sip: { why: "Your surplus can absorb a higher monthly investment without straining cashflow.", assumptions: ["Surplus stays stable", "Assumed 11% long-run equity return"], confidence: "Medium", risk: "Market-linked", marketLinked: true, horizon: "This year" },
  will: { why: "No will is on record, so your estate would be distributed by default succession rules.", assumptions: ["Nomination is not the same as inheritance"], confidence: "High", risk: "Low", marketLinked: false, horizon: "Later" }
};

export const defaultActionMeta = actionMeta["goals"];