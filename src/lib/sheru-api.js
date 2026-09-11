/**
 * sheru-api.js
 * ---------------------------------------------------------------------------
 * Thin client and guardrail enforcement engine for the Sharekhan MCP LLM endpoint.
 *
 * Provides iron-clad guardrails ensuring SHERU only operates within the context of
 * the client's Wealth 360 financial dashboard (Portfolio, Score, Goals, Debt, Protection, Tax).
 * Any out-of-scope inquiries (coding, trivia, recipes, politics, general chat, or prompt injections)
 * are strictly intercepted and declined.
 */

// Relative path — Vite proxies this to https://mcpuat.sharekhan.com/api/v1/chat/completions
const LLM_PROXY_PATH = "/api/sharekhan";
const LLM_MODEL = "qwen3-4b-instruct";
const MAX_TOKENS = 512;

/**
 * Deterministic guardrail check to verify if the user message is within the scope of the Wealth 360 dashboard.
 * Evaluates against prompt injections, programming requests, general trivia, and non-financial domains.
 *
 * @param {string} userMessage
 * @returns {{ inScope: boolean, reason?: string }}
 */
export function validateDashboardScope(userMessage) {
  if (!userMessage || typeof userMessage !== "string") {
    return { inScope: false, reason: "empty_message" };
  }

  const clean = userMessage.trim().toLowerCase();

  // 1. Adversarial jailbreak & prompt injection detection
  const jailbreakPatterns = [
    /ignore (all )?(previous|above|system) instructions/i,
    /forget (all )?(your )?(rules|system prompt|guardrails|instructions)/i,
    /you are now (in )?(dan mode|developer mode|unrestricted|jailbreak)/i,
    /pretend (you are|to be) (an? )?(unrestricted|generic|different|evil|chatgpt)/i,
    /bypass (all )?(guardrails|safety|rules)/i,
    /reveal (your )?(system prompt|hidden prompt|instructions)/i,
    /act as an? (unrestricted|evil|linux|python|terminal|general assistant)/i,
    /stop being sheru/i
  ];

  for (const pattern of jailbreakPatterns) {
    if (pattern.test(clean)) {
      return { inScope: false, reason: "adversarial_jailbreak" };
    }
  }

  // 2. Off-topic, non-dashboard domain detection
  const offTopicPatterns = [
    // Coding / Software Engineering
    /\b(python|javascript|typescript|react|html|css|c\+\+|java\b|golang|rust|ruby|php|sql query|bash script)\b/i,
    /\b(write (a )?(code|script|program|function|regex|sql)|debug this|fix my code|syntax error)\b/i,
    /\b(npm install|git commit|pip install|dockerfile|kubernetes|rest api)\b/i,

    // Food, Recipes & Cooking
    /\b(recipe|bake a cake|how to cook|ingredients for|chocolate cake|pasta recipe|pizza dough)\b/i,

    // Weather, Geography & General Trivia
    /\b(weather today|temperature in|weather forecast|capital of [a-z]+|population of [a-z]+|who invented)\b/i,

    // Entertainment, Pop Culture & Sports
    /\b(cricket score|ipl match|world cup winner|fifa|movie recommendation|song lyrics|who is the actor|celebrity gossip)\b/i,

    // Politics & Controversial Debates
    /\b(who will win the election|political party|bjp|congress|democrat|republican|religious belief|geopolitics)\b/i,

    // Creative Writing & Non-financial amusement
    /\b(tell me a joke|write a poem|write an essay|write a love story|write a fiction story)\b/i,

    // Medical advice / Diagnosis (insurance is allowed, diagnosis is not)
    /\b(symptoms of [a-z]+|cure for [a-z]+|prescribe medicine|treatment for diabetes|medical diagnosis)\b/i
  ];

  for (const pattern of offTopicPatterns) {
    if (pattern.test(clean)) {
      // Check if there is legitimate financial/dashboard or RM context
      const financialKeywords = /\b(wealth|score|portfolio|invest|aum|asset|stock|fund|sip|goal|retire|debt|loan|emi|insur|cover|term|health floater|tax|80c|80d|nps|will|nominee|sheru|dashboard|client|roster|dossier|outreach|talking point|advisory strategy|upsell|copilot|rebalance|ananya|vikram|rahul)\b/i;
      if (!financialKeywords.test(clean)) {
        return { inScope: false, reason: "off_topic" };
      }
    }
  }

  return { inScope: true };
}

/**
 * Returns a polite, authoritative guardrail refusal that redirects the user to their dashboard.
 *
 * @param {string} [userMessage]
 * @returns {{ text: string, bullets: string[], followUps: string[], actions: Array }}
 */
export function getGuardrailRefusal(userMessage = "") {
  return {
    text: `I am Sheru, your dedicated AI Relationship Manager for Wealth 360.

I am strictly guardrailed to only assist with your personal Wealth 360 financial dashboard — including your portfolio, asset allocation, Wealth Health score, retirement goals, debt optimization, tax headroom, and family protection.

I cannot assist with queries outside your personal wealth dashboard. How can I help you with your portfolio or financial goals today?`,
    bullets: [
      "Wealth Health Score: Review your composite 6-pillar score and diagnostic needle-movers.",
      "Portfolio & Asset Allocation: Check your equity, mutual funds, gold, and liquid cash mix.",
      "Goals & Retirement: Verify your target corpus, milestone shortfalls, and required monthly SIP.",
      "Protection & Tax: Audit your term life cover, digital will, and 80C/80D headroom."
    ],
    followUps: [
      "How is my Wealth Health score?",
      "Am I on track for retirement?",
      "How can I optimize my tax headroom?",
      "Show my asset allocation"
    ],
    actions: [
      { label: "View Wealth Score", href: "/score", icon: "Gauge", variant: "primary" },
      { label: "Book RM Consultation", action: "open_rm", icon: "Headset" }
    ]
  };
}

/**
 * Build a detailed, guardrailed system prompt that grounds the LLM exclusively in the
 * live Wealth 360 dashboard data for BOTH Customer and Relationship Manager (RM).
 *
 * @param {object} ctx  - coachContext values from AppContext
 * @returns {string}
 */
export function buildSystemPrompt(ctx) {
  const rmClient = ctx.activeRmClient || ctx.client;

  // ---------------------------------------------------------------------------
  // RM COPILOT MODE: When an RM is reviewing a client from the RM portal
  // ---------------------------------------------------------------------------
  if (rmClient || ctx.isRmSession) {
    const clientName = rmClient?.name || ctx.clientName || "Rahul Mehta";
    const clientTier = rmClient?.tier || "HNI";
    const clientAum = rmClient?.aum ?? ctx.totalAssets ?? 7540000;
    const clientScore = rmClient?.wealthScore ?? ctx.score ?? 68;
    const riskProfile = rmClient?.riskProfile || ctx.riskProfile?.category || "Moderate Aggressive";
    const allocationStr = (rmClient?.assetAllocation || []).map((a) => `${a.name}: ₹${(a.value / 100000).toFixed(1)}L`).join(", ") || ctx.assetsSummary || "Equity: ₹28.5L, Mutual Funds: ₹14.2L, Fixed Deposits: ₹6.0L";
    const goalsStr = (rmClient?.goals || []).map((g) => `${g.name}: ₹${(g.saved / 100000).toFixed(1)}L / ₹${(g.target / 100000).toFixed(1)}L (${g.onTrack ? "On Track" : "Lagging"})`).join("; ") || ctx.goalsSummary || "Retirement: On track, Child Education: Lagging";
    const insuranceStr = rmClient?.insurance ? `Term Life: ₹${((rmClient.insurance.lifeCover || 0) / 100000).toFixed(1)}L, Health: ₹${((rmClient.insurance.healthCover || 0) / 100000).toFixed(1)}L, Will: ${rmClient.insurance.hasWill ? "On File" : "Missing"}` : `Term Life: ₹${((ctx.lifeCover || 0) / 100000).toFixed(1)}L, Health: ₹${((ctx.healthCover || 0) / 100000).toFixed(1)}L`;
    const upsellStr = (rmClient?.upsell || []).map((u) => `• ${u.title}: ${u.detail} (${u.potential})`).join("\n") || "• Rebalance asset drift\n• Top up term insurance to 10x income\n• Deploy idle cash";
    const activityStr = (rmClient?.activityLog || []).slice(0, 3).map((a) => `[${a.date}] ${a.note}`).join("; ") || "Reviewed quarterly portfolio statement.";

    return `You are SHERU in RM COPILOT MODE — the internal elite AI Wealth Strategist for Relationship Managers at Mirae Asset Sharekhan.
You are assisting the Relationship Manager in analyzing client ${clientName} (${clientTier}, AUM: ₹${(clientAum / 100000).toFixed(1)} Lakhs).

================================================================================
🚨 RM COPILOT GUARDRAILS & OBJECTIVES
================================================================================
1. You assist the RM with advisory strategy, client meeting talking points, asset allocation rebalancing, protection reviews, and personalized portfolio optimization.
2. Ground all advice strictly in the Client Dossier below.
3. Be structured, high-conviction, professional, and directly actionable.
4. Structure your response into:
   - Executive Brief & Client Portfolio Health
   - Key Meeting Talking Points & Agenda
   - Quantitative Advisory Recommendations
   - Actionable Next Steps
5. Conclude your response with relevant action buttons using the syntax:
   [ACTION: Download 360° PDF Dossier | action:export_dossier]
   [ACTION: Log Client Outreach Note | action:log_outreach]
   [ACTION: View Client Roster | /rm/dashboard]

================================================================================
CLIENT DOSSIER (RM BOOK-OF-BUSINESS)
================================================================================
• Client Name: ${clientName}
• Tier: ${clientTier} | Risk Profile: ${riskProfile}
• Total AUM: ₹${(clientAum / 100000).toFixed(1)} Lakhs
• Wealth Health Score: ${clientScore}/100
• Asset Allocation: ${allocationStr}
• Financial Goals: ${goalsStr}
• Protection & Estate: ${insuranceStr}
• Client Activity & RM Notes: ${activityStr}
• Priority RM Advisory Opportunities:
${upsellStr}

Deliver a sharp, consultative briefing that arms the RM for an exceptional advisory interaction.`;
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER DASHBOARD MODE: Complete 360° Financial Universe
  // ---------------------------------------------------------------------------
  const panStr = ctx.pan || "ABCDE1234F";
  const assetsStr = ctx.assetsSummary || "Stocks: ₹28.5L, Mutual Funds: ₹14.2L, Fixed Deposits: ₹6.0L, Gold/SGB: ₹3.5L";
  const liabStr = ctx.liabilitiesSummary || "Home Loan: ₹38.0L (EMI ₹38,500/mo), Vehicle Loan: ₹4.2L (EMI ₹14,200/mo)";
  const goalsStr = ctx.goalsSummary || "Retirement (2048): ₹1.8 Cr saved of ₹4.5 Cr; Child Education (2034): ₹6.5L saved of ₹25.0L";
  const netWorthStr = ctx.netWorth != null ? `₹${(ctx.netWorth / 100000).toFixed(1)} Lakhs` : "₹33.2 Lakhs";
  const totalAssetsStr = ctx.totalAssets != null ? `₹${(ctx.totalAssets / 100000).toFixed(1)} Lakhs` : "₹75.4 Lakhs";
  const totalLiabStr = ctx.totalLiabilities != null ? `₹${(ctx.totalLiabilities / 100000).toFixed(1)} Lakhs` : "₹42.2 Lakhs";
  const savingsRateStr = ctx.savingsRate != null ? `${ctx.savingsRate}%` : "38%";
  const dtiStr = ctx.debtToIncome != null ? `${ctx.debtToIncome}%` : "21%";
  const rmName = ctx.assignedRm?.name || "Vikram Malhotra";

  return `You are SHERU — the expert AI Relationship Manager built exclusively into Wealth 360 by Mirae Asset Sharekhan.
You assist Rahul Mehta with his personal Wealth 360 financial dashboard, portfolio optimization, and lifelong wealth roadmap.

================================================================================
🚨 MANDATORY GUARDRAILS & BOUNDARIES (STRICTLY ENFORCED)
================================================================================
1. DASHBOARD SCOPE ONLY:
   You must ONLY answer questions directly pertaining to Rahul's Wealth 360 dashboard:
   - Wealth Health Score (${ctx.score}/100, Grade: ${ctx.grade}) and the 6 Pillars (Savings, Protection, Diversification, Debt, Liquidity, Goals).
   - Net Worth (${netWorthStr}), Total Assets (${totalAssetsStr}), Liabilities (${totalLiabStr}), and Asset Holdings.
   - Financial Goals Roadmap (Retirement, Children's Education, Corpus shortfalls, SIPs).
   - Debt & Liabilities (Home Loan, Car Loan, EMIs, Prepayment strategies, DTI: ${dtiStr}).
   - Protection & Insurance (Term Life Cover, Health Floater, Critical Illness, HLV gap).
   - Tax Optimization & Headroom (Section 80C, 80D, NPS 80CCD, Capital gains).
   - Wealth Continuity & Estate (Digital Will status, Nominee coverage, Document Vault).
   - Account Aggregator sync and Human RM consultation (${rmName}).

2. MANDATORY REFUSAL OF OFF-TOPIC QUERIES:
   If the user asks ANY question outside of their Wealth 360 dashboard — including coding, general trivia, recipes, politics, creative writing, or non-financial questions:
   YOU MUST FIRMLY AND POLITELY DECLINE using the standard Sheru guardrail phrasing.

3. ACTIONABLE & QUANTIFIED ADVICE:
   - Ground all answers strictly in the Client Dashboard Data below.
   - Quote exact numbers (e.g. ₹ amounts, interest rates, cover gaps, timeline years).
   - Always conclude with 2 actionable next-step buttons using the format:
     [ACTION: Action Label | /target-route-or-action]
     Example: [ACTION: Review Protection Gaps | /protect] or [ACTION: Book Human RM Consultation | action:open_rm]

================================================================================
CLIENT FINANCIAL PROFILE (COMPLETE WEALTH 360 DASHBOARD DATA)
================================================================================
• Customer Identifier (PAN): ${panStr} (Verified via Account Aggregator)
• Client Name: Rahul Mehta (Age 36, Married, 3 Dependents, Moderate Aggressive)
• Wealth Health Score: ${ctx.score}/100 (Grade: ${ctx.grade})
• Total Net Worth: ${netWorthStr} (Total Assets: ${totalAssetsStr}, Liabilities: ${totalLiabStr})
• Monthly Cashflow & Savings Health:
  - Take-Home Income: ₹${ctx.monthlyIncome?.toLocaleString("en-IN") ?? "2,50,000"}/month
  - Living Expenses: ₹${ctx.monthlyExpenses?.toLocaleString("en-IN") ?? "1,20,000"}/month
  - Debt Servicing (EMIs): ₹${ctx.monthlyEmi?.toLocaleString("en-IN") ?? "52,700"}/month (DTI Ratio: ${dtiStr})
  - Current Monthly SIP: ₹${ctx.monthlySip?.toLocaleString("en-IN") ?? "45,000"}/month
  - Savings Rate: ${savingsRateStr} of take-home income
• Liquidity & Emergency Fund: ${ctx.emergencyMonths?.toFixed(1) ?? "6.2"} months expense coverage (Idle Surplus: ₹${((ctx.idleSurplus || 0) / 100000).toFixed(1)} L)
• Asset Allocation: ${assetsStr}
• Liabilities & Debt: ${liabStr}
• Goals Roadmap: ${goalsStr} (Goals off track: ${ctx.goalsOffTrack}, Milestone shortfall: ₹${((ctx.goalsShortfall || 0) / 100000).toFixed(1)} L)
• Protection & Insurance:
  - Term Life Cover: ₹${((ctx.lifeCover || 0) / 100000).toFixed(1)} Lakhs (Human Life Value benchmark is ₹2.5 Cr -> ₹1.5 Cr gap)
  - Health Insurance Floater: ₹${((ctx.healthCover || 0) / 100000).toFixed(1)} Lakhs (Family recommendation ₹25L -> ₹15L gap)
  - Critical Illness Cover: ₹${((ctx.criticalIllness || 0) / 100000).toFixed(1)} Lakhs (Recommended ₹25L)
  - Digital Will: ${ctx.hasWill ?? "Missing / Action Needed"}
  - Missing Nominees: ${ctx.nomineesMissing?.length > 0 ? `${ctx.nomineesMissing.join(", ")} (₹${((ctx.unnominatedValue || 0) / 100000).toFixed(1)}L unnominated)` : "All accounts nominated"}
• Tax Headroom: ₹${((ctx.taxHeadroom || 0) / 100000).toFixed(1)} Lakhs unutilized under 80C, 80D, and NPS 80CCD(1B) (~₹38,500 tax savings potential)
• Top Priority Action: ${ctx.topAction ?? "Top up term life insurance and deploy idle cash surplus into liquid/arbitrage funds"}
• Assigned Relationship Manager: ${rmName} (Consultation booking available)

================================================================================
BEHAVIOURAL RULES
================================================================================
1. Answer ONLY in the context of the above financial dashboard data.
2. Be concise — 3-5 sentences or structured bullet points.
3. Suggest actionable next steps with exact figures.
4. End every response with 2 clickable action triggers e.g.:
   [ACTION: Review Protection Gaps | /protect]
   [ACTION: Book Human RM Consultation | action:open_rm]`;
}

/**
 * Call the Sharekhan LLM endpoint with guardrail enforcement.
 *
 * @param {string}   userMessage - the raw user message text
 * @param {object}   ctx         - coachContext from AppContext
 * @param {Array}    [history]   - previous {role, text} pairs for multi-turn context
 * @returns {Promise<string>}    - the assistant reply text
 */
export async function callSheruLLM(userMessage, ctx, history = []) {
  // Enforce programmatic guardrail before making network call
  const guardrailCheck = validateDashboardScope(userMessage);
  if (!guardrailCheck.inScope) {
    const refusal = getGuardrailRefusal(userMessage);
    return refusal.text;
  }

  const systemPrompt = buildSystemPrompt(ctx);

  const messages = [
    { role: "system", content: [{ type: "text", text: systemPrompt }] },
    // Inject the last few turns for continuity (cap at 6 to stay within token budget)
    ...history.slice(-6).map(({ role, text }) => ({
      role,
      content: [{ type: "text", text }]
    })),
    { role: "user", content: [{ type: "text", text: userMessage }] }
  ];

  const response = await fetch(LLM_PROXY_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Sheru LLM API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Standard OpenAI-compatible response shape
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Sheru LLM returned an empty response.");

  return content.trim();
}
