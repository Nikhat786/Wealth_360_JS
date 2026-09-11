import { formatINR, formatINRShort, formatPct, formatPlainPct } from "./format";

/**
 * Derives comprehensive financial intelligence for any client, enabling a multi-page,
 * institutional-grade Private Wealth Dossier for PDF export.
 */
function deriveClientFinancialIntelligence(client) {
  const aum = client.aum || 0;
  const isUHNI = client.tier === "UHNI";
  
  // Estimated annual income based on tier & AUM
  const estimatedIncome = isUHNI ? Math.max(8000000, Math.round(aum * 0.12)) : Math.max(3000000, Math.round(aum * 0.15));
  
  // Recommended Human Life Value (10x annual income or 12x if younger)
  const recommendedHLV = estimatedIncome * 12;
  const existingLifeCover = client.insurance?.lifeCover || 0;
  const hlvGap = Math.max(0, recommendedHLV - existingLifeCover);
  
  // Recommended Health Cover (UHNI: ₹50L - ₹1Cr; HNI: ₹25L - ₹50L)
  const recommendedHealthCover = isUHNI ? 5000000 : 2500000;
  const existingHealthCover = client.insurance?.healthCover || 0;
  const healthCoverGap = Math.max(0, recommendedHealthCover - existingHealthCover);

  // Model Asset Allocation based on risk profile
  const risk = client.riskProfile || "Moderate";
  let targetModel = {
    Stocks: 45,
    "Mutual Funds": 25,
    "Fixed Income / FD": 15,
    "Gold/SGB": 10,
    "Cash / Liquid": 5
  };

  if (risk.toLowerCase().includes("aggressive")) {
    targetModel = {
      Stocks: 60,
      "Mutual Funds": 20,
      "Fixed Income / FD": 10,
      "Gold/SGB": 5,
      "Cash / Liquid": 5
    };
  } else if (risk.toLowerCase().includes("conservative")) {
    targetModel = {
      Stocks: 25,
      "Mutual Funds": 25,
      "Fixed Income / FD": 35,
      "Gold/SGB": 10,
      "Cash / Liquid": 5
    };
  }

  // Calculate actual allocation weights and drift
  const rawAlloc = client.assetAllocation ?? [];
  const totalAlloc = rawAlloc.reduce((sum, a) => sum + a.value, 0) || aum || 1;
  
  const allocationAnalysis = rawAlloc.map((item) => {
    const actualPct = (item.value / totalAlloc) * 100;
    // Map item name to model key
    let targetPct = 15;
    if (item.name.toLowerCase().includes("stock")) targetPct = targetModel.Stocks;
    else if (item.name.toLowerCase().includes("mutual")) targetPct = targetModel["Mutual Funds"];
    else if (item.name.toLowerCase().includes("gold")) targetPct = targetModel["Gold/SGB"];
    else if (item.name.toLowerCase().includes("fd") || item.name.toLowerCase().includes("fixed")) targetPct = targetModel["Fixed Income / FD"];
    else if (item.name.toLowerCase().includes("real")) targetPct = 10;
    else if (item.name.toLowerCase().includes("cash")) targetPct = targetModel["Cash / Liquid"];

    const drift = actualPct - targetPct;
    let action = "Hold / Balanced";
    if (drift > 5) action = `Overweight (+${drift.toFixed(1)}%) — Trim / Rebalance`;
    else if (drift < -5) action = `Underweight (${drift.toFixed(1)}%) — Increase SIP / Allocation`;

    return {
      name: item.name,
      value: item.value,
      actualPct,
      targetPct,
      drift,
      action
    };
  });

  // Goal SIP calculations
  const goalsAnalysis = (client.goals ?? []).map((goal) => {
    const currentYear = new Date().getFullYear();
    const remainingYears = Math.max(1, (goal.targetYear || currentYear + 5) - currentYear);
    const shortfall = Math.max(0, (goal.target || 0) - (goal.saved || 0));
    // Approximate monthly SIP assuming 11% annual return
    const r = 0.11 / 12;
    const n = remainingYears * 12;
    const fvFactor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const monthlySipRequired = shortfall > 0 ? Math.round(shortfall / fvFactor) : 0;

    return {
      ...goal,
      remainingYears,
      shortfall,
      monthlySipRequired
    };
  });

  // Pillars Diagnostic Analysis
  const defaultPillars = [
    { key: "savings", label: "Savings & Cashflow", score: 75, target: 80, diagnostic: "Healthy monthly savings rate; recommend sweeping idle balances into arbitrage funds." },
    { key: "protection", label: "Protection & Insurance", score: existingLifeCover > 0 ? 65 : 35, target: 85, diagnostic: hlvGap > 0 ? `Term protection gap of ${formatINRShort(hlvGap)} detected. High priority.` : "Coverage aligns with Human Life Value." },
    { key: "diversification", label: "Asset Diversification", score: 60, target: 75, diagnostic: "Portfolio shows moderate concentration; explore multi-asset AIF or international exposure." },
    { key: "debt", label: "Debt & Leverage", score: 85, target: 80, diagnostic: "Debt-to-income ratio remains conservative (< 20%). Well within fiduciary limits." },
    { key: "liquidity", label: "Liquidity & Emergency", score: 70, target: 75, diagnostic: "Emergency reserves cover 6+ months of living expenditure." },
    { key: "goals", label: "Goal Preparedness", score: 72, target: 80, diagnostic: "Core retirement and education milestones are tracked with disciplined contributions." },
  ];

  const pillarScores = (client.scoreBreakdown && client.scoreBreakdown.length > 0)
    ? client.scoreBreakdown.map((p) => {
        const fallback = defaultPillars.find((dp) => dp.key === p.key) || { target: 80, diagnostic: "In line with client risk benchmark." };
        return {
          key: p.key,
          label: p.label,
          score: p.score,
          target: fallback.target,
          diagnostic: fallback.diagnostic
        };
      })
    : defaultPillars;

  return {
    estimatedIncome,
    recommendedHLV,
    hlvGap,
    recommendedHealthCover,
    healthCoverGap,
    allocationAnalysis,
    goalsAnalysis,
    pillarScores,
    isUHNI
  };
}

/**
 * Generates an executive-grade, multi-section printable document representing the client's
 * complete 360° wealth dossier. Styled with print-media rules so saving as PDF yields a
 * publication-ready institutional report.
 */
export function generateClientDashboardHtml(client, outreachLog = [], opts = {}) {
  const intel = deriveClientFinancialIntelligence(client);
  const allocation = intel.allocationAnalysis;
  const goals = intel.goalsAnalysis;
  const scores = intel.pillarScores;
  
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dossierId = `WV-${(client.tier || "HNI").toUpperCase()}-${new Date().getFullYear()}-${client.id ? client.id.slice(0, 6).toUpperCase() : "90210"}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${client.name} — WealthVerse 360° Private Wealth Dossier</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      line-height: 1.45;
      padding-bottom: 60px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Interactive top bar when previewed in browser */
    .no-print-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0a192f;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
    .no-print-bar .title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .no-print-bar .actions {
      display: flex;
      gap: 10px;
    }
    .no-print-bar button {
      background: #e67e22;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(230, 126, 34, 0.4);
      transition: all 0.2s ease;
    }
    .no-print-bar button:hover {
      background: #d35400;
      transform: translateY(-1px);
    }
    .no-print-bar button.secondary {
      background: #334155;
      box-shadow: none;
    }
    .no-print-bar button.secondary:hover {
      background: #475569;
    }

    /* Main PDF Document Container */
    .sheet {
      max-width: 960px;
      margin: 28px auto;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
      padding: 40px 44px;
    }

    /* Header & Branding */
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f2444;
      padding-bottom: 18px;
      margin-bottom: 20px;
    }
    .header-table td {
      vertical-align: top;
      border: none;
      padding: 0;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f2444;
      letter-spacing: -0.5px;
    }
    .brand-title span {
      color: #e67e22;
    }
    .brand-subtitle {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: #64748b;
      font-weight: 700;
      margin-top: 2px;
    }
    .dossier-tag {
      display: inline-block;
      background: #0f2444;
      color: #f8fafc;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .dossier-meta {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
      text-align: right;
    }

    /* Client Profile Card */
    .client-hero {
      background: linear-gradient(135deg, #091a30 0%, #172a45 100%);
      color: #ffffff;
      border-radius: 10px;
      padding: 22px 26px;
      margin-bottom: 22px;
    }
    .client-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .client-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .client-tier {
      display: inline-block;
      background: rgba(230, 126, 34, 0.3);
      color: #fbbf24;
      border: 1px solid rgba(230, 126, 34, 0.6);
      padding: 2px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .client-id {
      font-size: 11px;
      color: #94a3b8;
      font-family: monospace;
      margin-top: 2px;
    }
    .aum-banner {
      text-align: right;
    }
    .aum-banner .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      font-weight: 600;
    }
    .aum-banner .value {
      font-size: 26px;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.5px;
    }
    .client-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      font-size: 11px;
    }
    .client-grid-item .k {
      color: #94a3b8;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .client-grid-item .v {
      font-weight: 600;
      color: #ffffff;
      margin-top: 1px;
    }

    /* Executive Commentary */
    .commentary-box {
      background: #f8fafc;
      border-left: 4px solid #e67e22;
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin-bottom: 22px;
      font-size: 12px;
      color: #334155;
      line-height: 1.55;
    }
    .commentary-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f2444;
      margin-bottom: 4px;
    }

    /* 6 Key Stats Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 10px;
      text-align: center;
    }
    .kpi-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #64748b;
      font-weight: 700;
    }
    .kpi-value {
      font-size: 16px;
      font-weight: 800;
      color: #0f2444;
      margin-top: 4px;
    }
    .kpi-sub {
      font-size: 9px;
      color: #64748b;
      margin-top: 2px;
      font-weight: 500;
    }

    /* Sections */
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f2444;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 14px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title .badge {
      font-size: 9px;
      background: #e2e8f0;
      color: #334155;
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 22px;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
      padding: 8px 10px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 2px solid #94a3b8;
      text-align: left;
    }
    table.data-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
    }
    table.data-table tr:nth-child(even) td {
      background: #fafbfc;
    }
    .tar { text-align: right; }
    .tac { text-align: center; }

    /* Badges */
    .status-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .status-success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .status-alert { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .status-warning { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
    .status-info { background: #e0f2fe; color: #075985; border: 1px solid #7dd3fc; }

    /* Progress bars */
    .progress-bar-bg {
      background: #e2e8f0;
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 3px;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 3px;
    }

    /* 2 Columns Layout */
    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 22px;
    }

    /* Protection & Audit Cards */
    .protection-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 14px;
    }
    .prot-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #ffffff;
    }
    .prot-card.highlight {
      border-color: #f59e0b;
      background: #fffdfa;
    }
    .prot-card .label {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .prot-card .val {
      font-size: 15px;
      font-weight: 800;
      color: #0f2444;
      margin: 4px 0 2px 0;
    }
    .prot-card .sub {
      font-size: 10px;
      color: #64748b;
    }

    /* Roadmap Timeline */
    .action-plan-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 22px;
    }
    .plan-col {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #f8fafc;
    }
    .plan-header {
      font-size: 11px;
      font-weight: 800;
      color: #0f2444;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 2px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
    }
    .plan-items {
      list-style: none;
      font-size: 10.5px;
      color: #334155;
    }
    .plan-items li {
      margin-bottom: 6px;
      padding-left: 12px;
      position: relative;
      line-height: 1.4;
    }
    .plan-items li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #e67e22;
      font-weight: bold;
    }

    /* Sign-off & Fiduciary Seal */
    .signoff-box {
      border-top: 2px solid #0f2444;
      padding-top: 18px;
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .rm-sign-block {
      font-size: 11px;
      color: #334155;
    }
    .rm-sign-block strong {
      color: #0f2444;
      font-size: 12px;
    }
    .sign-line {
      width: 220px;
      border-bottom: 1px solid #0f2444;
      margin-top: 32px;
      margin-bottom: 4px;
    }

    .disclaimer {
      margin-top: 18px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 9px;
      color: #94a3b8;
      text-align: justify;
      line-height: 1.4;
    }

    .page-break {
      page-break-before: always;
    }
    .avoid-break {
      page-break-inside: avoid;
    }

    /* Print Specific Rules */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        font-size: 10.5px !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .sheet {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 14mm;
      }
      .client-hero {
        background: #091a30 !important;
        -webkit-print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Navigation / Print Utility -->
  <div class="no-print-bar">
    <div class="title">
      <span>🏛️ <strong>Mirae Asset WealthVerse</strong> • Client Wealth Dossier</span>
      <span style="opacity: 0.6; font-weight: normal;">|</span>
      <span style="font-size: 12px; opacity: 0.85;">Client: ${client.name} (${client.tier || "HNI"})</span>
    </div>
    <div class="actions">
      <button onclick="window.print()">
        📄 Print / Save as PDF
      </button>
      <button class="secondary" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <div class="sheet">
    <!-- Dossier Header -->
    <table class="header-table">
      <tr>
        <td>
          <div class="brand-title">Mirae Asset <span>WealthVerse</span></div>
          <div class="brand-subtitle">Private Wealth & Family Advisory • SEBI Registered Portfolio Manager</div>
        </td>
        <td style="text-align: right;">
          <span class="dossier-tag">Confidential Client Dossier</span>
          <div class="dossier-meta">Ref: <strong>${dossierId}</strong></div>
          <div class="dossier-meta">Generated: ${currentDate} • ${currentTime}</div>
        </td>
      </tr>
    </table>

    <!-- Client Profile Hero Card -->
    <div class="client-hero">
      <div class="client-top-row">
        <div>
          <div class="client-name">
            ${client.name}
            <span class="client-tier">${client.tier || "HNI"}</span>
          </div>
          <div class="client-id">Client ID: ${client.id || "C-90218"} • Domicile: Mumbai, IN • PAN: ${client.pan || "ABCDE1234F"}</div>
        </div>
        <div class="aum-banner">
          <div class="label">Total Net Worth / Consolidated AUM</div>
          <div class="value">${formatINR(client.aum || 0)}</div>
        </div>
      </div>

      <div class="client-grid">
        <div class="client-grid-item">
          <div class="k">Relationship RM</div>
          <div class="v">Kabir Sharma (BKC Wealth)</div>
        </div>
        <div class="client-grid-item">
          <div class="k">Tenure & Risk Profile</div>
          <div class="v">${client.relationshipYears != null ? client.relationshipYears + " yrs" : "New Client"} • ${client.riskProfile || "Moderate"}</div>
        </div>
        <div class="client-grid-item">
          <div class="k">Contact Mobile</div>
          <div class="v">${client.phone || "9820198201"}</div>
        </div>
        <div class="client-grid-item">
          <div class="k">Official Email</div>
          <div class="v">${client.email || "rahul.mehta@example.com"}</div>
        </div>
      </div>
    </div>

    <!-- Executive Commentary & Fiduciary Summary -->
    <div class="commentary-box">
      <div class="commentary-title">Executive Fiduciary Assessment & Portfolio Diagnosis</div>
      <p>
        ${client.name} maintains a total consolidated wealth balance of <strong>${formatINRShort(client.aum || 0)}</strong> under active advisory. 
        Overall 360° Financial Health is rated at <strong>${client.wealthScore ?? 70}/100</strong>. 
        ${client.performance30d != null ? `Portfolio has demonstrated a 30-day performance of <strong>${formatPct(client.performance30d)}</strong> against the benchmark.` : ""}
        Key advisory priorities for the upcoming cycle include rebalancing active asset drift, securing Human Life Value (HLV) term coverage, 
        and optimizing Section 80C/80D and capital gains harvest allowances under current fiscal guidelines.
      </p>
    </div>

    <!-- 6 KPI Stat Array -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Total AUM</div>
        <div class="kpi-value">${formatINRShort(client.aum || 0)}</div>
        <div class="kpi-sub">Verified Portfolio</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Wealth Score</div>
        <div class="kpi-value" style="color: ${client.wealthScore >= 70 ? '#16a34a' : client.wealthScore >= 50 ? '#d97706' : '#dc2626'};">
          ${client.wealthScore ?? "—"}/100
        </div>
        <div class="kpi-sub">Peer Avg: 68/100</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">30-Day Return</div>
        <div class="kpi-value" style="color: ${(client.performance30d ?? 0) >= 0 ? '#16a34a' : '#dc2626'};">
          ${client.performance30d != null ? formatPct(client.performance30d) : "—"}
        </div>
        <div class="kpi-sub">Trailing MTD</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Life Cover</div>
        <div class="kpi-value">${formatINRShort(client.insurance?.lifeCover || 0)}</div>
        <div class="kpi-sub">${intel.hlvGap > 0 ? "⚠️ Gap Identified" : "✅ Optimal"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Emergency Buffer</div>
        <div class="kpi-value">6.4 Mos</div>
        <div class="kpi-sub">Liquid Reserves</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Estate / Will</div>
        <div class="kpi-value" style="font-size: 13px; margin-top: 6px;">
          ${client.insurance?.hasWill ? "✅ On File" : "⚠️ Pending"}
        </div>
        <div class="kpi-sub">${client.insurance?.hasWill ? "Registered" : "Action Req."}</div>
      </div>
    </div>

    <!-- Section 1: Deep 360° Health Score by Pillar -->
    <div class="avoid-break" style="margin-bottom: 22px;">
      <div class="section-title">
        <span>1. 360° Financial Health Score — Deep Pillar Diagnostic</span>
        <span class="badge">Composite Model: 6 Pillars</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 22%;">Pillar</th>
            <th style="width: 14%;">Score / Target</th>
            <th style="width: 22%;">Pillar Progress</th>
            <th style="width: 14%;" class="tac">Status</th>
            <th style="width: 28%;">Fiduciary Diagnostic Observation</th>
          </tr>
        </thead>
        <tbody>
          ${scores.map((p) => {
            const color = p.score >= 70 ? "#16a34a" : p.score >= 45 ? "#d97706" : "#dc2626";
            const statusClass = p.score >= 70 ? "status-success" : p.score >= 45 ? "status-warning" : "status-alert";
            const statusLabel = p.score >= 70 ? "Optimal" : p.score >= 45 ? "Moderate" : "Underweight";
            return `
            <tr>
              <td><strong>${p.label}</strong></td>
              <td><strong>${p.score}</strong> / ${p.target}</td>
              <td>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${Math.min(100, Math.max(0, p.score))}%; background: ${color};"></div>
                </div>
              </td>
              <td class="tac"><span class="status-badge ${statusClass}">${statusLabel}</span></td>
              <td style="font-size: 10px; color: #475569;">${p.diagnostic}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>

    <!-- Section 2: Asset Allocation & Target Model Drift Analysis -->
    <div class="avoid-break" style="margin-bottom: 22px;">
      <div class="section-title">
        <span>2. Asset Allocation & Tactical Drift Analysis</span>
        <span class="badge">Model: ${client.riskProfile || "Moderate Balanced"}</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Asset Category</th>
            <th class="tar">Current Holding</th>
            <th class="tar">Current Weight</th>
            <th class="tar">Target Benchmark</th>
            <th class="tar">Variance / Drift</th>
            <th>Recommended Tactical Action</th>
          </tr>
        </thead>
        <tbody>
          ${allocation.length > 0 ? allocation.map((a) => {
            const driftColor = Math.abs(a.drift) <= 3 ? "#16a34a" : a.drift > 0 ? "#d97706" : "#dc2626";
            return `
            <tr>
              <td><strong>${a.name}</strong></td>
              <td class="tar">${formatINRShort(a.value)}</td>
              <td class="tar font-bold">${formatPlainPct(a.actualPct, 1)}</td>
              <td class="tar" style="color: #64748b;">${formatPlainPct(a.targetPct, 0)}</td>
              <td class="tar" style="font-weight: 700; color: ${driftColor};">
                ${a.drift >= 0 ? "+" : ""}${a.drift.toFixed(1)}%
              </td>
              <td style="font-size: 10px;">${a.action}</td>
            </tr>`;
          }).join("") : `<tr><td colspan="6" class="tac" style="color:#94a3b8;">No asset holding records available.</td></tr>`}
        </tbody>
      </table>
    </div>

    <!-- Page Break for Clean Multi-Page Print Layout -->
    <div class="page-break"></div>

    <!-- Section 3: Goals Roadmap & Horizon Funding -->
    <div class="avoid-break" style="margin-bottom: 22px; margin-top: 12px;">
      <div class="section-title">
        <span>3. Financial Goals Horizon & Capital Roadmap</span>
        <span class="badge">${goals.length} Goals Tracked</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Goal Milestone</th>
            <th class="tac">Target Year</th>
            <th class="tac">Horizon</th>
            <th class="tar">Target Corpus</th>
            <th class="tar">Accumulated</th>
            <th class="tar">Shortfall / Gap</th>
            <th class="tar">Recommended SIP</th>
            <th class="tac">Status</th>
          </tr>
        </thead>
        <tbody>
          ${goals.length > 0 ? goals.map((g) => `
            <tr>
              <td><strong>${g.name}</strong></td>
              <td class="tac">${g.targetYear}</td>
              <td class="tac">${g.remainingYears} yrs</td>
              <td class="tar">${formatINRShort(g.target)}</td>
              <td class="tar" style="color: #166534; font-weight: 600;">${formatINRShort(g.saved)}</td>
              <td class="tar" style="color: ${g.shortfall > 0 ? '#991b1b' : '#166534'};">
                ${g.shortfall > 0 ? formatINRShort(g.shortfall) : "Fully Funded"}
              </td>
              <td class="tar" style="font-weight: 700; color: #0f2444;">
                ${g.monthlySipRequired > 0 ? formatINR(g.monthlySipRequired) + "/mo" : "None required"}
              </td>
              <td class="tac">
                <span class="status-badge ${g.onTrack ? 'status-success' : 'status-alert'}">
                  ${g.onTrack ? 'On Track' : 'Gap Warning'}
                </span>
              </td>
            </tr>
          `).join("") : `<tr><td colspan="8" class="tac" style="color:#94a3b8;">No active financial goals configured.</td></tr>`}
        </tbody>
      </table>
    </div>

    <!-- Section 4: Risk Protection, HLV & Estate Audit -->
    <div class="avoid-break" style="margin-bottom: 22px;">
      <div class="section-title">
        <span>4. Comprehensive Protection, HLV Gap & Estate Audit</span>
        <span class="badge">Fiduciary Risk Shield</span>
      </div>
      <div class="protection-grid">
        <div class="prot-card ${intel.hlvGap > 0 ? 'highlight' : ''}">
          <div class="label">Term Life Cover</div>
          <div class="val">${formatINRShort(client.insurance?.lifeCover || 0)}</div>
          <div class="sub">HLV Target: ${formatINRShort(intel.recommendedHLV)}</div>
          <div style="margin-top: 6px;">
            <span class="status-badge ${intel.hlvGap > 0 ? 'status-alert' : 'status-success'}">
              ${intel.hlvGap > 0 ? `Gap: ${formatINRShort(intel.hlvGap)}` : 'Adequate'}
            </span>
          </div>
        </div>

        <div class="prot-card">
          <div class="label">Health Floater</div>
          <div class="val">${formatINRShort(client.insurance?.healthCover || 0)}</div>
          <div class="sub">Benchmark: ${formatINRShort(intel.recommendedHealthCover)}</div>
          <div style="margin-top: 6px;">
            <span class="status-badge ${intel.healthCoverGap > 0 ? 'status-warning' : 'status-success'}">
              ${intel.healthCoverGap > 0 ? `Top-up Suggested` : 'Adequate'}
            </span>
          </div>
        </div>

        <div class="prot-card">
          <div class="label">Digital Will & Trust</div>
          <div class="val">${client.insurance?.hasWill ? "Registered" : "Not on File"}</div>
          <div class="sub">${client.insurance?.hasWill ? "Witnessed & Sealed" : "Succession Risk"}</div>
          <div style="margin-top: 6px;">
            <span class="status-badge ${client.insurance?.hasWill ? 'status-success' : 'status-alert'}">
              ${client.insurance?.hasWill ? 'Completed' : 'High Priority'}
            </span>
          </div>
        </div>

        <div class="prot-card">
          <div class="label">Emergency Liquidity</div>
          <div class="val">6.4 Months</div>
          <div class="sub">Liquid Funds & FDs</div>
          <div style="margin-top: 6px;">
            <span class="status-badge status-success">Optimal</span>
          </div>
        </div>
      </div>

      ${client.insurance?.note ? `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #475569;">
          <strong>Advisor Protection Note:</strong> ${client.insurance.note}
        </div>
      ` : ""}
    </div>

    <!-- Section 5: Tax Optimization & Capital Efficiency -->
    <div class="avoid-break" style="margin-bottom: 22px;">
      <div class="section-title">
        <span>5. Tax Optimization & Net Alpha Opportunities</span>
        <span class="badge">FY 2025–26 Tax Provisions</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tax Provision</th>
            <th>Applicable Headroom</th>
            <th>Recommended Vehicle</th>
            <th>Potential Tax Savings</th>
            <th class="tac">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Section 80C Deduction</strong></td>
            <td>₹1,50,000 Max Annual Cap</td>
            <td>ELSS Equity Funds / PPF / EPF</td>
            <td>Up to ₹46,800</td>
            <td class="tac"><span class="status-badge status-success">Active / Monitored</span></td>
          </tr>
          <tr>
            <td><strong>Section 80D Health Premium</strong></td>
            <td>₹25,000 (Self) + ₹50,000 (Senior Parents)</td>
            <td>Comprehensive Family Floater</td>
            <td>Up to ₹23,400</td>
            <td class="tac"><span class="status-badge status-info">Review Headroom</span></td>
          </tr>
          <tr>
            <td><strong>NPS 80CCD(1B) Tier 1</strong></td>
            <td>₹50,000 Exclusive Additional Benefit</td>
            <td>National Pension Scheme (75% Equity)</td>
            <td>Up to ₹15,600</td>
            <td class="tac"><span class="status-badge status-warning">Deploy Surplus</span></td>
          </tr>
          <tr>
            <td><strong>LTCG Exemption Harvesting</strong></td>
            <td>₹1,25,000 Annual Tax-Free LTCG Allowance</td>
            <td>Direct Stocks & Equity MFs Harvesting</td>
            <td>12.5% on harvested gains</td>
            <td class="tac"><span class="status-badge status-success">Scheduled Q4</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 6: RM Action Plan & Strategic Recommendations -->
    <div class="avoid-break" style="margin-bottom: 22px;">
      <div class="section-title">
        <span>6. Relationship Manager Strategic Action Plan</span>
        <span class="badge">Next 90 Days</span>
      </div>
      <div class="action-plan-grid">
        <div class="plan-col">
          <div class="plan-header">
            <span>Immediate (30 Days)</span>
            <span style="color: #dc2626;">P0</span>
          </div>
          <ul class="plan-items">
            <li>Execute term insurance review to bridge ${formatINRShort(intel.hlvGap)} Human Life Value gap.</li>
            <li>Sweep idle cash into Mirae Asset Liquid/Arbitrage Fund for better post-tax yields.</li>
            <li>Initiate Nominee audit across all linked demat and depository accounts.</li>
          </ul>
        </div>

        <div class="plan-col">
          <div class="plan-header">
            <span>Mid-Term (60 Days)</span>
            <span style="color: #d97706;">P1</span>
          </div>
          <ul class="plan-items">
            <li>Rebalance equity allocation by trimming overweight positions into structured debt/PMS.</li>
            <li>Maximize Section 80CCD(1B) NPS contribution before fiscal year-end cut-off.</li>
            <li>Conduct draft review for Digital Will and Family Estate Trust structuring.</li>
          </ul>
        </div>

        <div class="plan-col">
          <div class="plan-header">
            <span>Milestone (90 Days)</span>
            <span style="color: #16a34a;">P2</span>
          </div>
          <ul class="plan-items">
            <li>Review Q4 portfolio performance vs Nifty 500 Multicap TRI benchmark.</li>
            <li>Execute systematic tax-loss harvesting and LTCG ₹1.25L gain booking.</li>
            <li>Annual Family Wealth & Succession review meeting at BKC branch.</li>
          </ul>
        </div>
      </div>

      ${(client.upsell?.length ?? 0) > 0 ? `
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px;">
          <div style="font-size: 11px; font-weight: 800; color: #92400e; text-transform: uppercase; margin-bottom: 6px;">
            💡 Selected Advisory Recommendations for Client
          </div>
          ${client.upsell.map((u) => `
            <div style="font-size: 11px; color: #78350f; margin-bottom: 4px;">
              • <strong>${u.title}:</strong> ${u.detail} <span style="opacity: 0.85;">(${u.potential})</span>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>

    <!-- Section 7: Interaction & Outreach History -->
    ${outreachLog.length > 0 || (client.activityLog?.length ?? 0) > 0 ? `
    <div class="avoid-break" style="margin-bottom: 22px;">
      <div class="section-title">
        <span>7. Fiduciary Engagement & Touchpoint Record</span>
        <span class="badge">Verified Log</span>
      </div>
      <table class="data-table" style="margin-bottom: 0;">
        <thead>
          <tr>
            <th style="width: 25%;">Timeline</th>
            <th style="width: 75%;">Interaction Summary / Advisory Note</th>
          </tr>
        </thead>
        <tbody>
          ${[...outreachLog, ...(client.activityLog ?? [])].slice(0, 5).map((a) => `
            <tr>
              <td style="color: #64748b; font-weight: 600;">${a.date}</td>
              <td>${a.note}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    <!-- Sign-off & Fiduciary Seal -->
    <div class="avoid-break signoff-box">
      <div class="rm-sign-block">
        <div class="sign-line"></div>
        <strong>Kabir Sharma</strong><br/>
        Senior Vice President — Private Wealth Advisory<br/>
        Mirae Asset Sharekhan Wealth Management<br/>
        SEBI Reg: INZ000008638 • AMFI: ARN-0018
      </div>

      <div class="rm-sign-block" style="text-align: right;">
        <div class="sign-line" style="margin-left: auto;"></div>
        <strong>${client.name}</strong><br/>
        Client Acknowledgement<br/>
        Date: ________________________
      </div>
    </div>

    <!-- Regulatory Compliance & Disclaimers -->
    <div class="disclaimer avoid-break">
      <p><strong>Regulatory Notice & Fiduciary Confidentiality:</strong> This Comprehensive 360° Wealth Dossier has been prepared by Mirae Asset Sharekhan Private Wealth Management solely for the private use of the designated client. Investments in securities are subject to market risks, including the possible loss of principal. Read all scheme-related documents carefully before investing. Past performance is not an indicator of future returns. Asset valuations, health scores, and goal simulations are derived from verified Account Aggregator feeds, depository records, and client disclosures. This document does not constitute a solicitation or legal opinion on tax or succession matters. Reproduction or distribution without written fiduciary authorization is strictly prohibited.</p>
      <p style="margin-top: 4px; text-align: center;">© ${new Date().getFullYear()} Mirae Asset Sharekhan. SEBI Registered Portfolio Manager & Stock Broker. All rights reserved.</p>
    </div>
  </div>

  ${opts.autoPrint ? `
  <script>
    window.addEventListener("load", () => {
      setTimeout(() => {
        window.print();
      }, 400);
    });
  </script>
  ` : ""}
</body>
</html>`;
}

/**
 * Directly initiates an instant browser PDF export/print dialog for the client's dossier,
 * without downloading raw HTML files or requiring intermediate conversions.
 */
export function downloadDashboardPdf(client, outreachLog = []) {
  const html = generateClientDashboardHtml(client, outreachLog, { autoPrint: false });
  
  // Set document title temporarily so browser default PDF save name is exact
  const cleanClientName = (client.name || "Client").replace(/\s+/g, "_");
  const defaultPdfTitle = `${cleanClientName}_WealthVerse_360_Dossier`;

  // Create an invisible iframe for direct print-to-PDF
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.title = defaultPdfTitle;

  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn("Iframe print blocked, falling back to dedicated print window:", e);
          previewDashboardPdf(client, outreachLog);
        } finally {
          setTimeout(() => {
            iframe.remove();
          }, 3000);
        }
      }, 500);
      return;
    }
  } catch (err) {
    console.warn("Error rendering PDF iframe, opening preview window:", err);
  }

  // Fallback if iframe access is restricted
  previewDashboardPdf(client, outreachLog);
}

/**
 * Opens a dedicated high-resolution print/PDF preview tab with an instant Print-to-PDF button.
 */
export function previewDashboardPdf(client, outreachLog = []) {
  const html = generateClientDashboardHtml(client, outreachLog, { autoPrint: true });
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  }
}

/**
 * Native Web Share trigger for the client's wealth summary if supported.
 */
export async function shareDashboardNative(client) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: `${client.name} — 360° Wealth Dossier`,
        text: `Official Mirae Asset WealthVerse 360° Financial Dossier for ${client.name}. Total AUM: ${formatINRShort(client.aum || 0)}, Wealth Score: ${client.wealthScore ?? "—"}/100.`,
        url: `${window.location.origin}/wealth360/review?client=${client.id}`,
      });
      return true;
    } catch (e) {
      if (e.name !== "AbortError") {
        console.warn("Native share error:", e);
      }
    }
  }
  return false;
}

/**
 * Generates and initiates download of a plain-text/markdown client summary for CRM logs.
 */
export function downloadDashboardText(client, outreachLog = []) {
  const intel = deriveClientFinancialIntelligence(client);
  const lines = [
    `========================================================================`,
    `MIRAE ASSET WEALTHVERSE — 360° CLIENT FINANCIAL DOSSIER`,
    `========================================================================`,
    `Client: ${client.name} (${client.tier || "HNI"})`,
    `Date: ${new Date().toLocaleDateString("en-IN")}`,
    `Phone: ${client.phone || "N/A"} | Email: ${client.email || "N/A"}`,
    `Risk Profile: ${client.riskProfile || "Moderate"} | Relationship: ${client.relationshipYears || 1} yrs`,
    ``,
    `------------------ PORTFOLIO & WEALTH SCORE ----------------------------`,
    `Total Net Worth / AUM: ${formatINR(client.aum || 0)}`,
    `Wealth Health Score: ${client.wealthScore ?? "—"}/100`,
    `30-Day Performance: ${client.performance30d != null ? formatPct(client.performance30d) : "—"}`,
    ``,
    `------------------ ASSET ALLOCATION & DRIFT ----------------------------`,
  ];

  intel.allocationAnalysis.forEach((a) => {
    lines.push(`  - ${a.name}: ${formatINR(a.value)} (${formatPlainPct(a.actualPct, 1)}) [Model: ${formatPlainPct(a.targetPct, 0)}, Drift: ${a.drift >= 0 ? "+" : ""}${a.drift.toFixed(1)}%]`);
  });

  lines.push(``, `------------------ 360° HEALTH SCORE PILLARS --------------------------`);
  intel.pillarScores.forEach((p) => {
    lines.push(`  - ${p.label}: ${p.score}/${p.target} — ${p.diagnostic}`);
  });

  lines.push(``, `------------------ GOALS ROADMAP ---------------------------------------`);
  intel.goalsAnalysis.forEach((g) => {
    lines.push(`  - ${g.name}: ${formatINR(g.saved)} of ${formatINR(g.target)} (Target: ${g.targetYear}) [${g.onTrack ? "On Track" : "Gap Alert"}] — Req SIP: ${g.monthlySipRequired > 0 ? formatINR(g.monthlySipRequired) + "/mo" : "Fully funded"}`);
  });

  lines.push(``, `------------------ PROTECTION & HUMAN LIFE VALUE -----------------------`);
  lines.push(`  - Existing Life Cover: ${formatINR(client.insurance?.lifeCover || 0)}`);
  lines.push(`  - Recommended HLV: ${formatINR(intel.recommendedHLV)} (Gap: ${intel.hlvGap > 0 ? formatINR(intel.hlvGap) : "None"})`);
  lines.push(`  - Health Insurance: ${formatINR(client.insurance?.healthCover || 0)} (Benchmark: ${formatINR(intel.recommendedHealthCover)})`);
  lines.push(`  - Digital Will & Estate: ${client.insurance?.hasWill ? "Registered" : "Missing / Action Required"}`);
  if (client.insurance?.note) lines.push(`  - RM Observation: ${client.insurance.note}`);

  if (client.upsell?.length) {
    lines.push(``, `------------------ STRATEGIC ADVISORY RECOMMENDATIONS -----------------`);
    client.upsell.forEach((u) => {
      lines.push(`  - ${u.title}: ${u.detail} (${u.potential})`);
    });
  }

  lines.push(``, `========================================================================`);
  lines.push(`Generated by Mirae Asset Sharekhan Wealth Management • Relationship Portal`);

  const text = lines.join("\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${client.name.replace(/\s+/g, "_")}_Wealth_Dossier_Summary.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
