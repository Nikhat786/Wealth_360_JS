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
import { CUSTOM_EVENT_TYPES } from "@/lib/life-events";
import { cn } from "@/lib/utils";

const emptyEvent = {
  event: "Retirement",
  year: new Date().getFullYear() + 5,
  estimatedCost: 0,
  importance: "Medium"
};

export function FutureEventFormDialog({ open, onOpenChange, initialEvent, onSubmit }) {
  const [form, setForm] = useState(initialEvent ?? emptyEvent);

  useEffect(() => {
    if (open) setForm(initialEvent ?? emptyEvent);
  }, [open, initialEvent]);

  const isEditing = Boolean(initialEvent);

  const submit = () => {
    if (!form.event) return;
    onSubmit({
      ...form,
      year: form.year ?? new Date().getFullYear() + 5,
      estimatedCost: form.estimatedCost ?? 0,
      importance: form.importance ?? "Medium"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>{isEditing ? "Edit future event" : "Add a future event"}</DialogTitle>
        <DialogDescription>
          Optional — capture a milestone you're planning for, so it's on record for later.
        </DialogDescription>

        <div className="space-y-4 py-2">
          <EField label="Life event">
            <div className="flex flex-wrap gap-2">
              {CUSTOM_EVENT_TYPES.map((type) => {
                const active = (form.event ?? "Retirement") === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, event: type })}
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted"
                    )}>

                    {active && <Check className="mr-1 inline size-3" />}{type}
                  </button>);

              })}
            </div>
          </EField>

          <div className="grid gap-4 sm:grid-cols-2">
            <ENumberField label="Expected year" value={form.year ?? new Date().getFullYear() + 5} onChange={(v) => setForm({ ...form, year: v })} />
            <ENumberField label="Estimated cost" value={form.estimatedCost ?? 0} onChange={(v) => setForm({ ...form, estimatedCost: v })} />
          </div>

          <EField label="Importance">
            <div className="flex flex-wrap gap-2">
              {["High", "Medium", "Low"].map((p) => {
                const active = (form.importance ?? "Medium") === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, importance: p })}
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted"
                    )}>

                    {active && <Check className="mr-1 inline size-3" />}{p}
                  </button>);

              })}
            </div>
          </EField>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{isEditing ? "Save changes" : "Add event"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

}

function EField({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>);

}

function ENumberField({ label, value, onChange }) {
  return (
    <EField label={label}>
      <Input type="number" className="num" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </EField>);

}
