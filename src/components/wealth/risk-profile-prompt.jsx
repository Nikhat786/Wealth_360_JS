import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RiskProfileDialog } from "@/components/wealth/risk-profile-dialog";
import { useApp } from "@/context/app-context";

const REACTIONS = [
{ value: "sell", label: "Sell" },
{ value: "hold", label: "Wait" },
{ value: "buy", label: "Invest more" }];


export function RiskProfilePrompt() {
  const { answers, updateRiskProfile, dismissRiskPrompt } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (answers.riskProfileCompleted) return null;

  return (
    <div className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">Quick one · Risk profile</p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">
          If your ₹10L portfolio fell to ₹8L, what would you do?
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {REACTIONS.map((r) =>
        <Button
          key={r.value}
          size="sm"
          variant="outline"
          onClick={() => updateRiskProfile({ reactionToDrop: r.value })}>

            {r.label}
          </Button>
        )}
        <Button size="sm" variant="ghost" className="text-xs" onClick={() => setDialogOpen(true)}>
          Add more detail
        </Button>
        <button
          type="button"
          aria-label="Skip for now"
          onClick={dismissRiskPrompt}
          className="text-muted-foreground hover:text-foreground">

          <X className="size-4" />
        </button>
      </div>

      <RiskProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialProfile={{
          reactionToDrop: answers.reactionToDrop,
          horizon: answers.horizon,
          riskAppetite: answers.riskAppetite,
          liquidityPreference: answers.liquidityPreference,
          monthlyInvestment: answers.monthlyInvestment
        }}
        onSubmit={updateRiskProfile} />

    </div>);

}
