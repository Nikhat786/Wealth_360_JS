import { formatINR, formatINRShort } from "./format";
import { getGuardrailRefusal, validateDashboardScope } from "./sheru-api";






































const rules = [
  {
    match: /client|roster|dossier|outreach|talking point|advisory strategy|upsell|copilot|ananya|oberoi|kapoor/i,
    reply: (ctx) => {
      const client = ctx.activeRmClient || ctx.client;
      const name = client?.name || "Rahul Mehta";
      const aumStr = formatINRShort(client?.aum ?? ctx.totalAssets ?? 7540000);
      const score = client?.wealthScore ?? ctx.score ?? 68;
      const topUpsell = client?.upsell?.[0];
      return {
        text: `SHERU RM Copilot Briefing for ${name} (${client?.tier || "HNI"} · AUM ${aumStr} · Score ${score}/100):`,
        bullets: [
          `Portfolio Position: Total AUM stands at ${aumStr} under ${client?.riskProfile || "Moderate Aggressive"} mandate with 30-day performance of ${client?.performance30d != null ? `${client.performance30d > 0 ? "+" : ""}${client.performance30d}%` : "+3.2%"}.`,
          `High-Impact Advisory Opportunity: ${topUpsell ? `${topUpsell.title} — ${topUpsell.detail} (${topUpsell.potential})` : "Asset drift rebalance and HLV term life coverage gap closure."}`,
          `Strategic Meeting Agenda: 1. Address equity overweight drift. 2. Present tax harvesting opportunities. 3. Resolve missing nominee designations.`,
          `Outreach & Sentiment: ${client?.lastActivity || "Last active today"}. Pending client call request: ${client?.callRequested ? "YES (High Priority)" : "Scheduled quarterly review"}.`
        ],
        followUps: [
          `Draft client review email for ${name}`,
          `Generate asset rebalance proposal`,
          `Prepare term life & HLV protection summary`
        ],
        actions: [
          { label: "Download 360° PDF Dossier", action: "export_dossier", icon: "FileDown", variant: "primary" },
          { label: "Log Client Outreach Note", action: "log_outreach", icon: "MessageSquare" },
          { label: "View Client Profile", action: "view_client", icon: "UserCheck" }
        ]
      };
    }
  },
  {
    match: /score|improve|wealthverse|wealth360|rating|grade/i,
    reply: (ctx) => ({
      text: `Sheru Advisory: Your Wealth Health score stands at ${ctx.score} (${ctx.grade}) across 6 diagnostic pillars:`,
      bullets: [
        "What changed: Term life cover remains below the 10x income + liabilities safety benchmark.",
        "Why it matters: Protection is your highest-weighted vulnerability pillar (+9 pts potential).",
        `What should happen next: Top up pure term cover by ${formatINRShort(Math.max(0, (ctx.monthlyIncome || 250000) * 120 - (ctx.lifeCover || 10000000)))} and deploy ₹${((ctx.idleSurplus || 650000) / 100000).toFixed(1)}L idle cash to a liquid/arbitrage fund.`,
        "Expected impact: Immediate +11 to +14 point uplift to your overall Wealth Health."
      ],
      followUps: ["Am I on track for retirement?", "Should I repay my loan or invest?", "How much insurance do I need?"],
      actions: [
        { label: "Review 6-Pillar Score", href: "/score", icon: "Gauge", variant: "primary" },
        { label: "Review Protection Gaps", href: "/protect", icon: "ShieldCheck" },
        { label: "Book RM Consultation", action: "open_rm", icon: "Headset" }
      ]
    })
  },
  {
    match: /retire|retirement|58|corpus|pension/i,
    reply: (ctx) => {
      const gap = ctx.goalsShortfall || 27000000;
      return {
        text: `Sheru Advisory on Retirement Readiness:`,
        bullets: [
          `What changed: Your projected retirement corpus has an estimated milestone shortfall of ${formatINRShort(gap)}.`,
          "Why it matters: Post-retirement living expenses compound with healthcare inflation over a 25-30 year longevity horizon.",
          `What should happen next: Increase monthly SIP contribution by ₹12,000–₹15,000 and max out NPS Tier-I under 80CCD(1B).`,
          "Expected impact: Closes the corpus gap by 2048 and adds +12 points to Goal Readiness."
        ],
        followUps: ["How can I save more tax?", "What does my FIRE timeline look like?"],
        actions: [
          { label: "Explore Goals Roadmap", href: "/goals", icon: "Target", variant: "primary" },
          { label: "Boost Monthly SIP", href: "/portfolio", icon: "PlusCircle" },
          { label: "Book RM Advisory Call", action: "open_rm", icon: "Headset" }
        ]
      };
    }
  },
  {
    match: /loan|debt|prepay|interest|emi|car loan|home loan/i,
    reply: (ctx) => ({
      text: `Sheru Advisory on Debt Optimization:`,
      bullets: [
        `What changed: Total outstanding liabilities stand at ₹${((ctx.totalLiabilities || 4220000) / 100000).toFixed(1)} Lakhs with monthly EMIs of ₹${(ctx.monthlyEmi || 52700).toLocaleString("en-IN")}.`,
        "Why it matters: Vehicle and personal debt cost (9.2%–9.4%) exceeds conservative fixed-income hurdle rates.",
        "What should happen next: Allocate an extra ₹15,000/month or deploy idle cash towards highest-interest debt first while keeping home loan on schedule.",
        "Expected impact: Saves an estimated ₹1.8L–₹3.2L in compound interest and pulls your debt-free date forward by 18 months."
      ],
      followUps: ["Am I on track for retirement?", "How much emergency fund do I need?"],
      actions: [
        { label: "Review Loan Prepayment", href: "/debt", icon: "BadgeIndianRupee", variant: "primary" },
        { label: "Calculate Prepay Savings", href: "/debt", icon: "Calculator" }
      ]
    })
  },
  {
    match: /transfer|nominee|nomination|will|succession|estate|vault/i,
    reply: (ctx) => ({
      text: `Sheru Advisory on Wealth Continuity:`,
      bullets: [
        `What changed: ${ctx.nomineesMissing?.length > 0 ? `${ctx.nomineesMissing.length} accounts worth ${formatINRShort(ctx.unnominatedValue || 1850000)} lack registered nominees.` : "Continuity documentation needs annual review."}`,
        "Why it matters: Without registered nominees, institutional asset transmission across mutual funds, Demat, and bank accounts can cause months of legal friction.",
        "What should happen next: Use the 3-step digital nomination flow in WealthVerse Transfer and record a draft Digital Will inventory.",
        `Expected impact: Elevates Transfer & Estate pillar score from ${ctx.transferReadiness || 45} to 90+.`
      ],
      followUps: ["Connect with RM for Estate Review", "How do I create a Digital Will?"],
      actions: [
        { label: "Update Missing Nominees", href: "/transfer", icon: "FileCheck", variant: "primary" },
        { label: "Draft Digital Will", href: "/transfer", icon: "FileText" },
        { label: "Book Estate Specialist", action: "open_rm", icon: "Headset" }
      ]
    })
  },
  {
    match: /tax|80c|80d|nps|deduction|save tax|headroom/i,
    reply: (ctx) => ({
      text: `Sheru Advisory on Tax Optimization:`,
      bullets: [
        `What changed: You have ${formatINRShort(ctx.taxHeadroom || 120000)} of unutilized deduction headroom across 80C, 80CCD(1B), and 80D before March 31.`,
        "Why it matters: Direct cash leakage at your 31.2% marginal income tax slab.",
        "What should happen next: Allocate ₹50,000 into NPS Tier-I and remainder into 3-year ELSS equity funds.",
        `Expected impact: Retains ~${formatINR(Math.round((ctx.taxHeadroom || 120000) * 0.312))} in cashflow that compounds into your net worth.`
      ],
      followUps: ["Am I on track for retirement?", "Where should I invest my idle cash?"],
      actions: [
        { label: "Explore Tax Headroom", href: "/portfolio", icon: "Sparkles", variant: "primary" },
        { label: "Start Tax-Saver SIP", href: "/portfolio", icon: "TrendingUp" }
      ]
    })
  },
  {
    match: /insur|cover|term|health|floater|protect/i,
    reply: (ctx) => ({
      text: `Sheru Advisory on Family Protection:`,
      bullets: [
        `What changed: Current term cover of ${formatINRShort(ctx.lifeCover || 10000000)} is below your benchmark need of ₹2.5 Cr (Deficit: ₹1.5 Cr).`,
        "Why it matters: Your 3 dependents and active home loan require full income-replacement insulation.",
        "What should happen next: Purchase a ₹1.5 Cr pure term plan (~₹21,000/yr) and add a ₹25L super top-up to your health floater.",
        `Expected impact: Boosts Protection pillar from ${ctx.protection || 55} to 88+ and insulates all future family goals.`
      ],
      followUps: ["Ask RM To Review", "Should I repay my loan or invest?"],
      actions: [
        { label: "Review Protection Gaps", href: "/protect", icon: "ShieldCheck", variant: "primary" },
        { label: "Book Human RM Review", action: "open_rm", icon: "Headset" }
      ]
    })
  },
  {
    match: /idle|cash|savings|emergency|buffer/i,
    reply: (ctx) => ({
      text: `Sheru Advisory on Cash & Liquidity:`,
      bullets: [
        `What changed: You hold ~₹${((ctx.idleSurplus || 650000) / 100000).toFixed(1)}L in low-yield savings, while your emergency buffer requirement is 6 months of expenses.`,
        "Why it matters: Cash drag loses real purchasing power to inflation every month.",
        "What should happen next: Transfer the surplus into an instant-redemption liquid/arbitrage fund (yield ~7.2%).",
        "Expected impact: Generates ~₹28,500/yr in risk-free extra post-tax earnings without sacrificing liquidity."
      ],
      followUps: ["How can I improve my score?", "Am I on track for retirement?"],
      actions: [
        { label: "Rebalance Idle Cash", href: "/portfolio", icon: "TrendingUp", variant: "primary" },
        { label: "View Emergency Coverage", href: "/score", icon: "ShieldCheck" }
      ]
    })
  },
  {
    match: /fire|retire early|independence|corpus needed/i,
    reply: (ctx) => ({
      text: `Sheru Advisory on Financial Independence (FIRE):`,
      bullets: [
        "What changed: At your current annual expense rate of ~₹18L/yr, your required 3.5% SWR FIRE corpus is ~₹5.1 Cr.",
        "Why it matters: Achieving true financial independence allows you to transition to passion projects or early retirement.",
        "What should happen next: Use the Wealth 360 FIRE Roadmap on the Goals page to model your exact crossover year.",
        "Expected impact: Current net worth puts you ~42% along the path, with projected FI crossover in 10.5 years."
      ],
      followUps: ["Open Goals & FIRE Calculator", "How to accelerate my savings?"],
      actions: [
        { label: "Explore Goals Roadmap", href: "/goals", icon: "Target", variant: "primary" },
        { label: "Optimize Monthly SIP", href: "/portfolio", icon: "PlusCircle" }
      ]
    })
  },
  {
    match: /aggregator|aa|account aggregator|sync|pan/i,
    reply: (ctx) => ({
      text: `Sheru Advisory on Account Aggregation:`,
      bullets: [
        `What changed: Linked PAN ${ctx.pan || "ABCDE1234F"} via RBI-regulated Account Aggregator framework.`,
        "Why it matters: Instead of manual data entry, AA aggregates your Demat, Mutual Funds, Bank Accounts, EPF, and Loans into one verified universe.",
        "What should happen next: Review your 360° synced holdings across Banks, MFs, CDSL/NSDL, and CIBIL.",
        "Expected impact: Live net worth tracking and auto-updated scores with 256-bit bank-grade encryption."
      ],
      followUps: ["Start Account Aggregator", "Ask RM To Review"],
      actions: [
        { label: "Open Account Aggregator", href: "/account-aggregator", icon: "Layers", variant: "primary" },
        { label: "View Consolidate Portfolio", href: "/portfolio", icon: "TrendingUp" }
      ]
    })
  },
  {
    match: /rm|manager|human|advisor|priya|vikram|talk|meeting/i,
    reply: (ctx) => ({
      text: `Sheru Collaboration with Human Relationship Manager:`,
      bullets: [
        `What changed: Sheru has compiled your live Wealth 360 briefing notes for Senior Director ${ctx.assignedRm?.name || "Vikram Malhotra"}.`,
        "Why it matters: AI identifies mathematical gaps; your senior RM handles tailored tax structuring, discretionary execution, and PMS/AIF access.",
        "What should happen next: Click 'Book Human RM' to schedule an in-person, video, or phone consultation.",
        "Expected impact: Your RM receives your complete Wealth 360 portfolio dossier prior to the meeting."
      ],
      followUps: ["Schedule RM Meeting", "How can I improve my score?"],
      actions: [
        { label: "Schedule RM Consultation", action: "open_rm", icon: "Headset", variant: "primary" },
        { label: "View Wealth Health Score", href: "/score", icon: "Gauge" }
      ]
    })
  }
];

export function coachReply(question, context) {
  // Enforce strict Wealth 360 Dashboard guardrail
  const scopeCheck = validateDashboardScope(question);
  if (!scopeCheck.inScope) {
    return getGuardrailRefusal(question);
  }

  for (const rule of rules) {
    if (rule.match.test(question)) return rule.reply(context);
  }

  const isRm = Boolean(context.activeRmClient || context.client || context.isRmSession);

  if (isRm) {
    const client = context.activeRmClient || context.client;
    const name = client?.name || "Rahul Mehta";
    return {
      text: `SHERU RM Copilot: Comprehensive Advisory Briefing for ${name}:`,
      bullets: [
        `Portfolio Status: AUM ${formatINRShort(client?.aum ?? context.totalAssets ?? 7540000)} with Wealth Score ${client?.wealthScore ?? context.score ?? 68}/100.`,
        `Immediate RM Opportunity: Review asset drift, harvest available capital gains, and present term life cover top-up.`,
        `Next Best Action: Download the verified 360° PDF Dossier to share with client ahead of the quarterly review.`
      ],
      followUps: [
        `Suggest advisory strategy for ${name}`,
        `Draft client review email`,
        `Prepare asset rebalance proposal`
      ],
      actions: [
        { label: "Download 360° PDF Dossier", action: "export_dossier", icon: "FileDown", variant: "primary" },
        { label: "Log Client Outreach Note", action: "log_outreach", icon: "MessageSquare" },
        { label: "Return to RM Dashboard", href: "/rm/dashboard", icon: "Users" }
      ]
    };
  }

  return {
    text: `Hi Rahul — I'm Sheru, your AI Relationship Manager. I continuously monitor your Wealth 360 dashboard across Income, Investments, Debt, Protection, and Succession:`,
    bullets: [
      `What changed: Wealth Health score is ${context.score} (${context.grade}) with net worth at ${formatINRShort(context.netWorth || 3320000)}.`,
      "Why it matters: We found 3 priority areas (term protection, debt optimization, tax headroom) that can compound your financial life.",
      "What should happen next: Ask me about any specific pillar, or click 'Talk to RM' to connect with your Relationship Manager.",
      "Expected impact: Addressing your top 2 recommendations can raise your score by up to 14 points."
    ],
    followUps: [
      "Am I on track for retirement?",
      "Should I repay my loan or invest?",
      "How much insurance do I need?",
      "What is my FIRE timeline?"
    ],
    actions: [
      { label: "Review 6-Pillar Score", href: "/score", icon: "Gauge", variant: "primary" },
      { label: "Review Protection Gaps", href: "/protect", icon: "ShieldCheck" },
      { label: "Book Human RM Review", action: "open_rm", icon: "Headset" }
    ]
  };
}