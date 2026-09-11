import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  Compass,
  Eye,
  FileCheck,
  FileText,
  Flame,
  Headset,
  HeartHandshake,
  Landmark,
  Lock,
  MessageSquareText,
  Milestone,
  PieChart,
  Play,
  RefreshCw,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { SheruVideoMascot } from "@/components/wealth/sheru-video-mascot";
import { useApp } from "@/context/app-context";
import sheruMascot from "@/assets/sheru-mascot.jpg";
import mark from "@/assets/wealth360-mark.png";

const PILLARS_DATA = [
  {
    id: "know",
    number: "01",
    name: "KNOW",
    label: "360° Clarity",
    tagline: "Understand your complete financial life.",
    description:
      "Automated real-time sync across bank accounts, mutual funds, demat equities, and EPF in one single pane of glass.",
    to: "/know",
    icon: Compass,
    accent: "blue",
    themeStyles: {
      cardGradient: "from-blue-500/[0.07] via-sky-500/[0.03] to-white",
      badge: "bg-blue-50 text-blue-700 border-blue-200/80",
      iconWrapper:
        "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25",
      borderHover: "hover:border-blue-300 group-hover:shadow-blue-500/10",
      linkText: "text-blue-600 hover:text-blue-700",
      metricTag: "bg-blue-50/80 text-blue-700 border-blue-200/50",
    },
    keyPoints: [
      "Automated Net Worth & Cashflow Map",
      "Unified Multi-Asset Allocation X-Ray",
      "Live Wealth Health Score (57/100)",
    ],
    metric: "360° Real-time",
  },
  {
    id: "grow",
    number: "02",
    name: "GROW",
    label: "Intelligent Alpha",
    tagline: "Build and optimise your wealth.",
    description:
      "Align monthly SIPs with goal milestones, optimize 80C/NPS tax headroom, and project early retirement FIRE freedom.",
    to: "/portfolio",
    icon: TrendingUp,
    accent: "emerald",
    themeStyles: {
      cardGradient: "from-emerald-500/[0.07] via-teal-500/[0.03] to-white",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      iconWrapper:
        "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25",
      borderHover: "hover:border-emerald-300 group-hover:shadow-emerald-500/10",
      linkText: "text-emerald-600 hover:text-emerald-700",
      metricTag: "bg-emerald-50/80 text-emerald-700 border-emerald-200/50",
    },
    keyPoints: [
      "AI-Optimized Portfolio Rebalancing",
      "FIRE Freedom & Retirement Target",
      "Tax Headroom (80C / NPS ₹0.7L)",
    ],
    metric: "Target 14.8% IRR",
  },
  {
    id: "protect",
    number: "03",
    name: "PROTECT",
    label: "Safety Shield",
    tagline: "Protect yourself and your family.",
    description:
      "Identify critical term life coverage gaps, stress-test medical cushions, and maintain a 6-month liquid emergency runway.",
    to: "/protect",
    icon: ShieldCheck,
    accent: "amber",
    themeStyles: {
      cardGradient: "from-amber-500/[0.07] via-orange-500/[0.03] to-white",
      badge: "bg-amber-50 text-amber-700 border-amber-200/80",
      iconWrapper:
        "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25",
      borderHover: "hover:border-amber-300 group-hover:shadow-amber-500/10",
      linkText: "text-amber-600 hover:text-amber-700",
      metricTag: "bg-amber-50/80 text-amber-700 border-amber-200/50",
    },
    keyPoints: [
      "Term Life Gap Analysis (₹1.9 Cr)",
      "Comprehensive Health Cover Buffer",
      "Emergency Runway & Debt Cleanup",
    ],
    metric: "Zero Gap Shield",
  },
  {
    id: "transfer",
    number: "04",
    name: "TRANSFER",
    label: "Family Legacy",
    tagline: "Plan what happens to your wealth next.",
    description:
      "Draft legally enforceable digital Wills, verify nominee synchronization across folios, and lock family assets in a secure vault.",
    to: "/transfer",
    icon: HeartHandshake,
    accent: "purple",
    themeStyles: {
      cardGradient: "from-purple-500/[0.07] via-violet-500/[0.03] to-white",
      badge: "bg-purple-50 text-purple-700 border-purple-200/80",
      iconWrapper:
        "bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-500/25",
      borderHover: "hover:border-purple-300 group-hover:shadow-purple-500/10",
      linkText: "text-purple-600 hover:text-purple-700",
      metricTag: "bg-purple-50/80 text-purple-700 border-purple-200/50",
    },
    keyPoints: [
      "Legally Valid Digital Will Builder",
      "Nominee Verification Across Folios",
      "Military-Grade Family Wealth Vault",
    ],
    metric: "100% Encrypted",
  },
];

const FEATURE_MODULES = [
  {
    id: "net-worth",
    name: "Net Worth",
    pillar: "know",
    icon: PieChart,
    to: "/know",
    badge: "Core",
    desc: "Real-time assets minus liabilities summary across all bank & demat folios",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/60",
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    id: "wealth-health",
    name: "Wealth Health",
    pillar: "know",
    icon: Activity,
    to: "/score",
    badge: "Score 57/100",
    desc: "Comprehensive multi-dimensional health scorecard measuring emergency, growth, and cover",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/60",
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    id: "portfolio-analysis",
    name: "Portfolio Analysis",
    pillar: "grow",
    icon: TrendingUp,
    to: "/portfolio",
    badge: "Alpha",
    desc: "X-Ray your mutual fund overlapping, equity beta, sector tilt, and historic CAGR",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "goal-planning",
    name: "Goal Planning",
    pillar: "grow",
    icon: Target,
    to: "/goals",
    badge: "Milestones",
    desc: "Inflation-adjusted multi-horizon target tracking for education, home, and legacy",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "fire-calculator",
    name: "FIRE Calculator",
    pillar: "grow",
    icon: Flame,
    to: "/goals",
    badge: "Popular",
    desc: "Calculate your exact Financial Independence / Early Retirement corpus target and year",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "tax-opportunities",
    name: "Tax Opportunities",
    pillar: "grow",
    icon: Coins,
    to: "/insights",
    badge: "Save Tax",
    desc: "Identify ₹0.7L+ headroom under Section 80C, 80D, and NPS 80CCD deductions",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "insurance",
    name: "Insurance",
    pillar: "protect",
    icon: Shield,
    to: "/protect",
    badge: "Protection",
    desc: "Human Life Value (HLV) gap analysis identifying term life and health insurance shortfalls",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200/60",
    iconColor: "text-amber-600 bg-amber-50",
  },
  {
    id: "debt-planning",
    name: "Debt Planning",
    pillar: "protect",
    icon: Scale,
    to: "/debt",
    badge: "Strategy",
    desc: "Smart debt avalanche and snowball amortization strategies to reduce high interest",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200/60",
    iconColor: "text-amber-600 bg-amber-50",
  },
  {
    id: "life-events-engine",
    name: "Life Events Engine",
    pillar: "grow",
    icon: Milestone,
    to: "/life-events",
    badge: "Simulation",
    desc: "Stress-test how marriage, children, career changes, or sabbaticals impact your wealth",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "portfolio-rebalancing",
    name: "Portfolio Rebalancing",
    pillar: "grow",
    icon: Shuffle,
    to: "/portfolio",
    badge: "Automated",
    desc: "Actionable drift corrections to restore your target asset allocation and minimize risk",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "nomination",
    name: "Nomination",
    pillar: "transfer",
    icon: FileCheck,
    to: "/transfer",
    badge: "Folio Sync",
    desc: "Audit and verify 100% nominee alignment across all bank accounts and mutual fund folios",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200/60",
    iconColor: "text-purple-600 bg-purple-50",
  },
  {
    id: "will",
    name: "Will",
    pillar: "transfer",
    icon: FileText,
    to: "/transfer",
    badge: "Digital Estate",
    desc: "Create legally enforceable digital Wills with customized asset distribution logic",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200/60",
    iconColor: "text-purple-600 bg-purple-50",
  },
  {
    id: "family-wealth-vault",
    name: "Family Wealth Vault",
    pillar: "transfer",
    icon: Landmark,
    to: "/transfer",
    badge: "Encrypted Locker",
    desc: "Bank-grade encrypted digital repository for property deeds, insurance policies, and wills",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200/60",
    iconColor: "text-purple-600 bg-purple-50",
  },
  {
    id: "sheru-ai-rm",
    name: "SHERU AI Relationship Manager",
    pillar: "sheru",
    icon: Sparkles,
    to: "/coach",
    badge: "AI Co-Pilot",
    desc: "Autonomous 24/7 AI RM offering proactive guidance, portfolio health audits, and answers",
    tagColor: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-900 border-amber-300",
    iconColor: "text-amber-600 bg-amber-100",
    isFeatured: true,
  },
  {
    id: "wealth-map",
    name: "Wealth Map",
    pillar: "know",
    icon: Compass,
    to: "/know",
    badge: "Interactive",
    desc: "Interactive visual mind map connecting income streams, asset clusters, and legacy folios",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/60",
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    id: "account-aggregator",
    name: "Account Aggregator",
    pillar: "know",
    icon: RefreshCw,
    to: "/account-aggregator",
    badge: "RBI Licensed",
    desc: "Consent-driven automated fetch of bank balances, deposits, and mutual funds via RBI AA",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/60",
    iconColor: "text-blue-600 bg-blue-50",
  },
];

const PILLAR_FILTERS = [
  { id: "all", label: "All Capabilities", count: 16 },
  { id: "know", label: "KNOW", count: 4 },
  { id: "grow", label: "GROW", count: 5 },
  { id: "protect", label: "PROTECT", count: 2 },
  { id: "transfer", label: "TRANSFER", count: 3 },
  { id: "sheru", label: "SHERU AI", count: 1 },
];

const navLinks = [
  // { label: "Invest", to: "/portfolio" },
  // { label: "Protect", to: "/protect" },
  // { label: "Plan", to: "/goals" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "SEBI-registered ecosystem" },
  { icon: Lock, label: "Your data stays yours" },
  { icon: CheckCircle2, label: "No auto-transactions" },
];

const morningReview = [
  { tone: "destructive", text: "Risk ahead of your nearest goal" },
  { tone: "destructive", text: "Life cover ₹6.4 Cr short" },
  { tone: "success", text: "Retirement 4% ahead of plan" },
];

const SHERU_VIDEOS = [
  { id: "idle", label: "Active", src: "/sheru/sheru-idle.mp4", icon: "🐾" },
  { id: "attention", label: "Attentive", src: "/sheru/sheru-attention.mp4", icon: "🎯" },
  { id: "happy", label: "Celebrating", src: "/sheru/sheru-happy.mp4", icon: "🎉" },
];

export default function Wealth360Landing() {
  const { onboardingComplete, setRmOpen, canAccessRM, discussWithSheru } = useApp();
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("idle");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const currentVideo =
    SHERU_VIDEOS.find((v) => v.id === selectedVideo) || SHERU_VIDEOS[0];

  const handlePillarFilter = (pillarId) => {
    setActiveFilter(pillarId);
    const el = document.getElementById("features-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredModules = FEATURE_MODULES.filter((item) => {
    const matchesPillar =
      activeFilter === "all" ||
      (activeFilter === "sheru" && (item.pillar === "sheru" || item.isFeatured)) ||
      item.pillar === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPillar && matchesSearch;
  });

  if (pathname !== "/wealth360") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* ──────────────────────────────────────────────────────────────── */}
      {/* TOP NAVIGATION BAR                                              */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/wealth360" className="flex items-center gap-2.5">
            <img
              src={mark}
              alt="Mirae Asset Sharekhan"
              width={512}
              height={512}
              className="size-8"
            />
            <span className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
              <span className="text-[#1a2d4c]">Mirae Asset</span>{" "}
              <span className="text-primary font-semibold">WealthVerse</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* RM Portal Access Badge Button */}
            <Link
              to="/rm/login"
              className="group hidden items-center gap-2 rounded-full border border-gray-200/90 bg-gray-50/90 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary sm:inline-flex shadow-2xs"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Headset className="size-3" />
              </span>
              <span>Sign in as RM</span>
              <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold tracking-wide text-primary uppercase">
                Portal
              </span>
            </Link>

            {/* Subtle Divider */}
            <div className="hidden h-5 w-px bg-gray-200 sm:block" />

            {/* Client Sign in */}
            <Link
              to="/onboarding"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-foreground sm:block"
            >
              Sign in
            </Link>

            {/* Primary Get Started Button */}
            <Button
              asChild
              className="bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 rounded-full px-5"
            >
              <Link
                to={
                  onboardingComplete
                    ? "/wealth360/dashboard"
                    : "/wealth360/journey"
                }
              >
                Get Started
              </Link>
            </Button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle Navigation"
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    navOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {navOpen && (
          <nav className="border-t border-gray-100 bg-white px-4 py-4 md:hidden space-y-3">
            <div className="flex flex-col gap-2">
              <Button
                asChild
                className="w-full bg-primary text-primary-foreground font-semibold shadow-sm rounded-xl py-2.5"
              >
                <Link
                  to={
                    onboardingComplete
                      ? "/wealth360/dashboard"
                      : "/wealth360/journey"
                  }
                  onClick={() => setNavOpen(false)}
                >
                  Get Started
                </Link>
              </Button>

              <Link
                to="/onboarding"
                onClick={() => setNavOpen(false)}
                className="block text-center rounded-xl py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-100"
              >
                Sign in (Client)
              </Link>

              <div className="border-t border-gray-100 pt-2">
                <Link
                  to="/rm/login"
                  onClick={() => setNavOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/90 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Headset className="size-3.5" />
                    </span>
                    <span>Sign in as RM (Advisor Portal)</span>
                  </span>
                  <ArrowRight className="size-3.5 text-gray-400" />
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION                                                    */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Left Column — Text & CTAs */}
            <div className="max-w-xl flex-1 space-y-6 lg:pt-8">
              <span className="inline-flex items-center gap-2 text-lg font-bold tracking-widest text-primary uppercase">
                <span className="size-2 rounded-full bg-primary" />
                WEALTHVERSE
              </span>

              <h1 className="font-display text-4xl leading-[1.1] font-extrabold tracking-tight text-[#1a2335] sm:text-5xl lg:text-[3.4rem]">
                Your complete
                <br />
                wealth journey.
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #e67e22, #f39c12, #e74c3c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Now in one place.
                </span>
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-gray-600">
                Invest, protect and plan your future with{" "}
                <strong className="text-foreground">Sheru</strong> — your AI
                Relationship Manager. One relationship, one view of your
                financial life, one advisor who has already read your numbers
                before you ask.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 rounded-full px-7"
                >
                  <Link
                    to={
                      onboardingComplete
                        ? "/wealth360/dashboard"
                        : "/wealth360/journey"
                    }
                  >
                    Get Started <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-full border-gray-300 px-6 text-gray-700 hover:bg-gray-50"
                >
                  <Link to="/onboarding">
                    <Play className="mr-1.5 size-4 fill-current" />
                    See how it works
                  </Link>
                </Button> */}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {trustBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <span
                      key={badge.label}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500"
                    >
                      <Icon className="size-3.5 text-emerald-500" />
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right Column — Sheru Mascot Video & Cards */}
            <div className="relative flex-1 flex flex-col items-center lg:items-end justify-center">
              {/* Mood selector pills */}
              {/* <div className="mb-3 flex items-center gap-1.5 rounded-full bg-white/90 p-1 shadow-sm border border-gray-200/80 backdrop-blur-md z-30">
                {SHERU_VIDEOS.map((v) => {
                  const isActive = selectedVideo === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVideo(v.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <span>{v.icon}</span>
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div> */}

              {/* Tiger mascot animated video container with real-time transparent keying */}
              <div
                className="relative group cursor-pointer"
                onClick={() => {
                  const nextIdx =
                    (SHERU_VIDEOS.findIndex((v) => v.id === selectedVideo) + 1) %
                    SHERU_VIDEOS.length;
                  setSelectedVideo(SHERU_VIDEOS[nextIdx].id);
                }}
              >
                <SheruVideoMascot
                  key={currentVideo.src}
                  src={currentVideo.src}
                  //poster={sheruMascot}
                  alt="Sheru — AI Relationship Manager"
                  className="h-[600px] w-auto max-w-full sm:h-[480px] lg:h-[520px] transition-transform duration-300 group-hover:scale-[1.01]"
                />

                {/* Speech Bubble */}
                <div
                  className="absolute right-0 top-[70%] z-20 w-64 animate-in fade-in slide-in-from-right-3 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:w-72 pointer-events-auto"
                  style={{ animationDelay: "300ms" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                      <Sparkles className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-bold text-foreground">
                          Hi, I'm Sheru.
                        </p>
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                          {currentVideo.label}
                        </span>
                      </div>
                      {selectedVideo === "idle" && (
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          Your AI Relationship Manager — here to help you build,
                          protect and grow your wealth at every stage of your life.
                        </p>
                      )}
                      {selectedVideo === "attention" && (
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          I'm listening! Ask me about your term life gap, 80C tax headroom, or early retirement FIRE targets.
                        </p>
                      )}
                      {selectedVideo === "happy" && (
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          Welcome to WealthVerse! Let's elevate your financial health score and build your family legacy.
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => discussWithSheru("Give me an actionable executive review of my Wealth 360 dashboard and top priorities.")}
                          className="h-7 text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10 shadow-sm"
                        >
                          <MessageSquareText className="size-3.5" /> Discuss with SHERU
                        </Button>
                        <p className="text-[10px] text-gray-400 italic">
                          Click Sheru to switch modes ↗
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* This Morning's Review Card */}
                {/* <div
                  className="absolute -top-2 right-0 z-20 w-60 animate-in fade-in slide-in-from-top-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:-right-4 lg:-right-8"
                  style={{ animationDelay: "500ms" }}
                >
                  <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                    <Sparkles className="size-3 text-primary" />
                    This Morning's Review
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {morningReview.map((item) => (
                      <li
                        key={item.text}
                        className="flex items-start gap-2 text-xs text-gray-700"
                      >
                        <span
                          className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                            item.tone === "success"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">
            Start with Sheru — unlock deeper financial intelligence with{" "}
            <Link
              to="/plans"
              className="font-semibold text-primary hover:underline"
            >
              WealthVerse Plus
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* FOUR PILLARS — INTERACTIVE BENTO GRID                            */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              <span>ONE CONNECTED ARCHITECTURE</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-[#1a2335] sm:text-3xl lg:text-4xl">
              Four pillars, one cohesive financial life
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
              Stop juggling disconnected apps for investing, insurance, and taxes. WealthVerse unites every dimension of your family capital under one continuous intelligence loop.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50/80 px-4 py-2.5 text-xs font-semibold text-emerald-800 border border-emerald-200/70 shadow-sm self-start md:self-auto shrink-0">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
            </span>
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>SEBI Registered & RBI AA Framework</span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS_DATA.map((pillar) => {
            const Icon = pillar.icon;
            const isFilterActive = activeFilter === pillar.id;

            return (
              <div
                key={pillar.id}
                className={`group relative flex flex-col justify-between rounded-3xl border bg-gradient-to-b ${pillar.themeStyles.cardGradient} p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${pillar.themeStyles.borderHover} ${isFilterActive ? "ring-2 ring-primary shadow-lg" : "border-gray-200/80"
                  }`}
              >
                <div>
                  {/* Top Bar: Number + Live Metric Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold tracking-widest text-gray-400">
                      {pillar.number}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${pillar.themeStyles.badge}`}
                    >
                      {pillar.label}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className={`flex size-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${pillar.themeStyles.iconWrapper}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {pillar.name}
                      </h3>
                      <p className="text-[11px] font-medium text-gray-500">
                        {pillar.metric}
                      </p>
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <p className="mt-3 text-xs font-semibold text-gray-800">
                    {pillar.tagline}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {pillar.description}
                  </p>

                  {/* Key points */}
                  <div className="mt-4 space-y-1.5 border-t border-gray-100/80 pt-3">
                    {pillar.keyPoints.map((pt) => (
                      <div
                        key={pt}
                        className="flex items-center gap-2 text-[11px] font-medium text-gray-700"
                      >
                        <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: Direct Route + Filter Tools */}
                <div className="mt-6 flex items-center justify-between gap-2 border-t border-gray-100/80 pt-4">
                  <Link
                    to={pillar.to}
                    className={`inline-flex items-center text-xs font-bold transition-colors ${pillar.themeStyles.linkText}`}
                  >
                    Launch {pillar.name}
                    <ArrowRight className="ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handlePillarFilter(pillar.id)}
                    className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600 shadow-sm border border-gray-200 transition-colors hover:bg-gray-50 hover:text-primary cursor-pointer"
                    title={`Highlight ${pillar.name} tools below`}
                  >
                    View Tools ↓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* FEATURES SHOWCASE — INTERACTIVE CAPABILITIES CLOUD               */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section id="features-section" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200/80 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/40 p-6 shadow-sm sm:p-8">
          {/* Header & Controls */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-gray-200/60 pb-6">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#1a2335] sm:text-2xl">
                A clearer way to manage your financial life
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                16 integrated financial modules operating in real-time synergy. Click any tool to experience it live.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g., FIRE, Tax, Will)..."
                className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {PILLAR_FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-100/60"
                    }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feature Cards Grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredModules.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.to}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${feature.isFeatured
                    ? "border-amber-300 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white shadow-amber-500/10"
                    : "border-gray-200/80 bg-white hover:border-primary/40 hover:bg-primary/[0.02]"
                    }`}
                >
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors ${feature.iconColor}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${feature.tagColor}`}
                      >
                        {feature.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {feature.name}
                      </p>
                      <ArrowUpRight className="size-3.5 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                    </div>

                    {/* Short Description */}
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 line-clamp-2">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Micro Pillar Indicator */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400 font-medium">
                    <span className="uppercase tracking-wider">
                      Pillar: {feature.pillar}
                    </span>
                    <span className="font-semibold text-primary group-hover:underline">
                      Launch &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="py-12 text-center">
              <Search className="mx-auto size-8 text-gray-300" />
              <p className="mt-2 text-sm font-semibold text-gray-600">
                No features found matching "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="mt-3 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* DATA CONTROL & BANK-GRADE TRUST BANNER                           */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.05] via-white to-blue-500/[0.04] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                <ShieldCheck className="size-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-base font-bold text-[#1a2335] sm:text-xl">
                    Your Information. Your Complete Sovereignty.
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    100% Consent Protected
                  </span>
                </div>
                <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-gray-600">
                  Built on the RBI Account Aggregator protocol and SEBI compliance guidelines. You choose what to share, your credentials are never stored, and no transaction executes without your manual authorization.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20"
              >
                <Link to="/profile">
                  <Lock className="mr-2 size-4" /> Review Data & Consents
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Link to="/account-aggregator">
                  <RefreshCw className="mr-1.5 size-4 text-emerald-600" /> Account Aggregator
                </Link>
              </Button>
            </div>
          </div>

          {/* 3 Pillars of Trust */}
          <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl bg-white/80 p-3.5 border border-gray-100">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Lock className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">256-Bit Bank Grade TLS</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                  Direct cryptographic exchange via RBI licensed AAs. Credentials are never seen or stored.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/80 p-3.5 border border-gray-100">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldAlert className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Non-Transactional Guarantee</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                  Purely analytical and advisory. No funds or SIPs can ever be moved without your manual OTP.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/80 p-3.5 border border-gray-100">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">1-Click Instant Revocation</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                  You maintain 100% data ownership. Disconnect banks or purge cached history anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* CTA SECTION                                                     */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0c192e] via-[#0f2444] to-[#081224] p-8 text-white shadow-2xl sm:p-12 relative overflow-hidden">
          <span className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1 space-y-3">
              <h3 className="font-display text-xl font-bold sm:text-2xl">
                Ready to start your wealth journey?
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-white/75">
                Let SHERU analyze your financial universe and build a
                personalised roadmap for your family's future.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                <Link
                  to={
                    onboardingComplete
                      ? "/wealth360/dashboard"
                      : "/wealth360/journey"
                  }
                >
                  Get Started <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              {canAccessRM && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white hover:bg-white/15"
                  onClick={() => setRmOpen(true)}
                >
                  <Headset className="mr-1.5 size-4" /> Talk to RM
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Advisor / RM Portal Secondary Access Link */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Are you a Relationship Manager or Wealth Advisor?{" "}
            <Link
              to="/rm/login"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline ml-1"
            >
              <Headset className="size-3.5" /> Sign in to RM Advisor Portal &rarr;
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}