import { useNavigate } from "react-router-dom";
import {
  ArrowRight,

  CheckCircle2,
  Crown,


  Zap } from
"lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,

  DialogTitle } from
"@/components/ui/dialog";
import { useApp } from "@/context/app-context";









const TIER_BENEFITS = {
  Basic: {
    name: "Basic",
    price: "Free",
    badge: "Current Plan",
    benefits: [
    "Dashboard & Net Worth tracking",
    "Wealth Health Score",
    "Goal progress tracking",
    "Sheru AI Basic Guidance"]

  },
  Premium: {
    name: "Premium",
    price: "₹499/month",
    badge: "Most Popular",
    benefits: [
    "Instant Account Aggregator automated sync",
    "Continuous Sheru AI Guided Advisory",
    "Shared Human Relationship Manager access",
    "Section 80C & 80D Tax Optimization",
    "Interactive Goal & FIRE projections",
    "Life Events Impact Simulator"]

  },
  Elite: {
    name: "Elite",
    price: "₹1,999/month",
    badge: "HNI Wealth",
    benefits: [
    "Dedicated Senior Relationship Manager (Priya Menon)",
    "Digital Will Creation & Succession Inventory",
    "Family Wealth Vault with Emergency Continuity",
    "Succession Readiness & Nomination Audit",
    "Structured Yields & Priority Advisory Desk",
    "Direct Equity & PMS Strategy Access"]

  },
  Enterprise: {
    name: "Enterprise",
    price: "Custom",
    badge: "Family Office",
    benefits: [
    "Multi-Family Office dedicated desk",
    "Private Family Trust structures",
    "Multi-generation estate governance",
    "Cross-border tax structuring"]

  }
};

export function SubscriptionUpgradeModal() {
  const {
    upgradeModalOpen,
    closeUpgradeModal,
    upgradeFeature,
    upgradeRecommendedPlan,
    subscriptionTier,
    setSubscriptionTier
  } = useApp();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const plan = TIER_BENEFITS[upgradeRecommendedPlan] || TIER_BENEFITS.Premium;

  const handleUpgrade = () => {
    setSubscriptionTier(upgradeRecommendedPlan);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      closeUpgradeModal();
    }, 1200);
  };

  const handleViewAllPlans = () => {
    closeUpgradeModal();
    void navigate("/plans");
  };

  return (
    <Dialog open={upgradeModalOpen} onOpenChange={(o) => !o && closeUpgradeModal()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md p-0 overflow-hidden border-gold/30">
        {success ?
        <div className="py-12 px-6 text-center space-y-4">
            <span className="bg-success-soft text-success mx-auto flex size-16 items-center justify-center rounded-2xl animate-in zoom-in-50">
              <CheckCircle2 className="size-8" />
            </span>
            <DialogTitle className="text-2xl font-bold font-display">
              Upgraded to {upgradeRecommendedPlan}!
            </DialogTitle>
            <DialogDescription className="text-sm">
              Your WealthVerse operating system has unlocked {upgradeFeature} and all {upgradeRecommendedPlan} privileges.
            </DialogDescription>
          </div> :

        <div>
            {/* Header with Luxury Navy Gradient */}
            <div className="gradient-navy text-navy-foreground p-6 relative overflow-hidden">
              <span className="bg-gold/15 absolute -top-12 -right-12 size-40 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="bg-white/10 text-gold text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Crown className="size-3.5" /> Membership Upgrade
                  </span>
                  <span className="text-xs text-navy-foreground/75 font-mono">
                    Current: {subscriptionTier}
                  </span>
                </div>
                <DialogTitle className="font-display text-2xl font-bold mt-3 text-white">
                  Unlock {upgradeFeature}
                </DialogTitle>
                <DialogDescription className="text-xs text-navy-foreground/80 mt-1.5 leading-relaxed">
                  This feature is exclusive to {upgradeRecommendedPlan} and higher membership tiers.
                </DialogDescription>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5">
              {/* Plan Card */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-base">
                      {plan.name} Membership
                    </span>
                    <span className="bg-primary/20 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cancel or change tier at any time
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-display text-primary">{plan.price}</p>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2.5">
                  What you unlock with {plan.name}:
                </p>
                <div className="space-y-2">
                  {plan.benefits.map((b) =>
                <div key={b} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground">{b}</span>
                    </div>
                )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-raised gap-2"
                size="lg"
                onClick={handleUpgrade}>
                
                  <Zap className="size-4" />
                  Upgrade to {plan.name} Now
                </Button>
                <div className="flex gap-2">
                  <Button
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={handleViewAllPlans}>
                  
                    Compare All Plans <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                  <Button
                  variant="ghost"
                  className="flex-1 text-xs text-muted-foreground"
                  onClick={closeUpgradeModal}>
                  
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      </DialogContent>
    </Dialog>);

}