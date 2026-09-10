import { formatINR, formatINRShort } from "./format";






































const rules = [
{
  match: /score|improve|wealthverse|wealth360|rating|grade/i,
  reply: (ctx) => ({
    text: `Sheru Advisory: Your Wealth Health score stands at ${ctx.score} (${ctx.grade}). Here is what will move your needle fastest:`,
    bullets: [
    "What changed: Term life cover remains below the 10x income + liabilities safety benchmark.",
    "Why it matters: Protection is your highest-weighted vulnerability pillar (+9 pts potential).",
    `What should happen next: Top up pure term cover by ${formatINRShort(Math.max(0, ctx.monthlyIncome * 120 - ctx.lifeCover))} and move ₹${(ctx.idleSurplus / 100000).toFixed(1)}L idle cash to a liquid fund.`,
    "Expected impact: Immediate +11 to +14 point uplift to your overall Wealth Health."],

    followUps: ["Am I on track for retirement?", "Should I repay my loan or invest?", "How much insurance do I need?"]
  })
},
{
  match: /retire|retirement|58|corpus|pension/i,
  reply: (ctx) => {
    const g = goals.find((x) => x.id === "retirement");
    const gap = Math.max(0, g.target - g.saved);
    return {
      text: `Sheru Advisory on Retirement Readiness:`,
      bullets: [
      `What changed: Your projected retirement corpus has a ${formatINRShort(gap)} milestone shortfall against the ${formatINRShort(g.target)} target.`,
      "Why it matters: Post-retirement living expenses compound with medical inflation over a 25-30 year longevity horizon.",
      `What should happen next: Increase monthly retirement contribution from ${formatINR(g.monthlyContribution)} to ${formatINR(Math.round(g.monthlyContribution + 15000))} and max out NPS Tier-I.`,
      "Expected impact: Closes the corpus gap by 2050 and adds +12 points to Goal Readiness."],

      followUps: ["How can I save more tax?", "What does my FIRE timeline look like?"]
    };
  }
},
{
  match: /loan|debt|prepay|interest|emi|car loan|home loan/i,
  reply: (ctx) => ({
    text: `Sheru Advisory on Debt Optimization:`,
    bullets: [
    "What changed: Your personal/vehicle debt cost (9.2%–9.4%) exceeds conservative fixed-income hurdle rates.",
    "Why it matters: High-interest debt is a guaranteed negative return against your monthly surplus.",
    "What should happen next: Allocate an extra ₹15,000/month towards highest-interest debt first while keeping home loan on schedule.",
    "Expected impact: Saves an estimated ₹1.8L–₹3.2L in interest and pulls your debt-free milestone forward by 18 months."],

    followUps: ["Am I on track for retirement?", "How much emergency fund do I need?"]
  })
},
{
  match: /transfer|nominee|nomination|will|succession|estate|vault/i,
  reply: (ctx) => ({
    text: `Sheru Advisory on Wealth Continuity:`,
    bullets: [
    `What changed: ${ctx.nomineesMissing.length > 0 ? `${ctx.nomineesMissing.length} accounts worth ${formatINRShort(ctx.unnominatedValue)} lack registered nominees.` : "Continuity documentation needs annual review."}`,
    "Why it matters: In absence of registered nominees, institutional asset transmission can take months and legal friction for your family.",
    "What should happen next: Use the 3-step digital nomination flow in WealthVerse Transfer and record a draft Will inventory.",
    "Expected impact: Brings Wealth Continuity from " + ctx.transferReadiness + " to 90+."],

    followUps: ["Connect with RM for Estate Review", "How do I create a Will?"]
  })
},
{
  match: /tax|80c|80d|nps|deduction|save tax|headroom/i,
  reply: (ctx) => ({
    text: `Sheru Advisory on Tax Optimization:`,
    bullets: [
    `What changed: You have ${formatINRShort(ctx.taxHeadroom)} of unutilized deduction headroom across 80C, 80CCD(1B) and 80D before March 31.`,
    "Why it matters: Direct cash leakage at your 31.2% marginal income tax slab.",
    `What should happen next: Allocate ₹50,000 into NPS Tier-I and remainder into 3-year ELSS equity funds.`,
    `Expected impact: Retains ~${formatINR(Math.round(ctx.taxHeadroom * 0.312))} in cashflow that compounds into your net worth.`],

    followUps: ["Am I on track for retirement?", "Where should I invest my idle cash?"]
  })
},
{
  match: /insur|cover|term|health|floater|protect/i,
  reply: (ctx) => ({
    text: `Sheru Advisory on Family Protection:`,
    bullets: [
    `What changed: Current term cover of ${formatINRShort(ctx.lifeCover)} is below your benchmark need of ${formatINRShort(ctx.monthlyIncome * 120 + 4650000)}.`,
    "Why it matters: Your 3 dependents and active home loan require full income-replacement insulation.",
    `What should happen next: Purchase a ₹1.5 Cr pure term plan (~₹21,000/yr) and add a ₹25L super top-up to your health floater.`,
    "Expected impact: Boosts Protection pillar from " + ctx.protection + " to 88+ and insulates all future family goals."],

    followUps: ["Ask RM To Review", "Should I repay my loan or invest?"]
  })
},
{
  match: /idle|cash|savings|emergency|buffer/i,
  reply: (ctx) => ({
    text: `Sheru Advisory on Cash & Liquidity:`,
    bullets: [
    `What changed: You hold ${formatINR(idleCash.savingsBalance)} in 3% savings, while your monthly operational need is ${formatINR(idleCash.idealBalance)}.`,
    "Why it matters: Cash drag loses real purchasing power to inflation every month.",
    `What should happen next: Transfer the ${formatINRShort(idleCash.savingsBalance - idleCash.idealBalance)} surplus into an instant-redemption liquid fund (yield ~${idleCash.liquidFundRate}%).`,
    `Expected impact: Generates ~${formatINR(Math.round((idleCash.savingsBalance - idleCash.idealBalance) * (idleCash.liquidFundRate - idleCash.savingsRate) / 100))}/yr in risk-free extra earnings.`],

    followUps: ["How can I improve my score?", "Am I on track for retirement?"]
  })
},
{
  match: /fire|retire early|independence|corpus needed/i,
  reply: (ctx) => ({
    text: `Sheru Advisory on Financial Independence (FIRE):`,
    bullets: [
    "What changed: At your current annual expense rate of ~₹18L/yr, your required 3.5% SWR FIRE corpus is ~₹5.1 Cr.",
    "Why it matters: Achieving true financial independence allows you to transition to passion projects or early retirement.",
    "What should happen next: Use the WealthVerse FIRE Calculator on the Goals page to model your exact crossover year.",
    "Expected impact: Current net worth puts you ~38% along the path, with projected FI crossover in 11.5 years."],

    followUps: ["Open Goals & FIRE Calculator", "How to accelerate my savings?"]
  })
},
{
  match: /aggregator|aa|account aggregator|sync|pan/i,
  reply: (ctx) => ({
    text: `Sheru Advisory on Account Aggregation:`,
    bullets: [
    "What changed: WealthVerse supports fast-track Account Aggregator simulation.",
    "Why it matters: Instead of manual data entry, AA aggregates your Demat, Mutual Funds, Bank Accounts, EPF, and Loans into one verified universe.",
    "What should happen next: Visit /account-aggregator to run a simulated fetch with your PAN.",
    "Expected impact: Generates instant 360° net worth tracking and auto-updates all 5 pillars in seconds."],

    followUps: ["Start Account Aggregator", "Ask RM To Review"]
  })
},
{
  match: /rm|manager|human|advisor|priya|talk|meeting/i,
  reply: () => ({
    text: `Sheru Collaboration with Human RM:`,
    bullets: [
    "What changed: Sheru has summarized your active gaps (Protection, Debt, Retirement) for your Relationship Manager.",
    "Why it matters: AI identifies numbers and algorithmic patterns; your RM handles complex execution and tailored strategies.",
    "What should happen next: Click 'Talk to RM' in the header to schedule a 15-minute phone, video, or branch consultation.",
    "Expected impact: Priya Menon will receive your WealthVerse briefing notes ahead of the meeting."],

    followUps: ["Schedule RM Meeting", "How can I improve my score?"]
  })
}];


export function coachReply(question, context) {
  for (const rule of rules) {
    if (rule.match.test(question)) return rule.reply(context);
  }

  return {
    text: `Hi Rahul — I'm Sheru, your AI Relationship Manager. I continuously monitor your WealthVerse across Income, Investments, Debt, Protection, and Succession:`,
    bullets: [
    `What changed: Wealth Health score is ${context.score} (${context.grade}) with net worth at ${formatINRShort(context.netWorth)}.`,
    "Why it matters: We found 3 priority areas (term protection, debt optimization, tax headroom) that can compound your financial life.",
    "What should happen next: Ask me about any specific pillar, or click 'Ask RM To Review' to connect with Priya Menon.",
    "Expected impact: Addressing your top 2 recommendations can raise your score by up to 14 points."],

    followUps: [
    "Am I on track for retirement?",
    "Should I repay my loan or invest?",
    "How much insurance do I need?",
    "What is my FIRE timeline?"]

  };
}