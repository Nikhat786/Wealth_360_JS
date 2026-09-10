import { useState } from "react";

import { compareCategories } from "@/lib/wealth360";
import { cn } from "@/lib/utils";

export function CompareTable({ initial = "mf" }) {
  const [active, setActive] = useState(initial);
  const cat = compareCategories.find((c) => c.id === active) ?? compareCategories[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {compareCategories.map((c) =>
        <button
          key={c.id}
          type="button"
          onClick={() => setActive(c.id)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            c.id === cat.id ?
            "bg-primary text-primary-foreground border-transparent" :
            "hover:bg-muted"
          )}>
          
            {c.label}
          </button>
        )}
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left text-xs">
              <th className="p-3 font-medium">Option</th>
              <th className="p-3 font-medium">Return / benefit</th>
              <th className="p-3 font-medium">Risk</th>
              <th className="p-3 font-medium">Liquidity</th>
              <th className="p-3 font-medium">Tenure</th>
              <th className="p-3 font-medium">Cost</th>
              <th className="p-3 font-medium">Suitability</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cat.options.map((o) =>
            <tr key={o.id} className="align-top">
                <td className="p-3">
                  <p className="font-medium">{o.name}</p>
                  <p className="text-muted-foreground text-xs">{o.provider}</p>
                </td>
                <td className="num p-3 text-xs">{o.benefit}</td>
                <td className="p-3 text-xs">{o.risk}</td>
                <td className="p-3 text-xs">{o.liquidity}</td>
                <td className="p-3 text-xs">{o.tenure}</td>
                <td className="num p-3 text-xs">{o.cost}</td>
                <td className="text-muted-foreground p-3 text-xs">{o.suitability}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground text-xs italic">
        Mock providers and illustrative figures for demonstration. {cat.assumption} No option here is
        universally best — suitability depends on your horizon, taxes and comfort with risk.
      </p>
    </div>);

}