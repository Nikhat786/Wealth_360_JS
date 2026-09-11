import { Link, useNavigate, useLocation } from "react-router-dom";
import {

  Bot,


  Compass,

  Crown,

  Gauge,
  Headset,
  HeartHandshake,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,

  Percent,

  ShieldCheck,
  Sparkles,
  Sprout,
  Target,



  X,
  Zap
} from
  "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { RMModal } from "@/components/wealth/rm-modal";
import { CoachPopover } from "@/components/wealth/coach-popover";
import { SubscriptionUpgradeModal } from "@/components/wealth/subscription-modal";
import { useApp } from "@/context/app-context";
import { user } from "@/lib/mock-data";
import mark from "@/assets/wealth360-mark.png";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/wealth360/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/know", label: "Know", icon: Compass },
  { to: "/portfolio", label: "Grow", icon: Sprout },
  { to: "/debt", label: "Debt Optimiser", icon: Percent },
  { to: "/goals", label: "Goals & FIRE", icon: Target },
  { to: "/life-events", label: "Life Events", icon: Zap, badge: "New" },
  { to: "/protect", label: "Protect", icon: ShieldCheck },
  { to: "/transfer", label: "Transfer & Vault", icon: HeartHandshake },
  { to: "/coach", label: "SHERU AI RM", icon: Bot, badge: "AI" },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/plans", label: "Plans", icon: Crown },
  { to: "/account-aggregator", label: "Account Aggregator", icon: Layers, badge: "Sync" }];


export function AppShell({
  children,
  minimal = false



}) {
  const {
    setRmOpen,
    score,
    onboardingComplete,
    subscriptionTier,
    canAccessRM,
    rmType,
    logoutCustomer
  } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutCustomer();
  };

  useEffect(() => {
    const publicPath =
      pathname === "/wealth360" ||
      pathname === "/welcome" ||
      pathname === "/onboarding" ||
      pathname === "/analysis" ||
      pathname === "/wealth360/journey" ||
      pathname === "/wealth360/analysis" ||
      pathname === "/account-aggregator" ||
      pathname === "/plans";

    if (!minimal && !onboardingComplete && !publicPath) {
      void navigate("/wealth360");
    }
  }, [minimal, navigate, onboardingComplete, pathname]);

  const publicPath =
    pathname === "/wealth360" ||
    pathname === "/welcome" ||
    pathname === "/onboarding" ||
    pathname === "/analysis" ||
    pathname === "/wealth360/journey" ||
    pathname === "/wealth360/analysis" ||
    pathname === "/account-aggregator" ||
    pathname === "/plans";

  if (!minimal && !onboardingComplete && !publicPath) {
    return <div className="min-h-screen bg-background" aria-hidden="true" />;
  }

  // Close mobile drawer on route change
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-foreground">
      {/* ------------------------------------------------------------- */}
      {/* Desktop Deep Navy Left Navigation Sidebar                     */}
      {/* ------------------------------------------------------------- */}
      {!minimal &&
        <aside className="hidden lg:flex w-64 shrink-0 flex-col sticky top-0 h-screen border-r border-[#1a2d4c] bg-[#0c182b] text-white select-none">
          {/* Brand Header */}
          <Link
            to="/wealth360"
            className="flex h-16 items-center gap-2.5 px-6 border-b border-[#1a2d4c] transition-opacity hover:opacity-90"
            title="Go to WealthVerse Home"
          >
            <img
              src={mark}
              alt="Mirae Asset WealthVerse"
              width={512}
              height={512}
              className="size-8" />

            <div className="min-w-0">
              <span className="font-display text-base font-bold tracking-tight text-white">
                Mirae Asset
                <span className="ml-1 text-gold font-semibold">WealthVerse</span>
              </span>
              <p className="text-[10px] text-white/50 truncate tracking-wide">
                Personal Wealth Operating System
              </p>
            </div>
          </Link>


          {/* Sidebar Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isDash = item.to === "/wealth360/dashboard" || item.to === "/";
              const active = isDash
                ? pathname === "/wealth360/dashboard" || pathname === "/dashboard"
                : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                    active ?
                      "bg-primary text-white shadow-md shadow-primary/25" :
                      "text-white/70 hover:bg-white/10 hover:text-white"
                  )}>

                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        active ? "text-white" : "text-white/60 group-hover:text-gold"
                      )} />

                    <span>{item.label}</span>
                  </div>
                  {item.badge &&
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                        active ?
                          "bg-white/20 text-white" :
                          "bg-gold/20 text-gold border border-gold/30"
                      )}>

                      {item.badge}
                    </span>
                  }
                </Link>);

            })}
          </nav>

          {/* Sheru AI Assistant Quick Banner at bottom of sidebar */}
          <div className="p-4 border-t border-[#1a2d4c] bg-[#091322]">
            <Link
              to="/coach"
              className="block rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-all">

              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-gold/20 text-gold">
                  <Bot className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">SHERU AI Advisory</p>
                  <p className="text-[10px] text-white/60 truncate">Active recommendations ready</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar Bottom Action: Log out & Clear Storage */}
          <div className="px-4 py-2 border-t border-[#1a2d4c]/60 bg-[#070e1a]">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-white/50 hover:text-red-300 hover:bg-white/5 transition-colors"
              title="Log out & clear local storage"
            >
              <LogOut className="size-3.5" />
              <span>Log out & reset session</span>
            </button>
          </div>
        </aside>
      }

      {/* ------------------------------------------------------------- */}
      {/* Main Content Area                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col min-w-0 bg-[#f8fafc]">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur-md sm:px-6">
          {/* Mobile hamburger & brand */}
          <div className="flex items-center gap-3">
            {!minimal &&
              <button
                type="button"
                className="lg:hidden rounded-lg p-2 text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation">

                <Menu className="size-5" />
              </button>
            }

            <Link
              to="/wealth360"
              className="flex items-center gap-2.5 lg:hidden">

              <img
                src={mark}
                alt="Mirae Asset WealthVerse"
                width={512}
                height={512}
                className="size-7" />

              <span className="font-display text-sm font-bold tracking-tight text-foreground">
                Mirae Asset
                <span className="ml-1 text-primary">WealthVerse</span>
              </span>
            </Link>

            {/* Desktop tagline */}
            <div className="hidden lg:block">
              <p className="text-xs text-muted-foreground font-medium">
                Grow. Protect. Transfer.{" "}
                <span className="text-foreground/75 font-normal">
                  Your complete financial life, in one intelligent universe.
                </span>
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Score pill */}
            {!minimal &&
              <Link
                to="/score"
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-semibold text-gold-foreground transition-transform hover:scale-105">

                <Gauge className="size-3.5" />
                <span>Score {score.total} · {score.grade}</span>
              </Link>
            }

            {/* Membership Tier Badge */}
            {!minimal &&
              <Link
                to="/plans"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                title="Manage WealthVerse Subscription Tier">

                <Crown className="size-3 text-gold" />
                <span>{subscriptionTier}</span>
              </Link>
            }

            {/* Fast Track AA Link */}
            {!minimal &&
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden md:flex gap-1.5 border-primary/30 text-primary hover:bg-primary/5">

                <Link to="/account-aggregator">
                  <Layers className="size-3.5" /> Fast-Track AA
                </Link>
              </Button>
            }

            {/* Talk to RM - Gated by Subscription Tier (Hidden for Basic) */}
            {canAccessRM &&
              <Button
                onClick={() => setRmOpen(true)}
                className="gap-2 bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                size="sm">

                <Headset className="size-4" />
                <span className="hidden sm:inline">
                  {rmType === "shared" ? "Shared RM" : rmType === "dedicated" ? "Dedicated RM" : "Private Desk"}
                </span>
              </Button>
            }

            {/* Profile Avatar */}
            {!minimal &&
              <Link
                to="/profile"
                className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0c182b] to-primary font-display text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
                aria-label="Profile">

                {user.firstName[0]}
              </Link>
            }

            {/* Customer Sign Out */}
            {!minimal && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="size-9 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Log out & clear local storage"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </Button>
            )}
          </div>
        </header>

        {/* Content Canvas */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Persistent Sheru Floating Trigger & Popover */}
        {!minimal && <CoachPopover />}

        {/* Relationship Manager Modal */}
        <RMModal />

        {/* Global Subscription Upgrade Modal */}
        <SubscriptionUpgradeModal />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Mobile Drawer Navigation                                      */}
      {/* ------------------------------------------------------------- */}
      {mobileMenuOpen &&
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)} />

          <div className="relative flex w-72 max-w-xs flex-col bg-[#0c182b] text-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1a2d4c] pb-4">
              <Link
                to="/wealth360"
                onClick={handleNavClick}
                className="flex items-center gap-2 transition-opacity hover:opacity-90"
              >
                <img src={mark} alt="Mirae Asset WealthVerse" className="size-7" />
                <span className="font-display font-bold text-white">
                  Mirae Asset <span className="text-gold">WealthVerse</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-white/60 hover:text-white">

                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-1">
              {NAV_ITEMS.map((item) => {
                const isDash = item.to === "/wealth360/dashboard" || item.to === "/";
                const active = isDash
                  ? pathname === "/wealth360/dashboard" || pathname === "/dashboard"
                  : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold",
                      active ?
                        "bg-primary text-white" :
                        "text-white/70 hover:bg-white/10 hover:text-white"
                    )}>

                    <div className="flex items-center gap-3">
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge &&
                      <span className="rounded-md bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold text-gold">
                        {item.badge}
                      </span>
                    }
                  </Link>);

              })}
            </div>

            {canAccessRM &&
              <div className="border-t border-[#1a2d4c] pt-4 space-y-2">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setRmOpen(true);
                  }}
                  className="w-full bg-primary">

                  <Headset className="mr-2 size-4" />
                  {rmType === "shared" ? "Talk to Shared RM" : rmType === "dedicated" ? "Talk to Dedicated RM" : "Private Desk"}
                </Button>
              </div>
            }

            {/* Mobile Drawer Logout */}
            <div className="border-t border-[#1a2d4c] pt-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="size-4" />
                <span>Log out & Clear Storage</span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}