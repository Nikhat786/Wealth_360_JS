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
import { Textarea } from "@/components/ui/textarea";
import { goalIcons } from "@/components/wealth/goal-card";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
{ value: "retirement", label: "Retirement" },
{ value: "education", label: "Education" },
{ value: "home", label: "Home" },
{ value: "travel", label: "Travel" },
{ value: "shield", label: "Emergency" },
{ value: "car", label: "Vehicle" }];


const emptyGoal = {
  name: "",
  icon: "retirement",
  target: 0,
  saved: 0,
  monthlyContribution: 0,
  targetYear: new Date().getFullYear() + 10,
  expectedReturn: 10,
  priority: "Medium",
  note: ""
};

export function GoalFormDialog({ open, onOpenChange, initialGoal, onSubmit }) {
  const [form, setForm] = useState(initialGoal ?? emptyGoal);

  useEffect(() => {
    if (open) setForm(initialGoal ?? emptyGoal);
  }, [open, initialGoal]);

  const isEditing = Boolean(initialGoal);
  const canSubmit = form.name?.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      ...form,
      target: form.target ?? 0,
      saved: form.saved ?? 0,
      monthlyContribution: form.monthlyContribution ?? 0,
      targetYear: form.targetYear ?? new Date().getFullYear() + 10,
      expectedReturn: form.expectedReturn ?? 10
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>{isEditing ? "Edit goal" : "Add a new goal"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update the details of this milestone." : "Add a milestone to track alongside your other goals."}
        </DialogDescription>

        <div className="space-y-4 py-2">
          <GField label="Goal name">
            <Input
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Europe trip with family" />

          </GField>

          <GField label="Icon">
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => {
                const Icon = goalIcons[opt.value];
                const active = (form.icon ?? "retirement") === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, icon: opt.value })}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted"
                    )}>

                    {active && <Check className="size-3.5" />}
                    <Icon className="size-3.5" /> {opt.label}
                  </button>);

              })}
            </div>
          </GField>

          <div className="grid gap-4 sm:grid-cols-2">
            <GNumberField label="Target amount" value={form.target ?? 0} onChange={(v) => setForm({ ...form, target: v })} />
            <GNumberField label="Saved so far" value={form.saved ?? 0} onChange={(v) => setForm({ ...form, saved: v })} />
            <GNumberField label="Monthly contribution" value={form.monthlyContribution ?? 0} onChange={(v) => setForm({ ...form, monthlyContribution: v })} />
            <GNumberField label="Target year" value={form.targetYear ?? new Date().getFullYear() + 10} onChange={(v) => setForm({ ...form, targetYear: v })} />
            <GNumberField label="Expected return %" value={form.expectedReturn ?? 10} onChange={(v) => setForm({ ...form, expectedReturn: v })} />
          </div>

          <GField label="Priority">
            <div className="flex flex-wrap gap-2">
              {["High", "Medium", "Low"].map((p) => {
                const active = (form.priority ?? "Medium") === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, priority: p })}
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted"
                    )}>

                    {active && <Check className="mr-1 inline size-3" />}{p}
                  </button>);

              })}
            </div>
          </GField>

          <GField label="Note (optional)">
            <Textarea
              value={form.note ?? ""}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="What is this goal funding, and from where?"
              rows={2} />

          </GField>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!canSubmit}>{isEditing ? "Save changes" : "Add goal"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

}

function GField({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>);

}

function GNumberField({ label, value, onChange }) {
  return (
    <GField label={label}>
      <Input type="number" className="num" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </GField>);

}
