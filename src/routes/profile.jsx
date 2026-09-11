import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, CalendarCheck, Headset, LogOut, RefreshCw, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { SectionHeader } from "@/components/wealth/section-header";
import { derivedExpenses, derivedIncome, useApp } from "@/context/app-context";
import { formatINR } from "@/lib/format";
import { rm, user } from "@/lib/mock-data";


export default function ProfilePage() {
  const { answers, resetOnboarding, logoutCustomer, setRmOpen, booking, score, canAccessRM, rmType } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutCustomer();
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader as="h1" title="Profile" description="Details behind your plan." />

        <div className="gradient-navy text-navy-foreground shadow-raised flex flex-wrap items-center gap-4 rounded-2xl p-6">
          <span className="bg-gold text-gold-foreground font-display flex size-16 items-center justify-center rounded-full text-xl font-semibold">
            {user.firstName[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-semibold">
              {user.name}
            </p>
            <p className="text-navy-foreground/75 text-sm">{user.email} · {answers.mobile || user.phone}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Link to="/plans">Manage Plan</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-red-400/40 bg-red-500/15 text-red-200 hover:bg-red-500/30 hover:text-white transition-colors gap-1.5"
            >
              <LogOut className="size-3.5" /> Log out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="surface-card space-y-4 p-5">
            <SectionHeader title="Account Details" />
            <dl className="space-y-3 text-sm">
              <Row label="Risk Profile" value={`${answers.riskAppetite || 5}/10 (${answers.liquidityPreference || "Medium"} Liquidity)`} />
              <Row label="Monthly Income" value={formatINR(derivedIncome(answers))} />
              <Row label="Monthly Expenses" value={formatINR(derivedExpenses(answers))} />
              <Row label="Retirement Target" value={`Age ${answers.retirementAge || 60}`} />
              <Row label="Current Wealth Score" value={`${score.total}/100 (${score.grade})`} />
            </dl>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={resetOnboarding}
              asChild>
              
              <Link to="/onboarding">
                <RefreshCw className="mr-1.5 size-4" /> Re-run onboarding
              </Link>
            </Button>
          </div>

          {canAccessRM ?
          <div className="surface-card p-5">
              <div className="flex items-center justify-between">
                <SectionHeader title="Your Relationship Manager" />
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {rmType}
                </span>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span className="bg-secondary text-secondary-foreground font-display flex size-12 items-center justify-center rounded-full font-semibold">
                  {rm.initials}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-semibold">
                    {rm.name} <BadgeCheck className="text-gold size-4" />
                  </p>
                  <p className="text-muted-foreground text-xs">{rm.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{rm.branch}</p>
                  <div className="text-muted-foreground num mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    <span className="flex items-center gap-1">
                      <Star className="text-gold size-3.5" /> {rm.rating}
                    </span>
                    <span>{rm.experience}</span>
                    <span>{rm.languages.join(" · ")}</span>
                  </div>
                </div>
              </div>

              {booking &&
            <div className="bg-success-soft text-success mt-4 flex items-start gap-2 rounded-xl p-3 text-xs">
                  <CalendarCheck className="mt-0.5 size-4 shrink-0" />
                  <span>
                    Booked: {booking.topic} · {booking.slot}
                  </span>
                </div>
            }

              <Button className="mt-5 w-full gap-2" onClick={() => setRmOpen(true)}>
                <Headset className="size-4" /> Talk to {rm.name.split(" ")[0]}
              </Button>
            </div> :

          <div className="surface-card p-5">
              <div className="flex items-center justify-between">
                <SectionHeader title="Sheru AI Wealth Guide" />
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-gold-foreground">
                  Active (Basic Plan)
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                You are currently on autonomous AI advisory. Sheru monitors cashflows, tax deductions, goal milestones, and insurance gaps 24/7.
              </p>
              <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs">
                <p className="font-semibold text-primary">Looking for dedicated human advisory?</p>
                <p className="text-muted-foreground mt-1">
                  Upgrade to Premium or Elite to unlock Shared or Dedicated Relationship Managers and private wealth desks.
                </p>
                <Button size="sm" className="mt-3 w-full" asChild>
                  <Link to="/plans">View Upgrade Options</Link>
                </Button>
              </div>
            </div>
          }
        </div>

        {/* Session & Local Storage Management */}
        <div className="surface-card space-y-3 p-6 border border-destructive/25 bg-destructive/[0.02] rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-foreground flex items-center gap-2">
                <LogOut className="size-4 text-destructive" />
                Sign Out & Clear Local Storage
              </p>
              <p className="text-muted-foreground text-xs mt-1 max-w-xl leading-relaxed">
                Clears all stored PAN profiles, customized cashflow figures, Account Aggregator links, what-if simulations, and active session tokens from this device.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="shrink-0 gap-1.5 shadow-sm"
            >
              <LogOut className="size-3.5" /> Log out & Clear Storage
            </Button>
          </div>
        </div>
      </div>
    </AppShell>);

}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="num font-medium">{value}</dd>
    </div>);

}