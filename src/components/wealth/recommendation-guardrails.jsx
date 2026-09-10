import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";









export function RecommendationGuardrails({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 border-t pt-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="text-muted-foreground hover:text-foreground flex w-full items-center gap-1.5 text-left text-xs font-medium">
        
        <Info className="size-3.5" /> Recommendation transparency
        <ChevronDown className={cn("ml-auto size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open &&
      <div className="bg-background mt-3 space-y-3 rounded-lg border p-3 text-xs">
          <div><p className="font-semibold">Why we&apos;re suggesting this</p><p className="text-muted-foreground mt-1">{data.why}</p></div>
          <div><p className="font-semibold">What we considered</p><ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-4">{data.considered.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><p className="font-semibold">What this does not consider</p><ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-4">{data.missing.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground"><span>Confidence: <strong className="text-foreground">{data.confidence}</strong></span><span>Data: {data.freshness}</span></div>
        </div>
      }
    </div>);

}

export function guardrailsFor(actionId, why, confidence) {
  const common = ["Information entered in Wealth360", "Current recorded cashflow and goals"];
  const byCategory = {
    emergency: ["Future income changes", "Unreported assets or liabilities", "Upcoming large expenses"],
    nominations: ["Family members and recorded nominations", "Current continuity checklist"],
    goals: ["Goal targets and contributions", "Illustrative return and inflation assumptions"],
    debt: ["Recorded EMI and income", "Current entered interest rate"],
    concentration: ["Recorded portfolio allocation", "Selected risk profile"],
    "life-cover": ["Income, dependents and recorded cover", "Recorded liabilities"]
  };
  return {
    why,
    considered: [...common, ...(byCategory[actionId] ?? ["Current recorded financial information"])],
    missing: byCategory[actionId] ?? ["Future changes in income or family circumstances", "Information not entered in Wealth360", "Personal tax and legal circumstances", "Market conditions"],
    confidence,
    freshness: "Based on your current demo information"
  };
}