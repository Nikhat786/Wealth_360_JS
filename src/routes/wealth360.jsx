import { Link, useLocation, Outlet } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  Headset,
  HeartHandshake,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { useApp } from "@/context/app-context";
import sheruMascot from "@/assets/sheru-mascot.jpg";
import mark from "@/assets/wealth360-mark.png";

const pillars = [
  ["KNOW", "Understand your complete financial life."],
  ["GROW", "Build and optimise your wealth."],
  ["PROTECT", "Protect yourself and your family."],
  ["TRANSFER", "Plan what happens to your wealth next."],
];

const features = [
  "Net Worth",
  "Wealth Health",
  "Portfolio Analysis",
  "Goal Planning",
  "FIRE Calculator",
  "Tax Opportunities",
  "Insurance",
  "Debt Planning",
  "Life Events Engine",
  "Portfolio Rebalancing",
  "Nomination",
  "Will",
  "Family Wealth Vault",
  "SHERU AI Relationship Manager",
  "Wealth Map",
  "Account Aggregator",
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

export default function Wealth360Landing() {
  const { onboardingComplete, setRmOpen, canAccessRM } = useApp();
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

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
            <Link
              to="/onboarding"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-foreground sm:block"
            >
              Sign in
            </Link>
            <Button
              asChild
              className="bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
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
          <nav className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setNavOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
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
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-full border-gray-300 px-6 text-gray-700 hover:bg-gray-50"
                >
                  <Link to="/onboarding">
                    <Play className="mr-1.5 size-4 fill-current" />
                    See how it works
                  </Link>
                </Button>
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

            {/* Right Column — Sheru Mascot & Cards */}
            <div className="relative flex-1 flex justify-center lg:justify-end">
              {/* Tiger mascot image */}
              <div className="relative">
                <img
                  src={sheruMascot}
                  alt="Sheru — AI Relationship Manager"
                  className="relative z-10 h-[420px] w-auto object-contain drop-shadow-2xl sm:h-[480px] lg:h-[520px]"
                />

                {/* Speech Bubble */}
                <div
                  className="absolute right-0 top-[45%] z-20 w-64 animate-in fade-in slide-in-from-right-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:w-72"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                      <Sparkles className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">
                        Hi, I'm Sheru.
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                        Your AI Relationship Manager — here to help you build,
                        protect and grow your wealth at every stage of your life.
                      </p>
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
      {/* FOUR PILLARS                                                    */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-gray-400">
              One connected framework
            </p>
            <h2 className="font-display mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Four pillars, one financial life
            </h2>
          </div>
          <ShieldCheck className="size-6 text-emerald-500" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(([name, description], index) => (
            <div
              key={name}
              className="group surface-card rounded-2xl p-6 transition-all duration-200 hover:shadow-raised hover:-translate-y-0.5"
            >
              <span className="num text-xs text-gray-400">
                0{index + 1}
              </span>
              <p className="font-display mt-5 text-sm font-bold tracking-wide text-foreground">
                {name}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* FEATURES CLOUD                                                  */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
          A clearer way to manage your financial life
        </h2>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              {feature}
            </span>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* DATA CONTROL BANNER                                             */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="surface-card flex flex-wrap items-start gap-4 rounded-2xl p-5 sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
            <Lock className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-semibold text-foreground">
              Your information. Your control.
            </h2>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-gray-500">
              You choose what to share, you can edit it later, and no
              transaction is performed automatically. Recommendations are
              informational and subject to market conditions. A production
              version can connect Account Aggregator with your consent.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/profile">Review data & consent</Link>
          </Button>
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
      </section>
    </div>
  );
}