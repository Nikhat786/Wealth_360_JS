import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  Compass,
  Gauge,
  HeartHandshake,
  Headset,
  Landmark,
  Lock,
  Receipt,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Users
} from
  "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { useApp } from "@/context/app-context";


const pillars = [
  { key: "KNOW", icon: Compass, text: "See every rupee, loan, goal and policy in one map." },
  { key: "GROW", icon: Sprout, text: "Invest with purpose — allocation, tax and debt together." },
  { key: "PROTECT", icon: ShieldCheck, text: "Cover the people who depend on your income." },
  { key: "PLAN", icon: Target, text: "Model retirement, education and every life event." },
  { key: "TRANSFER", icon: Users, text: "Nomination, will and continuity for your family." }];


const benefits = [
  { icon: Target, label: "Goal-based investing & FIRE" },
  { icon: Landmark, label: "Net-worth tracking & AA Sync" },
  { icon: Gauge, label: "Wealth Health Score" },
  { icon: BadgeIndianRupee, label: "Cashflow & liability management" },
  { icon: ShieldCheck, label: "Protection analysis" },
  { icon: Receipt, label: "Tax optimisation opportunities" },
  { icon: HeartHandshake, label: "Wealth transfer planning" },
  { icon: Sparkles, label: "Sheru AI Relationship Manager" }];


export default function Welcome() {
  const { setRmOpen, canAccessRM } = useApp();

  return (
    <AppShell minimal>
      <div className="space-y-10">
        <section className="gradient-navy text-navy-foreground shadow-raised relative overflow-hidden rounded-2xl px-6 py-12 sm:px-10 sm:py-16">
          <span className="bg-gold/15 absolute -top-24 -right-24 size-72 rounded-full blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="bg-white/10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" /> Mirae Asset WealthVerse
            </span>
            <h1 className="font-display mt-5 text-3xl leading-tight font-semibold sm:text-5xl">
              Grow. Protect. Transfer.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-90 sm:text-lg">
              Your complete financial life, in one intelligent universe.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-75">
              Bring investments, cashflows, goals, protection, debt and family wealth into one
              intelligent operating system powered by Sheru AI.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/wealth360/journey">
                  Start WealthVerse Journey <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              {canAccessRM &&
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-navy-foreground hover:bg-white/15"
                  onClick={() => setRmOpen(true)}>

                  <Headset className="mr-1.5 size-4" /> Connect with RM
                </Button>
              }
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold sm:text-xl">Four pillars, one financial life</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((p, i) =>
              <div key={p.key} className="surface-card p-5">
                <div className="flex items-center gap-2">
                  <span className="bg-secondary text-secondary-foreground flex size-9 items-center justify-center rounded-xl">
                    <p.icon className="size-4.5" />
                  </span>
                  <span className="text-muted-foreground num text-xs">0{i + 1}</span>
                </div>
                <p className="font-display mt-3 text-sm font-semibold tracking-wide">{p.key}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{p.text}</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold sm:text-xl">What you get</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) =>
              <div key={b.label} className="surface-card flex items-center gap-3 p-4">
                <span className="bg-gold-soft text-gold-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <b.icon className="size-4" />
                </span>
                <p className="text-sm font-medium">{b.label}</p>
              </div>
            )}
          </div>
        </section>

        <section className="surface-card flex flex-wrap items-center gap-4 p-5">
          <span className="bg-secondary text-secondary-foreground flex size-10 items-center justify-center rounded-xl">
            <Lock className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">You are in control of your financial information</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              Everything here is entered by you and kept on this device for the prototype. Nothing is
              bought, sold or renewed without your explicit approval. Account Aggregator linking is a
              future capability and is not enabled.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/profile">Review data & consent</Link>
          </Button>
        </section>
      </div>
    </AppShell>);

}