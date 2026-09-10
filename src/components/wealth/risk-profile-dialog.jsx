import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle } from
"@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const REACTIONS = [
{ value: "sell", label: "Sell" },
{ value: "hold", label: "Wait" },
{ value: "buy", label: "Invest more" }];


export function RiskProfileDialog({ open, onOpenChange, initialProfile, onSubmit }) {
  const [form, setForm] = useState(initialProfile);

  useEffect(() => {
    if (open) setForm(initialProfile);
  }, [open, initialProfile]);

  const submit = () => {
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Your risk profile</DialogTitle>
        <DialogDescription>
          A few quick questions to understand your investment personality. Not a recommendation or a score.
        </DialogDescription>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>My ₹10L portfolio falls to ₹8L. What would you do?</Label>
            <div className="flex flex-wrap gap-2">
              {REACTIONS.map((r) => {
                const active = form.reactionToDrop === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, reactionToDrop: r.value })}
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted"
                    )}>

                    {active && <Check className="mr-1 inline size-3" />}{r.label}
                  </button>);

              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Investment horizon — {form.horizon} years</Label>
            <Slider value={[form.horizon]} min={1} max={30} step={1} onValueChange={(v) => setForm({ ...form, horizon: v[0] ?? 10 })} />
          </div>

          <div className="space-y-2">
            <Label>Risk comfort — {form.riskAppetite} / 10</Label>
            <Slider value={[form.riskAppetite]} min={1} max={10} step={1} onValueChange={(v) => setForm({ ...form, riskAppetite: v[0] ?? 5 })} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Liquidity preference</Label>
              <div className="flex flex-wrap gap-2">
                {["High", "Medium", "Low"].map((p) => {
                  const active = form.liquidityPreference === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, liquidityPreference: p })}
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                        active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted"
                      )}>

                      {active && <Check className="mr-1 inline size-3" />}{p}
                    </button>);

                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Monthly investment capacity — {formatINR(form.monthlyInvestment)}</Label>
              <Input
                type="number"
                className="num"
                value={form.monthlyInvestment}
                onChange={(e) => setForm({ ...form, monthlyInvestment: Number(e.target.value) || 0 })} />

            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save risk profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

}
