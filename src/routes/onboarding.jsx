import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  HeartHandshake,
  Loader2,
  Lock,
  Plus,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle } from
"@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AppShell } from "@/components/wealth/app-shell";
import {
  defaultAnswers,
  derivedExpenses,
  derivedIncome,
  useApp } from






"@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";
import { lifeStage } from "@/lib/wealth360";
import { cn } from "@/lib/utils";


const chapters = ["About You", "Family", "Cashflow", "What You Own", "What You Owe", "Goals", "Protect", "Risk", "Future"];
const assetTypes = ["Cash & Savings", "FD/RD", "Stocks", "Mutual Funds", "ETFs", "Bonds", "Gold/SGB", "Real Estate", "EPF/PPF/NPS", "Pension", "Other Assets"];
const goalTypes = ["Child Education", "Retirement", "Home", "Emergency Fund", "Travel", "Marriage", "Financial Independence", "Business", "Career Break", "Wealth Creation", "Parents", "Custom"];
const eventTypes = ["Baby", "Marriage", "Home Purchase", "Job Change", "Career Break", "Education", "Travel", "Business", "Relocation", "Retirement", "Custom"];

export default function Onboarding() {
  const {
    answers,
    saveOnboardingDraft,
    setRmOpen,
    startOnboarding,
    canAccessRM,
    subscriptionTier,
    triggerUpgradeModal,
    synthesizeAAProfile,
    connectAccountAggregator
  } = useApp();
  const [draft, setDraft] = useState(answers ?? defaultAnswers);
  const [chapter, setChapter] = useState(0);
  const [aaState, setAaState] = useState("none");
  const [simIndex, setSimIndex] = useState(0);
  const [aaSuccessNotice, setAaSuccessNotice] = useState(false);
  const [panFetched, setPanFetched] = useState(false);
  const [panInput, setPanInput] = useState(draft.pan || "ABCDE1234F");

  const navigate = useNavigate();
  const set = (key, value) =>
  setDraft((current) => ({ ...current, [key]: value }));
  const finish = () => {
    saveOnboardingDraft(draft);
    void navigate("/wealth360/review");
  };

  useEffect(() => {
    startOnboarding();
  }, [startOnboarding]);

  // Simulation timer
  useEffect(() => {
    if (aaState === "simulating") {
      const timer = setInterval(() => {
        setSimIndex((prev) => {
          if (prev >= 7) {
            clearInterval(timer);
            // Synthesize realistic data using PAN
            const synthetic = synthesizeAAProfile({ ...draft, pan: panInput });
            setDraft(synthetic);
            connectAccountAggregator(synthetic);
            setTimeout(() => {
              setAaState("success");
              setPanFetched(true);
              setTimeout(() => {
                setAaState("none");
              }, 1800);
            }, 600);
            return 8;
          }
          return prev + 1;
        });
      }, 450);
      return () => clearInterval(timer);
    }
  }, [aaState, draft, panInput, synthesizeAAProfile, connectAccountAggregator]);

  const handleStartPanFetch = () => {
    if (panInput.length !== 10) return;
    setSimIndex(0);
    setAaState("simulating");
  };

  const handleConsentApproved = () => {
    setSimIndex(0);
    setAaState("simulating");
  };



  const progress = (chapter + 1) / chapters.length * 100;

  const AA_SIM_STEPS = [
  "Fetching Investments",
  "Identifying Assets",
  "Mapping Liabilities",
  "Reviewing Protection",
  "Estimating Tax Position",
  "Building Wealth Graph",
  "Generating Wealth Intelligence",
  "Calculating Wealth Scores"];


  const AA_SOURCES = [
  "Bank Accounts (HDFC, ICICI, SBI)",
  "Demat Accounts (CDSL & NSDL)",
  "Mutual Funds (CAMS & KFintech)",
  "Exchange Traded Funds (ETFs)",
  "Fixed & Recurring Deposits",
  "Employee Provident Fund (EPFO UAN)",
  "National Pension System (NPS)",
  "Insurance Policies (Life & Health)",
  "Home Loans & Mortgages",
  "Personal & Auto Loans"];


  return (
    <AppShell minimal>
      <div className="mx-auto max-w-4xl space-y-6 py-2 sm:py-6">
        <JourneyProgress chapter={chapter} progress={progress} />

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {chapters[chapter]}
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-4xl">{titleFor(chapter)}</h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            {descriptionFor(chapter)}
          </p>
        </div>

        <div className="surface-card animate-in fade-in slide-in-from-bottom-2 space-y-6 p-5 duration-300 sm:p-7">
          {chapter === 0 && <PanEntryStep panInput={panInput} setPanInput={setPanInput} onFetch={handleStartPanFetch} panFetched={panFetched} draft={draft} onContinue={() => setChapter(1)} />}
          {chapter === 1 && <FamilyStep draft={draft} set={set} />}
          {chapter === 2 && <CashflowStep draft={draft} set={set} />}
          {chapter === 3 && <AssetsStep draft={draft} set={set} />}
          {chapter === 4 && <LiabilitiesStep draft={draft} set={set} />}
          {chapter === 5 && <GoalsStep draft={draft} set={set} />}
          {chapter === 6 && <ProtectionStep draft={draft} set={set} />}
          {chapter === 7 && <RiskStep draft={draft} set={set} />}
          {chapter === 8 && <FutureStep draft={draft} set={set} />}
        </div>

        {chapter > 0 && (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setChapter((current) => Math.max(0, current - 1))}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            {chapter === chapters.length - 1 ?
              <Button size="lg" onClick={finish}>
                Review my information <ArrowRight className="size-4" />
              </Button> :
              <Button onClick={() => setChapter((current) => current + 1)}>
                Save & continue <ArrowRight className="size-4" />
              </Button>
            }
          </div>
        )}

        {/* Simulation & Synthesis Dialog */}
        <Dialog open={aaState === "simulating" || aaState === "success"} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            {aaState === "success" ?
              <div className="py-6 text-center space-y-3 animate-in zoom-in-50">
                <span className="bg-success-soft text-success mx-auto flex size-14 items-center justify-center rounded-2xl">
                  <CheckCircle2 className="size-7" />
                </span>
                <DialogTitle className="font-display text-xl font-bold">
                  Financial Universe Constructed!
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Income, Expenses, Assets, Loans, Goals, and Protection have been synthesized.
                </DialogDescription>
              </div> :
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="size-6 text-primary animate-spin" />
                  <div>
                    <DialogTitle className="font-display text-lg">
                      Building Your WealthVerse...
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Synchronizing RBI-regulated financial information
                    </DialogDescription>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {AA_SIM_STEPS.map((stepName, idx) => {
                    const isDone = idx < simIndex;
                    const isCurrent = idx === simIndex;
                    return (
                      <div
                        key={stepName}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                          isDone ? "bg-success-soft text-success" :
                          isCurrent ? "bg-primary/10 text-primary border border-primary/20" :
                          "text-muted-foreground/60"
                        )}>
                        {isDone ?
                          <Check className="size-4 shrink-0" /> :
                          isCurrent ?
                          <Loader2 className="size-3.5 shrink-0 animate-spin" /> :
                          <span className="size-3.5 rounded-full border border-muted-foreground/30 inline-block shrink-0" />
                        }
                        <span>{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );

}

function PanEntryStep({ panInput, setPanInput, onFetch, panFetched, draft, onContinue }) {
  if (panFetched) {
    // Show fetched summary
    const summaryItems = [
      { icon: User, label: "Identity", value: `${draft.name}, ${draft.age} yrs`, color: "text-blue-500" },
      { icon: Wallet, label: "Income", value: `${formatINRShort(draft.annualIncome)}/yr`, color: "text-emerald-500" },
      { icon: Briefcase, label: "Assets", value: `${draft.assets?.length || 0} holdings mapped`, color: "text-amber-500" },
      { icon: CreditCard, label: "Liabilities", value: `${draft.liabilities?.length || 0} loans found`, color: "text-rose-500" },
      { icon: Shield, label: "Protection", value: `${draft.insurancePolicies?.length || 0} policies`, color: "text-violet-500" },
      { icon: Target, label: "Goals", value: `${draft.goals?.length || 0} goals identified`, color: "text-cyan-500" },
    ];
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success-soft p-4 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="size-5 text-success shrink-0" />
          <div>
            <p className="text-sm font-bold text-success">Financial Universe Fetched Successfully</p>
            <p className="text-xs text-success/80 mt-0.5">PAN {panInput} · All financial data has been auto-populated</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-muted/50 p-4 animate-in fade-in slide-in-from-bottom-2">
              <span className={cn("flex size-10 items-center justify-center rounded-xl bg-background shadow-sm", item.color)}>
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary/60 flex items-start gap-3 rounded-xl p-4">
          <Lock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            Data fetched via RBI-regulated Account Aggregator framework. You can review and edit any details in the following steps. No transactions are executed.
          </p>
        </div>

        <Button size="lg" className="w-full" onClick={onContinue}>
          Continue my journey <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  // PAN entry view
  return (
    <div className="flex flex-col items-center text-center space-y-8 py-4">
      <div className="space-y-3">
        <span className="bg-gold-soft text-gold-foreground inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold">
          <Sparkles className="size-3.5" /> Instant Setup
        </span>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Enter your PAN to begin
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          We&apos;ll automatically fetch your financial details — investments, loans, insurance, and more — in under 60 seconds.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
          <Input
            value={panInput}
            onChange={(e) => setPanInput(e.target.value.toUpperCase())}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="h-14 text-center text-xl font-mono font-bold tracking-[0.3em] uppercase border-2 border-primary/30 focus:border-primary rounded-xl bg-background shadow-sm"
          />
          {panInput.length === 10 && (
            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-success animate-in zoom-in" />
          )}
        </div>

        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold shadow-raised gap-2"
          disabled={panInput.length !== 10}
          onClick={onFetch}
        >
          <Sparkles className="size-4" />
          Start My Journey
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-success" /> RBI Regulated
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-primary" /> 256-bit Encrypted
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-amber-500" /> No Transactions
        </span>
      </div>
    </div>
  );
}

function JourneyProgress({ chapter, progress }) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground num text-xs font-semibold tracking-wide uppercase">
            Your wealth journey
          </p>
          <p className="font-display mt-1 text-sm font-semibold">
            {String(chapter + 1).padStart(2, "0")} {chapters[chapter]}
          </p>
        </div>
        <span className="text-muted-foreground num text-xs">
          Step {chapter + 1} of {chapters.length}
        </span>
      </div>
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <div
          className="gradient-gold h-full transition-all duration-500"
          style={{ width: `${progress}%` }} />
        
      </div>
      <div className="hidden gap-1 overflow-x-auto pb-1 md:flex">
        {chapters.map((item, index) =>
        <span
          key={item}
          className={cn(
            "shrink-0 text-[10px] font-medium",
            index <= chapter ? "text-foreground" : "text-muted-foreground"
          )}>
          
            {String(index + 1).padStart(2, "0")} {item}
          </span>
        )}
      </div>
    </div>);

}

function titleFor(chapter) {
  return [
  "First, tell us a little about you.",
  "Who are you building your wealth for?",
  "Where does your money come from and where does it go?",
  "Let's map what you've already built.",
  "Every wealth journey has two sides.",
  "Your wealth should have a purpose.",
  "What could protect your family?",
  "How does your money behave under pressure?",
  "Life doesn't always follow the plan.",
  "We've got your story."][
  chapter];
}
function descriptionFor(chapter) {
  return [
  "Your life stage helps us personalise the questions and priorities that matter most.",
  "A useful financial plan reflects the people and moments you care about.",
  "We'll show the flow of money, not a score. The analysis comes later.",
  "Add investments one at a time so the details remain meaningful.",
  "Understanding debt helps us decide whether your next rupee should go toward investing, saving or repayment.",
  "Choose the milestones that deserve a place in your plan. You can refine them later.",
  "We'll compare what you already have against what your family may need.",
  "A simple scenario helps us understand your investment personality.",
  "Capture changes that may shape your future plan.",
  "Check the chapters you've shared before we build your WealthVerse."][
  chapter];
}

/* Old AboutStep removed — replaced by PanEntryStep above */

function FamilyStep({ draft, set }) {const [member, setMember] = useState({ name: "", relation: "Child", age: 0, dependency: "Full", needs: "" });const add = () => {if (!member.name.trim()) return;set("familyMembers", [...draft.familyMembers, { ...member, id: `family-${Date.now()}` }]);setMember({ name: "", relation: "Child", age: 0, dependency: "Full", needs: "" });};return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2">{draft.familyMembers.map((person) => <RecordCard key={person.id} title={person.name} subtitle={`${person.relation} · ${person.age} years · ${person.dependency} dependency`} onRemove={() => set("familyMembers", draft.familyMembers.filter((item) => item.id !== person.id))}><p className="text-muted-foreground text-xs">{person.needs || "No specific need added yet"}</p></RecordCard>)}</div><div className="grid gap-3 rounded-xl border border-dashed p-4 sm:grid-cols-2"><Field label="Name"><Input value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} placeholder="Add family member" /></Field><Field label="Relationship"><Select value={member.relation} options={["Spouse", "Child", "Parent", "Other"]} onChange={(v) => setMember({ ...member, relation: v })} /></Field><NumberField label="Age" value={member.age} onChange={(v) => setMember({ ...member, age: v })} /><Field label="Financial dependency"><Select value={member.dependency} options={["Full", "Partial", "None"]} onChange={(v) => setMember({ ...member, dependency: v })} /></Field><Field label="Important financial needs"><Input value={member.needs} onChange={(e) => setMember({ ...member, needs: e.target.value })} placeholder="Education, care, home..." /></Field><Button type="button" variant="secondary" className="self-end" onClick={add}><Plus className="size-4" /> Add family member</Button></div></div>;}

function CashflowStep({ draft, set }) {const income = derivedIncome(draft);const expenses = derivedExpenses(draft);const surplus = income - expenses;const incomeFields = [["Salary", "salary"], ["Business", "businessIncome"], ["Rental", "rentalIncome"], ["Dividend", "dividendsIncome"], ["Interest", "interestIncome"], ["Other", "otherIncome"]];const expenseFields = [["Household", "household"], ["Education", "schoolFees"], ["EMI", "emiExpenses"], ["Insurance", "insuranceExpenses"], ["Healthcare", "healthcareExpenses"], ["Lifestyle", "lifestyle"], ["Travel", "travelExpenses"], ["Other", "otherExpenses"]];return <div className="space-y-6"><MoneyGroup title="Income sources" fields={incomeFields} draft={draft} set={set} /><MoneyGroup title="Monthly expenses" fields={expenseFields} draft={draft} set={set} /><div className="bg-secondary grid gap-4 rounded-xl p-4 sm:grid-cols-3"><FlowMetric label="Monthly income" value={income} /><FlowMetric label="Monthly expenses" value={expenses} /><FlowMetric label="Future surplus" value={surplus} tone={surplus >= 0 ? "success" : "destructive"} /><p className="text-muted-foreground text-xs sm:col-span-3">INCOME <ArrowRight className="mx-1 inline size-3" /> EXPENSES <ArrowRight className="mx-1 inline size-3" /> AVAILABLE FOR YOUR FUTURE</p></div></div>;}

function AssetsStep({ draft, set }) {const [selected, setSelected] = useState("Stocks");const [form, setForm] = useState({ type: "Stocks", risk: "Moderate", liquidity: "Medium", ownership: "Self", startDate: "" });const add = () => {if (!form.name?.trim()) return;const record = { id: `asset-${Date.now()}`, name: form.name, type: selected, investedValue: form.investedValue ?? 0, currentValue: form.currentValue ?? 0, startDate: form.startDate ?? "", holdingPeriod: form.holdingPeriod ?? 0, actualReturn: form.actualReturn ?? 0, expectedReturn: form.expectedReturn ?? 10, risk: form.risk ?? "Moderate", liquidity: form.liquidity ?? "Medium", taxTreatment: form.taxTreatment ?? "To review", incomeGenerated: form.incomeGenerated ?? 0, linkedGoal: form.linkedGoal ?? "", ownership: form.ownership ?? "Self", details: {} };set("assets", [...draft.assets, record]);setForm({ type: selected, risk: "Moderate", liquidity: "Medium", ownership: "Self", startDate: "" });};return <div className="space-y-6"><div><p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">Choose what you want to add</p><div className="flex flex-wrap gap-2">{assetTypes.map((type) => <button key={type} type="button" onClick={() => {setSelected(type);setForm({ ...form, type });}} className={cn("rounded-full border px-3 py-2 text-xs font-medium transition-colors", selected === type ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted")}>{type}</button>)}</div></div><div className="bg-muted/40 rounded-xl p-4"><p className="font-display text-base font-semibold">Add {selected}</p><p className="text-muted-foreground mt-1 text-xs">Capture the details that make this investment meaningful.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Name"><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={selected === "Stocks" ? "e.g. HDFC Bank" : "Give it a name"} /></Field><NumberField label="Invested value" value={form.investedValue ?? 0} onChange={(v) => setForm({ ...form, investedValue: v })} money /><NumberField label="Current value" value={form.currentValue ?? 0} onChange={(v) => setForm({ ...form, currentValue: v })} money /><Field label="Start date"><Input type="date" value={form.startDate ?? ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field><NumberField label="Holding period (years)" value={form.holdingPeriod ?? 0} onChange={(v) => setForm({ ...form, holdingPeriod: v })} /><NumberField label="Actual return %" value={form.actualReturn ?? 0} onChange={(v) => setForm({ ...form, actualReturn: v })} /><NumberField label="Expected return %" value={form.expectedReturn ?? 10} onChange={(v) => setForm({ ...form, expectedReturn: v })} /><Field label="Risk"><Select value={form.risk ?? "Moderate"} options={["Low", "Moderate", "High"]} onChange={(v) => setForm({ ...form, risk: v })} /></Field><Field label="Liquidity"><Select value={form.liquidity ?? "Medium"} options={["High", "Medium", "Low"]} onChange={(v) => setForm({ ...form, liquidity: v })} /></Field><Field label="Linked goal"><Input value={form.linkedGoal ?? ""} onChange={(e) => setForm({ ...form, linkedGoal: e.target.value })} placeholder="Optional" /></Field><Field label="Ownership"><Input value={form.ownership ?? "Self"} onChange={(e) => setForm({ ...form, ownership: e.target.value })} /></Field><Field label="Tax treatment"><Input value={form.taxTreatment ?? ""} onChange={(e) => setForm({ ...form, taxTreatment: e.target.value })} placeholder="ELSS, equity LTCG..." /></Field></div><Button type="button" className="mt-4" onClick={add}><Plus className="size-4" /> Add investment</Button></div><div className="grid gap-3 sm:grid-cols-2">{draft.assets.map((asset) => <RecordCard key={asset.id} title={asset.name} subtitle={`${asset.type} · ${formatINRShort(asset.currentValue)} current`} onRemove={() => set("assets", draft.assets.filter((item) => item.id !== asset.id))}><p className="text-muted-foreground text-xs">Invested {formatINRShort(asset.investedValue)} · {asset.actualReturn}% actual return · {asset.risk} risk</p></RecordCard>)}</div></div>;}

function LiabilitiesStep({ draft, set }) {const [form, setForm] = useState({ type: "Home Loan", rateType: "Floating", startDate: "", endDate: "" });const add = () => {if (!form.provider?.trim()) return;const record = { id: `liability-${Date.now()}`, provider: form.provider, type: form.type ?? "Other", originalAmount: form.originalAmount ?? 0, outstandingAmount: form.outstandingAmount ?? 0, interestRate: form.interestRate ?? 0, emi: form.emi ?? 0, startDate: form.startDate ?? "", originalTenure: form.originalTenure ?? 0, remainingTenure: form.remainingTenure ?? 0, endDate: form.endDate ?? "", rateType: form.rateType ?? "Floating", prepaymentOption: form.prepaymentOption ?? false, prepaymentPenalty: form.prepaymentPenalty ?? 0 };set("liabilities", [...draft.liabilities, record]);setForm({ type: "Home Loan", rateType: "Floating", startDate: "", endDate: "" });};return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Provider"><Input value={form.provider ?? ""} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="Bank or lender" /></Field><Field label="Debt type"><Select value={form.type ?? "Home Loan"} options={["Home Loan", "Personal Loan", "Vehicle Loan", "Credit Card", "Education Loan", "Other"]} onChange={(v) => setForm({ ...form, type: v })} /></Field><NumberField label="Original amount" value={form.originalAmount ?? 0} onChange={(v) => setForm({ ...form, originalAmount: v })} money /><NumberField label="Outstanding amount" value={form.outstandingAmount ?? 0} onChange={(v) => setForm({ ...form, outstandingAmount: v })} money /><NumberField label="Interest rate %" value={form.interestRate ?? 0} onChange={(v) => setForm({ ...form, interestRate: v })} /><NumberField label="Monthly EMI" value={form.emi ?? 0} onChange={(v) => setForm({ ...form, emi: v })} money /><NumberField label="Original tenure (years)" value={form.originalTenure ?? 0} onChange={(v) => setForm({ ...form, originalTenure: v })} /><NumberField label="Remaining tenure (years)" value={form.remainingTenure ?? 0} onChange={(v) => setForm({ ...form, remainingTenure: v })} /><Field label="Rate type"><Select value={form.rateType ?? "Floating"} options={["Fixed", "Floating"]} onChange={(v) => setForm({ ...form, rateType: v })} /></Field><Field label="End date"><Input type="date" value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field></div><Button type="button" onClick={add}><Plus className="size-4" /> Add liability</Button><div className="grid gap-3 sm:grid-cols-2">{draft.liabilities.map((loan) => <RecordCard key={loan.id} title={loan.provider} subtitle={`${loan.type} · ${formatINRShort(loan.outstandingAmount)} outstanding`} onRemove={() => set("liabilities", draft.liabilities.filter((item) => item.id !== loan.id))}><p className="text-muted-foreground text-xs">{loan.interestRate}% {loan.rateType} · EMI {formatINR(loan.emi)} · {loan.remainingTenure} years left</p></RecordCard>)}</div><p className="bg-gold-soft text-gold-foreground rounded-xl p-4 text-xs">We'll later help you explore &quot;Should I invest more or repay debt?&quot; without giving final advice during onboarding.</p></div>;}

function GoalsStep({ draft, set }) {const [form, setForm] = useState({ priority: "Medium", expectedReturn: 10, inflation: 6 });const add = () => {if (!form.name?.trim()) return;const record = { id: `goal-${Date.now()}`, name: form.name, currentAmount: form.currentAmount ?? 0, targetAmount: form.targetAmount ?? 0, targetYear: form.targetYear ?? new Date().getFullYear() + 10, duration: form.duration ?? 10, monthlyContribution: form.monthlyContribution ?? 0, expectedReturn: form.expectedReturn ?? 10, inflation: form.inflation ?? 6, priority: form.priority ?? "Medium", linkedInvestments: [], fundingSource: form.fundingSource ?? "Monthly contributions" };set("goals", [...draft.goals, record]);set("selectedGoals", [...new Set([...draft.selectedGoals, record.name])]);setForm({ priority: "Medium", expectedReturn: 10, inflation: 6 });};return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Goal type"><Select value={form.name ?? "Retirement"} options={goalTypes} onChange={(v) => setForm({ ...form, name: v })} /></Field><NumberField label="Current amount" value={form.currentAmount ?? 0} onChange={(v) => setForm({ ...form, currentAmount: v })} money /><NumberField label="Target amount" value={form.targetAmount ?? 0} onChange={(v) => setForm({ ...form, targetAmount: v })} money /><NumberField label="Target year" value={form.targetYear ?? new Date().getFullYear() + 10} onChange={(v) => setForm({ ...form, targetYear: v })} /><NumberField label="Monthly contribution" value={form.monthlyContribution ?? 0} onChange={(v) => setForm({ ...form, monthlyContribution: v })} money /><NumberField label="Expected return %" value={form.expectedReturn ?? 10} onChange={(v) => setForm({ ...form, expectedReturn: v })} /><NumberField label="Inflation assumption %" value={form.inflation ?? 6} onChange={(v) => setForm({ ...form, inflation: v })} /><Field label="Priority"><Select value={form.priority ?? "Medium"} options={["High", "Medium", "Low"]} onChange={(v) => setForm({ ...form, priority: v })} /></Field></div><Button type="button" onClick={add}><Plus className="size-4" /> Add goal</Button><div className="grid gap-3 sm:grid-cols-2">{draft.goals.map((goal) => <RecordCard key={goal.id} title={goal.name} subtitle={`${formatINRShort(goal.targetAmount)} target by ${goal.targetYear}`} onRemove={() => set("goals", draft.goals.filter((item) => item.id !== goal.id))}><p className="text-muted-foreground text-xs">{formatINR(goal.monthlyContribution)}/month · {goal.priority} priority · {goal.inflation}% inflation assumption</p></RecordCard>)}</div></div>;}

function ProtectionStep({ draft, set }) {const [form, setForm] = useState({ type: "Life", startDate: "", renewalDate: "" });const add = () => {if (!form.insurer?.trim()) return;const policy = { id: `policy-${Date.now()}`, insurer: form.insurer, type: form.type ?? "Life", sumAssured: form.sumAssured ?? 0, premium: form.premium ?? 0, term: form.term ?? 0, startDate: form.startDate ?? "", renewalDate: form.renewalDate ?? "", nominee: form.nominee ?? "", coveredMembers: form.coveredMembers ?? [] };set("insurancePolicies", [...draft.insurancePolicies, policy]);setForm({ type: "Life", startDate: "", renewalDate: "" });};return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Policy type"><Select value={form.type ?? "Life"} options={["Life", "Health", "Personal Accident"]} onChange={(v) => setForm({ ...form, type: v })} /></Field><Field label="Insurer"><Input value={form.insurer ?? ""} onChange={(e) => setForm({ ...form, insurer: e.target.value })} placeholder="Provider name" /></Field><NumberField label="Sum assured" value={form.sumAssured ?? 0} onChange={(v) => setForm({ ...form, sumAssured: v })} money /><NumberField label="Premium" value={form.premium ?? 0} onChange={(v) => setForm({ ...form, premium: v })} money /><NumberField label="Policy term (years)" value={form.term ?? 0} onChange={(v) => setForm({ ...form, term: v })} /><Field label="Nominee"><Input value={form.nominee ?? ""} onChange={(e) => setForm({ ...form, nominee: e.target.value })} /></Field><Field label="Renewal date"><Input type="date" value={form.renewalDate ?? ""} onChange={(e) => setForm({ ...form, renewalDate: e.target.value })} /></Field></div><Button type="button" onClick={add}><Plus className="size-4" /> Add policy</Button><div className="grid gap-3 sm:grid-cols-2">{draft.insurancePolicies.map((policy) => <RecordCard key={policy.id} title={policy.insurer} subtitle={`${policy.type} · ${formatINRShort(policy.sumAssured)} cover`} onRemove={() => set("insurancePolicies", draft.insurancePolicies.filter((item) => item.id !== policy.id))}><p className="text-muted-foreground text-xs">Premium {formatINR(policy.premium)} · Nominee {policy.nominee || "Not added"}</p></RecordCard>)}</div><div className="bg-secondary grid gap-4 rounded-xl p-4 sm:grid-cols-3"><FlowMetric label="Life cover" value={draft.lifeCover} /><FlowMetric label="Health cover" value={draft.healthCover} /><FlowMetric label="Emergency fund" value={draft.cashSavings} /></div></div>;}

function RiskStep({ draft, set }) {return <div className="space-y-6"><div className="bg-secondary rounded-xl p-5"><p className="font-display text-base font-semibold">My ₹10L portfolio falls to ₹8L. What would you do?</p><div className="mt-4 flex flex-wrap gap-2">{["sell", "hold", "buy"].map((choice) => <Choice key={choice} label={choice === "sell" ? "Sell" : choice === "hold" ? "Wait" : "Invest more"} active={draft.reactionToDrop === choice} onClick={() => set("reactionToDrop", choice)} />)}</div></div><Field label={`Investment horizon — ${draft.horizon} years`}><Slider value={[draft.horizon]} min={1} max={30} step={1} onValueChange={(v) => set("horizon", v[0] ?? 10)} /></Field><Field label={`Risk comfort — ${draft.riskAppetite} / 10`}><Slider value={[draft.riskAppetite]} min={1} max={10} step={1} onValueChange={(v) => set("riskAppetite", v[0] ?? 5)} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Liquidity preference"><Select value={draft.liquidityPreference} options={["High", "Medium", "Low"]} onChange={(v) => set("liquidityPreference", v)} /></Field><NumberField label="Monthly investment capacity" value={draft.monthlyInvestment} onChange={(v) => set("monthlyInvestment", v)} money /></div><p className="text-muted-foreground text-xs">This helps us understand your investment personality. It is not a recommendation or a score.</p></div>;}

function FutureStep({ draft, set }) {const [form, setForm] = useState({ event: "Retirement", importance: "Medium" });const add = () => {if (!form.event) return;const event = { id: `event-${Date.now()}`, event: form.event, year: form.year ?? new Date().getFullYear() + 5, estimatedCost: form.estimatedCost ?? 0, importance: form.importance ?? "Medium" };set("futureEvents", [...draft.futureEvents, event]);set("lifeEvents", [...new Set([...draft.lifeEvents, event.event])]);setForm({ event: "Retirement", importance: "Medium" });};return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Life event"><Select value={form.event ?? "Retirement"} options={eventTypes} onChange={(v) => setForm({ ...form, event: v })} /></Field><NumberField label="Expected year" value={form.year ?? new Date().getFullYear() + 5} onChange={(v) => setForm({ ...form, year: v })} /><NumberField label="Estimated cost" value={form.estimatedCost ?? 0} onChange={(v) => setForm({ ...form, estimatedCost: v })} money /><Field label="Importance"><Select value={form.importance ?? "Medium"} options={["High", "Medium", "Low"]} onChange={(v) => setForm({ ...form, importance: v })} /></Field></div><Button type="button" onClick={add}><Plus className="size-4" /> Add future event</Button><div className="grid gap-3 sm:grid-cols-2">{draft.futureEvents.map((event) => <RecordCard key={event.id} title={event.event} subtitle={`${event.year} · ${event.importance} importance`} onRemove={() => set("futureEvents", draft.futureEvents.filter((item) => item.id !== event.id))}><p className="text-muted-foreground text-xs">Estimated cost {formatINRShort(event.estimatedCost)}</p></RecordCard>)}</div></div>;}

function ReviewStep({ draft }) {const rows = [["ABOUT YOU", `${draft.name}, ${draft.age}`], ["FAMILY", `${draft.familyMembers.length} members`], ["CASHFLOW", `${formatINRShort(derivedIncome(draft))} monthly income`], ["ASSETS", `${draft.assets.length} detailed records`], ["LIABILITIES", `${draft.liabilities.length} liabilities`], ["GOALS", `${draft.goals.length} goals`], ["PROTECTION", `${draft.insurancePolicies.length} policies`], ["RISK", `${draft.riskAppetite}/10 risk comfort`], ["FUTURE", `${draft.futureEvents.length} events`]];return <div className="space-y-3">{rows.map(([label, value]) => <div key={label} className="bg-success-soft flex items-center gap-3 rounded-xl p-3"><Check className="text-success size-4" /><div><p className="text-success text-xs font-semibold">{label}</p><p className="text-muted-foreground mt-0.5 text-xs">{value}</p></div><span className="text-success/70 ml-auto text-xs">Ready</span></div>)}<div className="bg-secondary/60 mt-5 flex items-start gap-3 rounded-xl p-4"><Lock className="text-muted-foreground mt-0.5 size-4 shrink-0" /><p className="text-muted-foreground text-xs leading-relaxed">You're in control. This information is provided by you, used to personalise Wealth360, and can be edited later. No transaction happens automatically.</p></div></div>;}

function MoneyGroup({ title, fields, draft, set }) {return <div><p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">{title}</p><div className="grid gap-4 sm:grid-cols-2">{fields.map(([label, key]) => <NumberField key={key} label={label} value={draft[key]} onChange={(v) => set(key, v)} money />)}</div></div>;}
function RecordCard({ title, subtitle, children, onRemove }) {return <div className="bg-muted/50 flex items-start gap-3 rounded-xl p-4"><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="text-muted-foreground mt-1 text-xs">{subtitle}</p><div className="mt-2">{children}</div></div><button type="button" className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${title}`} onClick={onRemove}><Trash2 className="size-4" /></button></div>;}
function Field({ label, children }) {return <div className="space-y-2"><Label>{label}</Label>{children}</div>;}
function NumberField({ label, value, onChange, money }) {return <Field label={money ? `${label} — ${formatINR(value)}` : label}><Input type="number" className="num" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} /></Field>;}
function Select({ value, options, onChange }) {return <div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className="border-input bg-background h-9 w-full appearance-none rounded-md border px-3 pr-9 text-sm outline-none focus:ring-1 focus:ring-ring">{options.map((option) => <option key={option} value={option}>{option.replaceAll("-", " ")}</option>)}</select><ChevronDown className="text-muted-foreground pointer-events-none absolute top-2.5 right-3 size-4" /></div>;}
function Choice({ label, active, onClick }) {return <button type="button" onClick={onClick} className={cn("rounded-full border px-3 py-2 text-xs font-medium capitalize", active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted")}>{active && <Check className="mr-1 inline size-3" />}{label}</button>;}
function FlowMetric({ label, value, tone }) {return <div><p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p><p className={cn("num mt-1 text-sm font-semibold", tone === "success" && "text-success", tone === "destructive" && "text-destructive")}>{Math.abs(value) > 1000 ? formatINRShort(value) : value}</p></div>;}