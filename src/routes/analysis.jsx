
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "@/components/wealth/app-shell";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";


const checks = [
"Mapping assets",
"Understanding cashflow",
"Analysing liabilities",
"Checking portfolio risk",
"Evaluating goals",
"Assessing protection",
"Calculating inflation impact",
"Checking wealth continuity",
"Finding opportunities"];


export default function Analysis() {
  const [done, setDone] = useState(0);
  const navigate = useNavigate();
  const { markAnalysisSeen } = useApp();

  useEffect(() => {
    if (done >= checks.length) {
      markAnalysisSeen();
      const t = setTimeout(() => void navigate("/wealth360/dashboard"), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), done === 0 ? 500 : 320);
    return () => clearTimeout(t);
  }, [done, markAnalysisSeen, navigate]);

  const pct = Math.round(done / checks.length * 100);

  return (
    <AppShell minimal>
      <div className="mx-auto max-w-xl py-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            {done >= checks.length ? "Your Wealth360 is ready." : "Building your Wealth360…"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {done >= checks.length ?
            "Connecting your financial picture..." :
            "Reading every part of your financial life, one layer at a time."}
          </p>
        </div>

        <div className="bg-muted mt-8 h-1.5 overflow-hidden rounded-full">
          <div
            className="gradient-gold h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }} />
          
        </div>
        <p className="text-muted-foreground num mt-2 text-center text-xs">{pct}% complete</p>

        <ul className="surface-card mt-6 divide-y">
          {checks.map((c, i) => {
            const complete = i < done;
            const active = i === done;
            return (
              <li key={c} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full",
                    complete ?
                    "bg-success-soft text-success" :
                    active ?
                    "bg-gold-soft text-gold-foreground" :
                    "bg-muted text-muted-foreground"
                  )}>
                  
                  {complete ?
                  <Check className="size-3.5" /> :
                  active ?
                  <Loader2 className="size-3.5 animate-spin" /> :

                  <span className="bg-current size-1.5 rounded-full opacity-40" />
                  }
                </span>
                <span
                  className={cn(
                    "text-sm",
                    complete ? "font-medium" : active ? "font-medium" : "text-muted-foreground"
                  )}>
                  
                  {c}
                </span>
              </li>);

          })}
        </ul>
      </div>
    </AppShell>);

}