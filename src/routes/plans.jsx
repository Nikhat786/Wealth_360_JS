
import {
  BadgeCheck,
  Building,
  Check,
  Crown,

  ShieldCheck,
  Sparkles,
  Zap } from
"lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";


const TIERS = [
{
  id: "Basic",
  name: "Basic",
  price: "Free",
  period: "Forever",
  badge: "Autonomous",
  description: "Essential personal finance tracking and autonomous AI guidance.",
  icon: Sparkles,
  features: [
  "Sheru AI Wealth Guide (Autonomous)",
  "Account Aggregator auto-sync (10+ sources)",
  "Goal progress tracking (up to 3 goals)",
  "Standard Wealth Map access",
  "Annual 80C Tax Headroom alert",
  "Community support"],

  limitations: [
  "No Human Relationship Manager",
  "No Digital Will & Succession tools",
  "No Continuous Sheru Advisory Engine"],

  highlighted: false,
  ctaText: "Switch to Basic"
},
{
  id: "Premium",
  name: "Premium",
  price: "₹499",
  period: "per month",
  badge: "Most Popular",
  description: "For professionals seeking tax optimization, advanced simulations, and human RM advisory.",
  icon: Zap,
  features: [
  "Shared Wealth Advisory Desk (Quarterly Consultation)",
  "Continuous Sheru 5-Part Advisory Engine",
  "Multi-asset Portfolio Rebalancing Engine",
  "Comprehensive 80C, 80D & NPS Tax Optimization",
  "Unlimited Goals & FIRE Independence Simulators",
  "Debt Optimizer (Snowball & Avalanche)"],

  limitations: [
  "Dedicated 1-on-1 RM requires Elite",
  "Digital Will Creation requires Elite"],

  highlighted: true,
  ctaText: "Upgrade to Premium"
},
{
  id: "Elite",
  name: "Elite",
  price: "₹1,999",
  period: "per month",
  badge: "HNI Wealth",
  description: "Full private wealth desk with dedicated senior RM, tax planning & estate succession.",
  icon: Crown,
  features: [
  "Everything in Premium included",
  "Dedicated Senior Relationship Manager (Priya Menon)",
  "Digital Will Creation & Succession Planning",
  "Advanced Family Wealth Vault & Continuity Card",
  "Priority Relationship Desk & Instant Scheduling",
  "Predictive Life Events Simulation Suite",
  "Direct Equity & PMS Allocation Review"],

  limitations: [],
  highlighted: false,
  ctaText: "Activate Elite Membership"
},
{
  id: "Enterprise",
  name: "Enterprise",
  price: "Custom",
  period: "Retainer",
  badge: "UHNI / Family Office",
  description: "Bespoke wealth governance, multi-generational trusts & family office desk.",
  icon: Building,
  features: [
  "Everything in Elite included",
  "Multi-generational Family Office Desk",
  "Private Family Trust Structuring & Legal Execution",
  "Cross-border Tax Planning & Overseas Real Estate",
  "AIFs & Direct Private Equity Syndication",
  "Direct Coordination with Family CAs & Lawyers",
  "Custom Governance & Succession Charters"],

  limitations: [],
  highlighted: false,
  ctaText: "Switch to Enterprise Desk"
}];


export default function PlansPage() {
  const { subscriptionTier, setSubscriptionTier, setRmOpen } = useApp();

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-10 py-6 sm:py-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
            <Sparkles className="size-3.5" /> Membership & Monetization
            <span className="ml-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              Current: {subscriptionTier} Tier
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose your WealthVerse Plan
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            From automated AI intelligence for retail investors to bespoke family office advisory for UHNI families.
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((tier) => {
            const isSelected = subscriptionTier === tier.id;
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-6 transition-all",
                  isSelected ?
                  "border-emerald-500 bg-card shadow-xl ring-2 ring-emerald-500/30" :
                  tier.highlighted ?
                  "border-primary bg-card shadow-lg ring-1 ring-primary/20" :
                  "border-border bg-card shadow-sm hover:shadow-md"
                )}>
                
                {tier.badge &&
                <span
                  className={cn(
                    "absolute -top-3 left-6 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                    isSelected ?
                    "bg-emerald-600 text-white shadow-sm" :
                    tier.highlighted ?
                    "bg-primary text-primary-foreground shadow-sm" :
                    "bg-muted text-foreground border"
                  )}>
                  
                    {isSelected ? "Active Plan" : tier.badge}
                  </span>
                }

                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {tier.name}
                  </h2>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-xs text-muted-foreground">/{tier.period}</span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground min-h-8">
                  {tier.description}
                </p>

                <div className="mt-6 flex-1 border-t pt-5">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-2 text-xs text-foreground">
                    {tier.features.map((feat, i) =>
                    <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                        <span>{feat}</span>
                      </li>
                    )}
                  </ul>

                  {tier.limitations && tier.limitations.length > 0 &&
                  <div className="mt-4 pt-3 border-t border-dashed">
                      <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2">
                        Plan Restrictions
                      </p>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {tier.limitations.map((lim, i) =>
                      <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{lim}</span>
                          </li>
                      )}
                      </ul>
                    </div>
                  }
                </div>

                <div className="mt-8 border-t pt-5">
                  <Button
                    className={cn(
                      "w-full font-semibold",
                      isSelected ?
                      "bg-emerald-600 hover:bg-emerald-700 text-white" :
                      tier.highlighted ?
                      "bg-primary text-primary-foreground hover:bg-primary/90" :
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => {
                      setSubscriptionTier(tier.id);
                      if (tier.id === "Enterprise") {
                        setRmOpen(true);
                      }
                    }}>
                    
                    {isSelected ?
                    <>
                        <BadgeCheck className="mr-1.5 size-4" /> Current Active Plan
                      </> :

                    tier.ctaText
                    }
                  </Button>
                </div>
              </div>);

          })}
        </div>

        {/* Feature Comparison Matrix Table */}
        <div className="surface-card overflow-hidden rounded-3xl border p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-foreground">
            WealthVerse Tier Capabilities Matrix
          </h2>
          <p className="text-xs text-muted-foreground mt-1 mb-6">
            Compare functionality across autonomous, assisted, and bespoke wealth desks.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-3 font-semibold text-foreground">Feature / Capability</th>
                  <th className="p-3 font-semibold text-foreground">Basic (Free)</th>
                  <th className="p-3 font-semibold text-primary">Premium (₹499)</th>
                  <th className="p-3 font-semibold text-gold">Elite (₹1,999)</th>
                  <th className="p-3 font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-medium">Account Aggregator Auto-Sync (10+ Sources)</td>
                  <td className="p-3 text-muted-foreground">❌ Manual Only</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Full Auto-Sync</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Full Auto-Sync</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Full Auto-Sync</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Human Relationship Manager</td>
                  <td className="p-3 text-muted-foreground">❌ AI Only</td>
                  <td className="p-3 text-foreground">Shared Advisory Desk</td>
                  <td className="p-3 text-gold font-semibold">Dedicated RM (Priya Menon)</td>
                  <td className="p-3 text-foreground font-semibold">Multi-Family Office Desk</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Digital Will & Estate Planning</td>
                  <td className="p-3 text-muted-foreground">❌ Locked</td>
                  <td className="p-3 text-muted-foreground">❌ Locked</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Full Digital Will</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Private Trust Execution</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Family Wealth Vault</td>
                  <td className="p-3 text-muted-foreground">Basic View</td>
                  <td className="p-3 text-foreground">Standard Vault</td>
                  <td className="p-3 text-emerald-600 font-semibold">Advanced + Emergency Card</td>
                  <td className="p-3 text-emerald-600 font-semibold">Bespoke Governance Charter</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Sheru Continuous AI Advisory</td>
                  <td className="p-3 text-foreground">Standard 3 Gaps</td>
                  <td className="p-3 text-emerald-600 font-semibold">Full 5-Part Continuous</td>
                  <td className="p-3 text-emerald-600 font-semibold">Full 5-Part Continuous</td>
                  <td className="p-3 text-emerald-600 font-semibold">Full 5-Part Continuous</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Multi-Asset Portfolio Rebalancing</td>
                  <td className="p-3 text-muted-foreground">❌ Locked</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Automated Drift Fix</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Custom Asset Allocations</td>
                  <td className="p-3 text-emerald-600 font-semibold">✅ Bespoke Mandate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature comparison guarantee */}
        <div className="rounded-3xl border bg-muted/30 p-6 sm:p-8 flex items-start gap-3">
          <ShieldCheck className="size-6 text-primary shrink-0 mt-1" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Zero Commission Conflicts on Direct Portfolios
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              WealthVerse advisory operates with fiduciary transparency. All mutual fund options in Premium & Elite plans can be deployed via direct plans.
            </p>
          </div>
        </div>
      </div>
    </AppShell>);

}