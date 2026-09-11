import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { derivedExpenses, derivedIncome, useApp } from "@/context/app-context";
import { formatINRShort } from "@/lib/format";


const sections = ["ABOUT YOU", "FAMILY", "CASHFLOW", "INVESTMENTS", "LIABILITIES", "PROTECTION", "GOALS", "RISK"];

export default function Wealth360Review() {
  const { answers, completeOnboarding, totalAssets, totalLiabilities } = useApp();
  const navigate = useNavigate();
  const monthlyIncome = derivedIncome(answers);
  const monthlyExpenses = derivedExpenses(answers);
  const monthlySurplus = monthlyIncome - monthlyExpenses;

  const build = () => {
    completeOnboarding(answers);
    void navigate("/wealth360/analysis");
  };

  return (
    <AppShell minimal>
      <div className="mx-auto max-w-3xl space-y-6 py-6 sm:py-12">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Final review</p>
          <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Your Wealth360 is almost ready.</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">Take one last look at the areas we've understood. You can edit any section before we connect the pieces.</p>
        </div>
        <div className="surface-card grid gap-3 p-5 sm:grid-cols-2">
          {sections.map((section) => <Link key={section} to="/wealth360/journey" className="bg-success-soft text-success flex items-center justify-between rounded-lg px-4 py-3 text-xs font-semibold"><span className="flex items-center gap-2"><Check className="size-4" /> {section}</span><span className="text-success/70">Edit</span></Link>)}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Summary label="About you" value={`${answers?.name ?? "Rahul"}, ${answers?.age ?? 34} · ${answers?.maritalStatus ?? "Married"}`} detail={`${answers?.dependents ?? 2} dependents`} />
          <Summary label="Cashflow" value={`${formatINRShort(monthlyIncome)} monthly income`} detail={`${formatINRShort(monthlySurplus)} monthly surplus`} />
          <Summary label="Investments" value={`${formatINRShort(totalAssets)} total assets`} detail={`${answers?.assets?.length || 6} demo holdings`} />
          <Summary label="Liabilities" value={`${formatINRShort(totalLiabilities)} outstanding`} detail={`${answers?.liabilities?.length || 3} demo liabilities`} />
          <Summary label="Protection" value={`${formatINRShort(answers?.lifeCover ?? 0)} life cover`} detail={`${formatINRShort(answers?.healthCover ?? 0)} health cover`} />
          <Summary label="Goals" value={`${answers?.goals?.length || 3} active goals`} detail="Retirement, education and emergency fund" />
          <Summary label="Risk" value="Moderate" detail={`${answers?.horizon ?? 15}-year investment horizon`} />
        </div>
        <div className="surface-card flex items-start gap-3 p-5"><Lock className="text-muted-foreground mt-0.5 size-4 shrink-0" /><div><p className="text-sm font-semibold">You're in control of your information.</p><p className="text-muted-foreground mt-2 text-xs leading-relaxed">This information was provided by you and is used to personalise Wealth360. You can edit it later. No transaction happens automatically, and recommendations are subject to market risk. A production version can connect Account Aggregator with consent.</p></div></div>
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold">Ready to see your Wealth360?</p><p className="text-muted-foreground mt-1 text-xs">We&apos;ll connect your financial picture next.</p></div><div className="flex gap-2"><Button asChild variant="outline"><Link to="/wealth360/journey">Edit information</Link></Button><Button size="lg" onClick={build}>Build my Wealth360 <ArrowRight className="size-4" /></Button></div></div>
      </div>
    </AppShell>);

}

function Summary({ label, value, detail }) {
  return <div className="surface-card p-4"><p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">{label}</p><p className="mt-2 text-sm font-semibold">{value}</p><p className="text-muted-foreground mt-1 text-xs">{detail}</p></div>;
}