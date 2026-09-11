import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  Building2,
  Coins,
  CreditCard,
  Lock,
  LogOut,
  PieChart,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import mark from "@/assets/wealth360-mark.png";

const FIVE_REVENUE_STREAMS = [
  {
    streamNumber: "1",
    title: "Brokerage & Margin Trade Financing (MTF)",
    category: "Trading & Leverage",
    rate: "₹0 delivery / ₹20 F&O | MTF at 6.99%–9.99%",
    projectedShare: "24%",
    icon: Coins,
    description: "Zero-brokerage equity delivery acts as the top-of-funnel acquisition magnet, while MTF (Margin Trade Financing) generates high-margin net interest income on leveraged equity holdings.",
    drivers: "Active equity turnover, algorithmic option trading, and margin funding book expansion."
  },
  {
    streamNumber: "2",
    title: "Distribution & Financial Origination",
    category: "Recurring Trails & Upfront",
    rate: "MFs: 25–75 bps | Insurance: 15–35% | Bonds: 0.5–1.5%",
    projectedShare: "28%",
    icon: PieChart,
    description: "Third-party distribution of Mutual Funds, Term & Health Insurance, Sovereign Gold Bonds, Corporate Fixed Deposits, and PMS/AIF origination fees.",
    drivers: "Sheru AI identifies unhedged protection risks and portfolio cash drag, triggering automated STP/SIP and insurance checkout flows."
  },
  {
    streamNumber: "3",
    title: "Fee-Based Investment Advisory",
    category: "Fiduciary Advisory",
    rate: "50–125 bps on Discretionary AUM",
    projectedShare: "18%",
    icon: TrendingUp,
    description: "SEBI Registered Investment Advisor (RIA) fee-only advisory desk providing multi-asset model portfolios, factor investing mandates, and rebalancing execution for affluent clients.",
    drivers: "Conversion of unadvised retail and HNI investors who seek conflict-free, unbiased asset allocation guidance."
  },
  {
    streamNumber: "4",
    title: "SaaS & Tiered Subscriptions",
    category: "Predictable SaaS MRR",
    rate: "₹499/mo (Premium) · ₹1,999/mo (Elite) · Retainer (Enterprise)",
    projectedShare: "18%",
    icon: CreditCard,
    description: "Monthly and annual recurring subscription revenue for premium platform intelligence: automated Account Aggregator syncing, dedicated RM access, and advanced life planning simulators.",
    drivers: "Locked feature gates on Basic tier driving high-intent upgrades from engaged savers and wealth builders."
  },
  {
    streamNumber: "5",
    title: "Value-Added Ancillary Services",
    category: "Partner Services & Structuring",
    rate: "₹4,999 – ₹49,999 per engagement",
    projectedShare: "12%",
    icon: Scale,
    description: "High-ticket fee splits with vetted legal and chartered accounting partner firms for Digital Will drafting, estate notarization, CA tax filing, and private family trust setup.",
    drivers: "Wealth Continuity Score and Family Vault readiness checks identifying succession vacuums in mature households."
  }
];

const STRATEGIC_KPIS = [
  {
    title: "Platform AUM Expansion",
    metric: "₹48,500 Cr+",
    detail: "Total multi-asset wealth tracked across AA-linked and platform assets.",
    growth: "+64% YoY",
    icon: BarChart3
  },
  {
    title: "Cross-Sell Velocity",
    metric: "3.4 Products",
    detail: "Average products held per active WealthVerse user (Trading + MF + Insurance + Will).",
    growth: "2.1x Industry Avg",
    icon: Sparkles
  },
  {
    title: "Blended ARPU",
    metric: "₹4,850 / yr",
    detail: "Annualized revenue per active user combining brokerage, trails, and SaaS subscriptions.",
    growth: "+145% vs Pure Brokerage",
    icon: BadgeDollarSign
  },
  {
    title: "LTV / CAC Ratio",
    metric: "7.8x",
    detail: "Low organic acquisition cost through Mirae Asset core combined with high compounding LTV.",
    growth: "Top Decile FinTech",
    icon: Users
  }
];

const BENEFIT_MATRIX = [
  {
    module: "Account Aggregator Auto-Sync",
    clientBenefit: "Consolidated 360° financial universe in seconds with zero manual Excel bookkeeping.",
    companyBenefit: "Instant full-wallet visibility across competitor bank accounts, MFs, and demat holdings for precision cross-selling."
  },
  {
    module: "Tax Optimization (80C, 80D, NPS)",
    clientBenefit: "Guaranteed legal tax reduction saving up to ₹78,000+ annually with automated headroom detection.",
    companyBenefit: "High-margin distribution origination for ELSS mutual funds, NPS accounts, and health insurance floaters."
  },
  {
    module: "Sheru AI Wealth Guide (5-Part)",
    clientBenefit: "Continuous 24/7 fiduciary analysis with clear reasons, financial impact, and exact action steps.",
    companyBenefit: "Massive scale advisory automation without linearly scaling human advisor headcount."
  },
  {
    module: "Human RM Desk (Shared / Dedicated)",
    clientBenefit: "Tailored 1-on-1 human confirmation for complex milestones, loans, and portfolio rebalancing.",
    companyBenefit: "Deep customer relationship stickiness, 92%+ retention, and unlocks Elite (₹1,999/mo) and Enterprise tiers."
  },
  {
    module: "Digital Will & Family Wealth Vault",
    clientBenefit: "Complete peace of mind knowing succession is documented and loved ones can access funds seamlessly.",
    companyBenefit: "Intergenerational asset retention — preserves client capital on Mirae Asset across wealth transfer events."
  }
];

export default function WealthVerseBusinessPage() {
  const { isRmSession, logoutRm } = useApp();
  const navigate = useNavigate();

  // Internal-only screen: gated strictly by RM session
  if (!isRmSession) return <Navigate to="/rm/login" replace />;

  const handleLogout = () => {
    logoutRm();
    navigate("/rm/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground">
      {/* ----------------------------------------------------------------- */}
      {/* Dedicated RM Portal Header (Independent from Customer AppShell)   */}
      {/* ----------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur-md sm:px-6">
        <Link
          to="/rm/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          title="Go to RM Dashboard"
        >
          <img src={mark} alt="Mirae Asset WealthVerse" className="size-7" />
          <div>
            <p className="font-display text-sm font-bold">
              Mirae Asset <span className="text-primary">WealthVerse</span>
            </p>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wide font-medium">
              RM Portal · Revenue Architecture
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            <Lock className="size-3" /> Internal RM Only
          </span>
          <Button asChild variant="outline" size="sm">
            <Link to="/rm/dashboard">
              <ArrowLeft className="mr-1.5 size-3.5" /> RM Dashboard
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 size-3.5" /> Log out
          </Button>
        </div>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/* Main Content: Dedicated Business Architecture Dossier            */}
      {/* ----------------------------------------------------------------- */}
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        {/* Back breadcrumb */}
        <Link
          to="/rm/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to book of business
        </Link>

        {/* Executive Strategic Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c192e] via-[#0f2444] to-[#081224] p-8 text-white shadow-2xl sm:p-12 relative overflow-hidden">
          <span className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[var(--color-primary)]/20 blur-3xl" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-gold uppercase backdrop-blur-md">
              <Sparkles className="size-3.5" /> Internal Strategic Architecture · Confidential
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              WealthVerse Multi-Stream Revenue Operating Model
            </h1>
            <p className="text-base text-white/80 leading-relaxed">
              How Mirae Asset evolves from a discount brokerage into an intelligent Personal Wealth Operating System capturing recurring AUM distribution trails, SaaS subscriptions, advisory fees, and estate structuring.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild className="bg-primary text-primary-foreground font-semibold">
                <Link to="/rm/dashboard">
                  <Building2 className="mr-1.5 size-4" /> View Book of Business
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Strategic KPI Cards */}
        <div>
          <div className="mb-4">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Strategic Financial KPIs
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unit economics and platform expansion benchmarks.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STRATEGIC_KPIS.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div key={i} className="surface-card rounded-2xl border p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {kpi.growth}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {kpi.metric}
                  </p>
                  <p className="text-xs font-semibold text-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {kpi.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5 Core Revenue Streams */}
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              5 Diversified Revenue Streams
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Transitioning from transactional brokerage volatility to high-margin recurring cashflows.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FIVE_REVENUE_STREAMS.map((stream) => {
              const Icon = stream.icon;
              return (
                <div
                  key={stream.streamNumber}
                  className="surface-card rounded-2xl border p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">Stream {stream.streamNumber}</span>
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-foreground">
                        {stream.projectedShare} Mix
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-foreground">
                      {stream.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {stream.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Fee Architecture
                      </span>
                      <p className="font-medium text-primary mt-0.5">{stream.rate}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Growth Trigger
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{stream.drivers}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client vs Company Benefits Matrix */}
        <div className="surface-card rounded-3xl border p-6 sm:p-8 space-y-6">
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase">
              Symbiotic Value Creation
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground mt-2">
              Client Value vs. Company Value Matrix
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              How each intelligent module drives user financial freedom while compounding Mirae Asset business value.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-3.5 font-semibold text-foreground w-1/4">WealthVerse Module</th>
                  <th className="p-3.5 font-semibold text-emerald-600 w-3/8">What the Client Gains (User ROI)</th>
                  <th className="p-3.5 font-semibold text-primary w-3/8">What Mirae Asset Gains (Business ROI)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {BENEFIT_MATRIX.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="p-3.5 font-bold text-foreground">{row.module}</td>
                    <td className="p-3.5 text-muted-foreground leading-relaxed">
                      <span className="text-emerald-500 font-bold mr-1.5">✓</span>
                      {row.clientBenefit}
                    </td>
                    <td className="p-3.5 text-muted-foreground leading-relaxed">
                      <span className="text-primary font-bold mr-1.5">★</span>
                      {row.companyBenefit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return to RM Operations */}
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Return to Client Relationship Management
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Access your client roster, pending call requests, portfolio diagnostics, and Sheru RM Copilot talking points.
            </p>
          </div>
          <Button asChild size="lg" className="bg-primary text-primary-foreground font-semibold shrink-0">
            <Link to="/rm/dashboard">
              Open RM Dashboard <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}