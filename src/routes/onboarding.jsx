import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  CreditCard,
  FileText,
  HeartHandshake,
  Landmark,
  Layers,
  Loader2,
  Lock,
  Pencil,
  PieChart,
  Plus,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
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
import { AppShell } from "@/components/wealth/app-shell";
import {
  defaultAnswers,
  derivedExpenses,
  derivedIncome,
  useApp } from






"@/context/app-context";
import { clamp, formatINR, formatINRShort, formatPct } from "@/lib/format";
import { lifeStage } from "@/lib/wealth360";
import { cn } from "@/lib/utils";


const chapters = ["About You", "Family", "Cashflow", "What You Own", "What You Owe", "Protect", "Goals"];
const assetTypes = ["Cash & Savings", "FD/RD", "Stocks", "Mutual Funds", "ETFs", "Bonds", "Gold/SGB", "Real Estate", "EPF/PPF/NPS", "Pension", "Other Assets"];
const goalTypes = ["Child Education", "Retirement", "Home", "Emergency Fund", "Travel", "Marriage", "Financial Independence", "Business", "Career Break", "Wealth Creation", "Parents", "Custom"];
const GOAL_TYPE_ICONS = { "Retirement": "retirement", "Child Education": "education", "Home": "home", "Emergency Fund": "shield", "Travel": "travel" };
function iconForGoalType(name) {
  return GOAL_TYPE_ICONS[name] || "retirement";
}

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
  const [draft, setDraft] = useState(() => {
    const base = answers ?? defaultAnswers;
    const patched = { ...base };
    if (!patched.salary && !patched.businessIncome && !patched.rentalIncome) {
      patched.salary = defaultAnswers.salary;
      patched.rentalIncome = defaultAnswers.rentalIncome;
      patched.otherIncome = defaultAnswers.otherIncome;
      patched.annualIncome = defaultAnswers.annualIncome;
      patched.monthlyTakeHome = defaultAnswers.monthlyTakeHome;
    }
    if (!patched.goals || patched.goals.length === 0) {
      patched.goals = defaultAnswers.goals.slice(0, 3);
      patched.selectedGoals = ["Child Education", "Retirement", "Emergency Fund"];
    }
    return patched;
  });
  const [chapter, setChapter] = useState(0);
  const [aaState, setAaState] = useState("none");
  const [simIndex, setSimIndex] = useState(0);
  const [aaSuccessNotice, setAaSuccessNotice] = useState(false);
  const [panFetched, setPanFetched] = useState(false);
  const [panInput, setPanInput] = useState(draft.pan || "ABCDE1234F");
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(true);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [chapter]);

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
    setConsentModalOpen(true);
  };

  const handleConsentApproved = () => {
    setConsentModalOpen(false);
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
        <JourneyProgress chapter={chapter} progress={progress} onSelect={setChapter} />

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
          {chapter === 5 && <ProtectionStep draft={draft} set={set} />}
          {chapter === 6 && <GoalsStep draft={draft} set={set} />}
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
                  Expenses, Assets, Loans, and Protection have been synthesized. Income and Goals aren&apos;t held by any FIP, so you&apos;ll add those manually.
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

        {/* Customer AA Consent Dialog */}
        <Dialog open={consentModalOpen} onOpenChange={setConsentModalOpen}>
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="size-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  RBI Account Aggregator Framework
                </span>
              </div>
              <DialogTitle className="font-display text-xl font-bold">
                Customer Consent Authorization
              </DialogTitle>
              <DialogDescription className="text-xs">
                Authorize Mirae Asset Sharekhan (FIU) to fetch verified financial data for your PAN.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-1">
              {/* PAN & FIU Meta Card */}
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3.5 border text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Linking PAN</p>
                  <p className="font-mono text-base font-bold text-foreground tracking-wider">{panInput}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Requester (FIU)</p>
                  <p className="font-semibold text-foreground">Mirae Asset Sharekhan</p>
                  <p className="text-[10px] text-muted-foreground">Reg: FIU-2024-MAS-0089</p>
                </div>
              </div>

              {/* Data Scope to be Fetched */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Financial Data Categories to be Fetched
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
                    <Landmark className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">Bank Accounts & FDs</p>
                      <p className="text-[10px] text-muted-foreground">HDFC, ICICI, SBI balances</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
                    <PieChart className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">Mutual Funds</p>
                      <p className="text-[10px] text-muted-foreground">CAMS & KFintech CAS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
                    <Layers className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">Demat & Equities</p>
                      <p className="text-[10px] text-muted-foreground">CDSL & NSDL holdings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
                    <CreditCard className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">Loans & Mortgages</p>
                      <p className="text-[10px] text-muted-foreground">CIBIL & Experian bureau</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
                    <ShieldCheck className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">Insurance Policies</p>
                      <p className="text-[10px] text-muted-foreground">Life & Health covers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
                    <FileText className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">EPFO & NPS</p>
                      <p className="text-[10px] text-muted-foreground">UAN passbook & CRA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent Terms & Purpose */}
              <div className="rounded-xl border border-border/80 bg-slate-50/80 p-3.5 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Lock className="size-3.5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Consent Purpose:</span>
                    <span className="text-muted-foreground ml-1">Comprehensive 360° Portfolio Aggregation, Net Worth Verification, and Wealth Health Diagnostic Scoring.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Security Guarantee:</span>
                    <span className="text-muted-foreground ml-1">100% Read-Only access. Zero transaction or debit permissions. Encrypted with 256-bit bank-grade security. Revocable anytime.</span>
                  </div>
                </div>
              </div>

              {/* Explicit Customer Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-primary/30 bg-primary/[0.04] p-3 text-xs">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 size-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-foreground leading-relaxed">
                  <strong>Customer Declaration:</strong> I hereby give my explicit electronic consent to <strong>Mirae Asset Sharekhan (FIU)</strong> to request and fetch my financial records via licensed Account Aggregators (Sahamati / Setu / Finvu) for PAN <strong>{panInput}</strong>. I understand this consent is strictly for portfolio analysis and is revocable by me at any time.
                </span>
              </label>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between gap-2 border-t pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setConsentModalOpen(false);
                    setChapter(1);
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Skip to Manual Entry
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConsentModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground font-semibold gap-1.5 text-xs shadow-sm"
                    disabled={!consentAgreed}
                    onClick={handleConsentApproved}
                  >
                    <CheckCircle2 className="size-3.5" /> Authorize & Fetch via AA
                  </Button>
                </div>
              </div>
            </div>
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
      { icon: User, label: "Identity", value: `${draft.name}, ${draft.age} yrs`, color: "text-blue-500", fetched: true },
      { icon: Briefcase, label: "Assets", value: `${draft.assets?.length || 0} holdings mapped`, color: "text-amber-500", fetched: true },
      { icon: CreditCard, label: "Liabilities", value: `${draft.liabilities?.length || 0} loans found`, color: "text-rose-500", fetched: true },
      { icon: Shield, label: "Protection", value: `${draft.insurancePolicies?.length || 0} policies`, color: "text-violet-500", fetched: true },
    ];
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success-soft p-4 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="size-5 text-success shrink-0" />
          <div>
            <p className="text-sm font-bold text-success">Financial Universe Fetched Successfully</p>
            <p className="text-xs text-success/80 mt-0.5">PAN {panInput} · Holdings, loans & policies auto-populated — income and goals aren&apos;t held by any FIP, so add those next.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {summaryItems.map((item) => (
            <div key={item.label} className={cn("flex items-center gap-3 rounded-xl bg-muted/50 p-4 animate-in fade-in slide-in-from-bottom-2", !item.fetched && "border border-dashed border-muted-foreground/30 bg-transparent")}>
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
          <ShieldCheck className="size-4" />
          Fetch via Account Aggregator
        </Button>
        <p className="text-[11px] text-muted-foreground text-center">
          Requires customer authorization & electronic consent before fetching.
        </p>
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

function JourneyProgress({ chapter, progress, onSelect }) {
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
        {chapters.map((item, index) => {
          const visited = index <= chapter;
          return (
            <button
              key={item}
              type="button"
              disabled={!visited}
              onClick={() => onSelect(index)}
              title={visited ? `Back to ${item}` : undefined}
              className={cn(
                "shrink-0 rounded px-1 text-[10px] font-medium transition-colors",
                visited ? "text-foreground hover:text-primary" : "text-muted-foreground cursor-not-allowed"
              )}>
              {String(index + 1).padStart(2, "0")} {item}
            </button>
          );
        })}
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
  "What could protect your family?",
  "Your wealth should have a purpose."][
  chapter];
}
function descriptionFor(chapter) {
  return [
  "Your life stage helps us personalise the questions and priorities that matter most.",
  "A useful financial plan reflects the people and moments you care about.",
  "We'll show the flow of money, not a score. The analysis comes later.",
  "Add investments one at a time so the details remain meaningful.",
  "Understanding debt helps us decide whether your next rupee should go toward investing, saving or repayment.",
  "We'll compare what you already have against what your family may need.",
  "Choose the milestones that deserve a place in your plan. You can refine them later."][
  chapter];
}

/* Old AboutStep removed — replaced by PanEntryStep above */

function FamilyStep({ draft, set }) {
  const emptyMember = { name: "", relation: "Child", age: 0, dependency: "Full", needs: "" };
  const [editingId, setEditingId] = useState(null);
  const [member, setMember] = useState(emptyMember);

  const startEdit = (person) => {
    setEditingId(person.id);
    setMember(person);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setMember(emptyMember);
  };
  const submit = () => {
    if (!member.name.trim()) return;
    set("familyMembers", editingId ?
    draft.familyMembers.map((p) => p.id === editingId ? { ...member, id: editingId } : p) :
    [...draft.familyMembers, { ...member, id: `family-${Date.now()}` }]);
    cancelEdit();
  };
  const remove = (id) => {
    set("familyMembers", draft.familyMembers.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="space-y-5">
      {draft.familyMembers.length > 0 ?
      <div className="grid gap-3 sm:grid-cols-2">
          {draft.familyMembers.map((person) =>
        <RecordCard key={person.id} title={person.name} subtitle={`${person.relation} · ${person.age} years · ${person.dependency} dependency`} onRemove={() => remove(person.id)} onEdit={() => startEdit(person)}>
              <p className="text-muted-foreground text-xs">{person.needs || "No specific need added yet"}</p>
            </RecordCard>
        )}
        </div> :

      <EmptyState text="No family members added yet — add the people your plan should provide for." />
      }

      <div className="space-y-4 rounded-xl border border-dashed p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-base font-semibold">{editingId ? "Edit family member" : "Add a family member"}</p>
          {editingId &&
          <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground text-xs font-semibold">
              Cancel edit
            </button>
          }
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name"><Input value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} placeholder="Add family member" /></Field>
          <NumberField label="Age" value={member.age} onChange={(v) => setMember({ ...member, age: v })} />
        </div>
        <Field label="Relationship">
          <PillGroup options={["Spouse", "Child", "Parent", "Other"]} value={member.relation} onChange={(v) => setMember({ ...member, relation: v })} />
        </Field>
        <Field label="Financial dependency">
          <PillGroup options={["Full", "Partial", "None"]} value={member.dependency} onChange={(v) => setMember({ ...member, dependency: v })} />
        </Field>
        <Field label="Important financial needs"><Input value={member.needs} onChange={(e) => setMember({ ...member, needs: e.target.value })} placeholder="Education, care, home..." /></Field>
        <Button type="button" variant="secondary" onClick={submit}><Plus className="size-4" /> {editingId ? "Save changes" : "Add family member"}</Button>
      </div>
    </div>);

}

function CashflowStep({ draft, set }) {
  useEffect(() => {
    if (derivedIncome(draft) === 0) {
      set("salary", defaultAnswers.salary);
      set("rentalIncome", defaultAnswers.rentalIncome);
      set("otherIncome", defaultAnswers.otherIncome);
      set("annualIncome", defaultAnswers.annualIncome);
      set("monthlyTakeHome", defaultAnswers.monthlyTakeHome);
    }
  }, []);

  const handleApplyDefaults = () => {
    set("salary", defaultAnswers.salary);
    set("businessIncome", defaultAnswers.businessIncome || 0);
    set("annualBonus", defaultAnswers.annualBonus || 0);
    set("rentalIncome", defaultAnswers.rentalIncome || 0);
    set("dividendsIncome", defaultAnswers.dividendsIncome || 0);
    set("interestIncome", defaultAnswers.interestIncome || 0);
    set("otherIncome", defaultAnswers.otherIncome || 0);
    set("household", defaultAnswers.household);
    set("schoolFees", defaultAnswers.schoolFees);
    set("emiExpenses", defaultAnswers.emiExpenses);
    set("insuranceExpenses", defaultAnswers.insuranceExpenses);
    set("healthcareExpenses", defaultAnswers.healthcareExpenses || 4000);
    set("lifestyle", defaultAnswers.lifestyle);
    set("travelExpenses", defaultAnswers.travelExpenses || 10000);
    set("otherExpenses", defaultAnswers.otherExpenses || 5000);
    set("annualIncome", defaultAnswers.annualIncome);
    set("monthlyTakeHome", defaultAnswers.monthlyTakeHome);
  };

  const income = derivedIncome(draft);
  const expenses = derivedExpenses(draft);
  const surplus = income - expenses;
  const expenseShare = income > 0 ? Math.min(100, expenses / income * 100) : 0;
  const incomeFields = [["Salary", "salary"], ["Business", "businessIncome"], ["Rental", "rentalIncome"], ["Dividend", "dividendsIncome"], ["Interest", "interestIncome"], ["Other", "otherIncome"]];
  const expenseFields = [["Household", "household"], ["Education", "schoolFees"], ["EMI", "emiExpenses"], ["Insurance", "insuranceExpenses"], ["Healthcare", "healthcareExpenses"], ["Lifestyle", "lifestyle"], ["Travel", "travelExpenses"], ["Other", "otherExpenses"]];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/60 border px-4 py-2.5 text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
          <Sparkles className="size-3.5 text-primary" />
          Pre-populated with default benchmark cashflow. You can edit any figure below.
        </span>
        <button
          type="button"
          onClick={handleApplyDefaults}
          className="font-semibold text-primary hover:underline"
        >
          Reset to default values
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MoneyGroup title="Income sources" fields={incomeFields} draft={draft} set={set} />
        <MoneyGroup title="Monthly expenses" fields={expenseFields} draft={draft} set={set} />
      </div>

      <div className="bg-secondary space-y-3 rounded-xl p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <FlowMetric label="Monthly income" value={income} />
          <FlowMetric label="Monthly expenses" value={expenses} />
          <FlowMetric label="Future surplus" value={surplus} tone={surplus >= 0 ? "success" : "destructive"} />
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${expenseShare}%` }} />
        </div>
        <p className="text-muted-foreground text-xs">
          {Math.round(expenseShare)}% of your income goes to expenses — the rest becomes your future surplus.
        </p>
      </div>
    </div>
  );
}

function AssetsStep({ draft, set }) {
  const emptyForm = { type: "Stocks", risk: "Moderate", liquidity: "Medium", ownership: "Self", startDate: "" };
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState("Stocks");
  const [form, setForm] = useState(emptyForm);

  const startEdit = (asset) => {
    setEditingId(asset.id);
    setSelected(asset.type);
    setForm(asset);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setSelected("Stocks");
    setForm(emptyForm);
  };
  const submit = () => {
    if (!form.name?.trim()) return;
    const record = { id: editingId ?? `asset-${Date.now()}`, name: form.name, type: selected, investedValue: form.investedValue ?? 0, currentValue: form.currentValue ?? 0, startDate: form.startDate ?? "", holdingPeriod: form.holdingPeriod ?? 0, actualReturn: form.actualReturn ?? 0, expectedReturn: form.expectedReturn ?? 10, risk: form.risk ?? "Moderate", liquidity: form.liquidity ?? "Medium", taxTreatment: form.taxTreatment ?? "To review", incomeGenerated: form.incomeGenerated ?? 0, linkedGoal: form.linkedGoal ?? "", ownership: form.ownership ?? "Self", details: form.details ?? {} };
    set("assets", editingId ?
    draft.assets.map((a) => a.id === editingId ? record : a) :
    [...draft.assets, record]);
    cancelEdit();
  };
  const remove = (id) => {
    set("assets", draft.assets.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };
  const invested = form.investedValue ?? 0;
  const current = form.currentValue ?? 0;
  const gain = current - invested;
  const gainPct = invested > 0 ? gain / invested * 100 : 0;
  return (
    <div className="space-y-6">
      {draft.assets.length > 0 ?
      <div className="grid gap-3 sm:grid-cols-2">
          {draft.assets.map((asset) =>
        <RecordCard key={asset.id} title={asset.name} subtitle={`${asset.type} · ${formatINRShort(asset.currentValue)} current`} onRemove={() => remove(asset.id)} onEdit={() => startEdit(asset)}>
              <p className="text-muted-foreground text-xs">Invested {formatINRShort(asset.investedValue)} · {asset.actualReturn}% actual return · {asset.risk} risk</p>
            </RecordCard>
        )}
        </div> :

      <EmptyState text="No investments added yet — add each holding one at a time below." />
      }

      <div className="bg-muted/40 space-y-5 rounded-xl p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <SectionLabel>Choose what you want to add</SectionLabel>
            {editingId &&
            <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground text-xs font-semibold">
                Cancel edit
              </button>
            }
          </div>
          <div className="mt-2">
            <PillGroup options={assetTypes} value={selected} onChange={(type) => {setSelected(type);setForm({ ...form, type });}} />
          </div>
        </div>

        <div>
          <p className="font-display text-base font-semibold">{editingId ? `Edit ${selected}` : `Add ${selected}`}</p>
          <p className="text-muted-foreground mt-1 text-xs">Capture the details that make this investment meaningful.</p>
        </div>

        <div className="space-y-3">
          <SectionLabel>Basics</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={selected === "Stocks" ? "e.g. HDFC Bank" : "Give it a name"} /></Field>
            <Field label="Start date"><Input type="date" value={form.startDate ?? ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
          </div>
        </div>

        <div className="space-y-3">
          <SectionLabel>Value & performance</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Invested value" value={invested} onChange={(v) => setForm({ ...form, investedValue: v })} money />
            <NumberField label="Current value" value={current} onChange={(v) => setForm({ ...form, currentValue: v })} money />
            <NumberField label="Holding period (years)" value={form.holdingPeriod ?? 0} onChange={(v) => setForm({ ...form, holdingPeriod: v })} />
            <NumberField label="Actual return %" value={form.actualReturn ?? 0} onChange={(v) => setForm({ ...form, actualReturn: v })} />
            <NumberField label="Expected return %" value={form.expectedReturn ?? 10} onChange={(v) => setForm({ ...form, expectedReturn: v })} />
          </div>
          {(invested > 0 || current > 0) &&
          <p className={cn("text-xs font-medium", gain >= 0 ? "text-success" : "text-destructive")}>
              {gain >= 0 ? "Up" : "Down"} {formatINRShort(Math.abs(gain))} ({formatPct(gainPct)}) on {formatINRShort(invested)} invested
            </p>
          }
        </div>

        <div className="space-y-3">
          <SectionLabel>Classification</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Risk"><PillGroup options={["Low", "Moderate", "High"]} value={form.risk ?? "Moderate"} onChange={(v) => setForm({ ...form, risk: v })} /></Field>
            <Field label="Liquidity"><PillGroup options={["High", "Medium", "Low"]} value={form.liquidity ?? "Medium"} onChange={(v) => setForm({ ...form, liquidity: v })} /></Field>
            <Field label="Linked goal"><Input value={form.linkedGoal ?? ""} onChange={(e) => setForm({ ...form, linkedGoal: e.target.value })} placeholder="Optional" /></Field>
            <Field label="Ownership"><Input value={form.ownership ?? "Self"} onChange={(e) => setForm({ ...form, ownership: e.target.value })} /></Field>
            <Field label="Tax treatment"><Input value={form.taxTreatment ?? ""} onChange={(e) => setForm({ ...form, taxTreatment: e.target.value })} placeholder="ELSS, equity LTCG..." /></Field>
          </div>
        </div>

        <Button type="button" onClick={submit}><Plus className="size-4" /> {editingId ? "Save changes" : "Add investment"}</Button>
      </div>
    </div>);

}

function LiabilitiesStep({ draft, set }) {
  const emptyForm = { type: "Home Loan", rateType: "Floating", startDate: "", endDate: "" };
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const startEdit = (loan) => {
    setEditingId(loan.id);
    setForm(loan);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };
  const submit = () => {
    if (!form.provider?.trim()) return;
    const record = { id: editingId ?? `liability-${Date.now()}`, provider: form.provider, type: form.type ?? "Other", originalAmount: form.originalAmount ?? 0, outstandingAmount: form.outstandingAmount ?? 0, interestRate: form.interestRate ?? 0, emi: form.emi ?? 0, startDate: form.startDate ?? "", originalTenure: form.originalTenure ?? 0, remainingTenure: form.remainingTenure ?? 0, endDate: form.endDate ?? "", rateType: form.rateType ?? "Floating", prepaymentOption: form.prepaymentOption ?? false, prepaymentPenalty: form.prepaymentPenalty ?? 0 };
    set("liabilities", editingId ?
    draft.liabilities.map((l) => l.id === editingId ? record : l) :
    [...draft.liabilities, record]);
    cancelEdit();
  };
  const remove = (id) => {
    set("liabilities", draft.liabilities.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };
  const original = form.originalAmount ?? 0;
  const outstanding = form.outstandingAmount ?? 0;
  const repaidPct = original > 0 ? clamp((original - outstanding) / original * 100) : 0;
  return (
    <div className="space-y-6">
      {draft.liabilities.length > 0 ?
      <div className="grid gap-3 sm:grid-cols-2">
          {draft.liabilities.map((loan) =>
        <RecordCard key={loan.id} title={loan.provider} subtitle={`${loan.type} · ${formatINRShort(loan.outstandingAmount)} outstanding`} onRemove={() => remove(loan.id)} onEdit={() => startEdit(loan)}>
              <p className="text-muted-foreground text-xs">{loan.interestRate}% {loan.rateType} · EMI {formatINR(loan.emi)} · {loan.remainingTenure} years left</p>
            </RecordCard>
        )}
        </div> :

      <EmptyState text="No liabilities added yet — add any loans or credit you're repaying." />
      }

      <div className="bg-muted/40 space-y-5 rounded-xl p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <SectionLabel>Debt type</SectionLabel>
            {editingId &&
            <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground text-xs font-semibold">
                Cancel edit
              </button>
            }
          </div>
          <div className="mt-2">
            <PillGroup options={["Home Loan", "Personal Loan", "Vehicle Loan", "Credit Card", "Education Loan", "Other"]} value={form.type ?? "Home Loan"} onChange={(v) => setForm({ ...form, type: v })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Provider"><Input value={form.provider ?? ""} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="Bank or lender" /></Field>
          <Field label="Rate type"><PillGroup options={["Fixed", "Floating"]} value={form.rateType ?? "Floating"} onChange={(v) => setForm({ ...form, rateType: v })} /></Field>
        </div>

        <div className="space-y-3">
          <SectionLabel>Amounts & tenure</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Original amount" value={original} onChange={(v) => setForm({ ...form, originalAmount: v })} money />
            <NumberField label="Outstanding amount" value={outstanding} onChange={(v) => setForm({ ...form, outstandingAmount: v })} money />
            <NumberField label="Interest rate %" value={form.interestRate ?? 0} onChange={(v) => setForm({ ...form, interestRate: v })} />
            <NumberField label="Monthly EMI" value={form.emi ?? 0} onChange={(v) => setForm({ ...form, emi: v })} money />
            <NumberField label="Original tenure (years)" value={form.originalTenure ?? 0} onChange={(v) => setForm({ ...form, originalTenure: v })} />
            <NumberField label="Remaining tenure (years)" value={form.remainingTenure ?? 0} onChange={(v) => setForm({ ...form, remainingTenure: v })} />
          </div>
          <Field label="End date"><Input type="date" value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
          {original > 0 &&
          <div className="space-y-1.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="bg-success h-full transition-all duration-500" style={{ width: `${repaidPct}%` }} />
              </div>
              <p className="text-muted-foreground text-xs">{Math.round(repaidPct)}% repaid so far</p>
            </div>
          }
        </div>

        <Button type="button" onClick={submit}><Plus className="size-4" /> {editingId ? "Save changes" : "Add liability"}</Button>
      </div>

      <p className="bg-gold-soft text-gold-foreground rounded-xl p-4 text-xs">We'll later help you explore &quot;Should I invest more or repay debt?&quot; without giving final advice during onboarding.</p>
    </div>);

}

function GoalsStep({ draft, set }) {
  const emptyForm = { priority: "Medium", expectedReturn: 10, inflation: 6 };
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!draft.goals || draft.goals.length === 0) {
      const initialGoals = defaultAnswers.goals.slice(0, 3);
      set("goals", initialGoals);
      set("selectedGoals", initialGoals.map((g) => g.name));
    }
  }, []);

  const handleLoadPredefinedGoals = () => {
    const initialGoals = defaultAnswers.goals.slice(0, 3);
    set("goals", initialGoals);
    set("selectedGoals", initialGoals.map((g) => g.name));
  };

  const startEdit = (goal) => {
    setEditingId(goal.id);
    setForm(goal);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };
  const submit = () => {
    if (!form.name?.trim()) return;
    const record = {
      id: editingId ?? `goal-${Date.now()}`,
      name: form.name,
      icon: iconForGoalType(form.name),
      saved: form.saved ?? 0,
      target: form.target ?? 0,
      targetYear: form.targetYear ?? new Date().getFullYear() + 10,
      duration: form.duration ?? 10,
      monthlyContribution: form.monthlyContribution ?? 0,
      expectedReturn: form.expectedReturn ?? 10,
      inflation: form.inflation ?? 6,
      priority: form.priority ?? "Medium",
      linkedInvestments: form.linkedInvestments ?? [],
      fundingSource: form.fundingSource ?? "Monthly contributions"
    };
    set("goals", editingId ?
    draft.goals.map((g) => g.id === editingId ? record : g) :
    [...draft.goals, record]);
    set("selectedGoals", [...new Set([...draft.selectedGoals, record.name])]);
    cancelEdit();
  };
  const remove = (id) => {
    set("goals", draft.goals.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };

  const saved = form.saved ?? 0;
  const target = form.target ?? 0;
  const progressPct = target > 0 ? clamp(saved / target * 100) : 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/60 border px-4 py-2.5 text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
          <Sparkles className="size-3.5 text-primary" />
          Pre-populated with 3 recommended goals based on your life stage. Edit or add more anytime.
        </span>
        <button
          type="button"
          onClick={handleLoadPredefinedGoals}
          className="font-semibold text-primary hover:underline"
        >
          Reset to 3 default goals
        </button>
      </div>

      {draft.goals.length > 0 ?
      <div className="grid gap-3 sm:grid-cols-2">
          {draft.goals.map((goal) =>
        <RecordCard key={goal.id} title={goal.name} subtitle={`${formatINRShort(goal.target)} target by ${goal.targetYear}`} onRemove={() => remove(goal.id)} onEdit={() => startEdit(goal)}>
              <p className="text-muted-foreground text-xs">{formatINR(goal.monthlyContribution)}/month · {goal.priority} priority · {goal.inflation}% inflation assumption</p>
            </RecordCard>
        )}
        </div> :

      <EmptyState text="No goals yet — add the milestones you're saving toward, like retirement or your child's education." />
      }

      <div className="bg-muted/40 space-y-5 rounded-xl p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-base font-semibold">{editingId ? "Edit goal" : "Add a goal"}</p>
          {editingId &&
          <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground text-xs font-semibold">
              Cancel edit
            </button>
          }
        </div>

        <div>
          <SectionLabel>Goal type</SectionLabel>
          <div className="mt-2">
            <PillGroup options={goalTypes} value={form.name ?? "Retirement"} onChange={(v) => setForm({ ...form, name: v })} />
          </div>
        </div>

        <div className="space-y-3">
          <SectionLabel>Funding</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Current amount" value={saved} onChange={(v) => setForm({ ...form, saved: v })} money />
            <NumberField label="Target amount" value={target} onChange={(v) => setForm({ ...form, target: v })} money />
            <NumberField label="Monthly contribution" value={form.monthlyContribution ?? 0} onChange={(v) => setForm({ ...form, monthlyContribution: v })} money />
            <NumberField label="Target year" value={form.targetYear ?? new Date().getFullYear() + 10} onChange={(v) => setForm({ ...form, targetYear: v })} />
          </div>
          {target > 0 &&
          <div className="space-y-1.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-muted-foreground text-xs">{Math.round(progressPct)}% already saved toward this goal</p>
            </div>
          }
        </div>

        <div className="space-y-3">
          <SectionLabel>Assumptions & priority</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Expected return %" value={form.expectedReturn ?? 10} onChange={(v) => setForm({ ...form, expectedReturn: v })} />
            <NumberField label="Inflation assumption %" value={form.inflation ?? 6} onChange={(v) => setForm({ ...form, inflation: v })} />
          </div>
          <Field label="Priority"><PillGroup options={["High", "Medium", "Low"]} value={form.priority ?? "Medium"} onChange={(v) => setForm({ ...form, priority: v })} /></Field>
        </div>

        <Button type="button" onClick={submit}><Plus className="size-4" /> {editingId ? "Save changes" : "Add goal"}</Button>
      </div>
    </div>);

}

function ProtectionStep({ draft, set }) {
  const emptyForm = { type: "Life", startDate: "", renewalDate: "" };
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const startEdit = (policy) => {
    setEditingId(policy.id);
    setForm(policy);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };
  const submit = () => {
    if (!form.insurer?.trim()) return;
    const policy = { id: editingId ?? `policy-${Date.now()}`, insurer: form.insurer, type: form.type ?? "Life", sumAssured: form.sumAssured ?? 0, premium: form.premium ?? 0, term: form.term ?? 0, startDate: form.startDate ?? "", renewalDate: form.renewalDate ?? "", nominee: form.nominee ?? "", coveredMembers: form.coveredMembers ?? [] };
    set("insurancePolicies", editingId ?
    draft.insurancePolicies.map((p) => p.id === editingId ? policy : p) :
    [...draft.insurancePolicies, policy]);
    cancelEdit();
  };
  const remove = (id) => {
    set("insurancePolicies", draft.insurancePolicies.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };
  return (
    <div className="space-y-6">
      {draft.insurancePolicies.length > 0 ?
      <div className="grid gap-3 sm:grid-cols-2">
          {draft.insurancePolicies.map((policy) =>
        <RecordCard key={policy.id} title={policy.insurer} subtitle={`${policy.type} · ${formatINRShort(policy.sumAssured)} cover`} onRemove={() => remove(policy.id)} onEdit={() => startEdit(policy)}>
              <p className="text-muted-foreground text-xs">Premium {formatINR(policy.premium)} · Nominee {policy.nominee || "Not added"}</p>
            </RecordCard>
        )}
        </div> :

      <EmptyState text="No policies added yet — add your life, health or accident cover." />
      }

      <div className="bg-muted/40 space-y-5 rounded-xl p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <SectionLabel>Policy type</SectionLabel>
            {editingId &&
            <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground text-xs font-semibold">
                Cancel edit
              </button>
            }
          </div>
          <div className="mt-2">
            <PillGroup options={["Life", "Health", "Personal Accident"]} value={form.type ?? "Life"} onChange={(v) => setForm({ ...form, type: v })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Insurer"><Input value={form.insurer ?? ""} onChange={(e) => setForm({ ...form, insurer: e.target.value })} placeholder="Provider name" /></Field>
          <Field label="Nominee"><Input value={form.nominee ?? ""} onChange={(e) => setForm({ ...form, nominee: e.target.value })} /></Field>
          <NumberField label="Sum assured" value={form.sumAssured ?? 0} onChange={(v) => setForm({ ...form, sumAssured: v })} money />
          <NumberField label="Premium" value={form.premium ?? 0} onChange={(v) => setForm({ ...form, premium: v })} money />
          <NumberField label="Policy term (years)" value={form.term ?? 0} onChange={(v) => setForm({ ...form, term: v })} />
          <Field label="Start date"><Input type="date" value={form.startDate ?? ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
          <Field label="Renewal date"><Input type="date" value={form.renewalDate ?? ""} onChange={(e) => setForm({ ...form, renewalDate: e.target.value })} /></Field>
        </div>

        <Button type="button" onClick={submit}><Plus className="size-4" /> {editingId ? "Save changes" : "Add policy"}</Button>
      </div>

      <div className="bg-secondary grid gap-4 rounded-xl p-4 sm:grid-cols-3">
        <FlowMetric label="Life cover" value={draft.lifeCover} />
        <FlowMetric label="Health cover" value={draft.healthCover} />
        <FlowMetric label="Emergency fund" value={draft.cashSavings} />
      </div>
    </div>);

}

/* Risk profiling is no longer part of the mandatory journey — it's asked as a
   quick prompt on the dashboard instead (see risk-profile-prompt.jsx). */

/* Future life events are no longer part of the mandatory journey — they're optional
   and can be added later from the Life Events page on the dashboard. */

function ReviewStep({ draft }) {const rows = [["ABOUT YOU", `${draft.name}, ${draft.age}`], ["FAMILY", `${draft.familyMembers.length} members`], ["CASHFLOW", `${formatINRShort(derivedIncome(draft))} monthly income`], ["ASSETS", `${draft.assets.length} detailed records`], ["LIABILITIES", `${draft.liabilities.length} liabilities`], ["GOALS", `${draft.goals.length} goals`], ["PROTECTION", `${draft.insurancePolicies.length} policies`], ["RISK", `${draft.riskAppetite}/10 risk comfort`], ["FUTURE", `${draft.futureEvents.length} events`]];return <div className="space-y-3">{rows.map(([label, value]) => <div key={label} className="bg-success-soft flex items-center gap-3 rounded-xl p-3"><Check className="text-success size-4" /><div><p className="text-success text-xs font-semibold">{label}</p><p className="text-muted-foreground mt-0.5 text-xs">{value}</p></div><span className="text-success/70 ml-auto text-xs">Ready</span></div>)}<div className="bg-secondary/60 mt-5 flex items-start gap-3 rounded-xl p-4"><Lock className="text-muted-foreground mt-0.5 size-4 shrink-0" /><p className="text-muted-foreground text-xs leading-relaxed">You're in control. This information is provided by you, used to personalise Wealth360, and can be edited later. No transaction happens automatically.</p></div></div>;}

function MoneyGroup({ title, fields, draft, set }) {return <div><p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">{title}</p><div className="divide-y divide-border rounded-xl border">{fields.map(([label, key]) => <MoneyRow key={key} label={label} value={draft[key]} onChange={(v) => set(key, v)} />)}</div></div>;}
function MoneyRow({ label, value, onChange }) {return <div className="flex items-center justify-between gap-3 px-4 py-2.5"><Label htmlFor={`money-${label}`} className="text-sm font-normal">{label}</Label><div className="relative w-32 shrink-0"><span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs">₹</span><Input id={`money-${label}`} type="number" className="num h-8 pl-6 text-right text-sm" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} /></div></div>;}
function RecordCard({ title, subtitle, children, onRemove, onEdit }) {return <div className="bg-muted/50 flex items-start gap-3 rounded-xl p-4"><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="text-muted-foreground mt-1 text-xs">{subtitle}</p><div className="mt-2">{children}</div></div><div className="flex shrink-0 items-center gap-1">{onEdit && <button type="button" className="text-muted-foreground hover:text-primary" aria-label={`Edit ${title}`} onClick={onEdit}><Pencil className="size-4" /></button>}<button type="button" className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${title}`} onClick={onRemove}><Trash2 className="size-4" /></button></div></div>;}
function Field({ label, children }) {return <div className="space-y-2"><Label>{label}</Label>{children}</div>;}
function NumberField({ label, value, onChange, money }) {return <Field label={money ? `${label} — ${formatINR(value)}` : label}><Input type="number" className="num" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} /></Field>;}
function Choice({ label, active, onClick }) {return <button type="button" onClick={onClick} className={cn("rounded-full border px-3 py-2 text-xs font-medium capitalize", active ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted")}>{active && <Check className="mr-1 inline size-3" />}{label}</button>;}
function PillGroup({ options, value, onChange }) {return <div className="flex flex-wrap gap-2">{options.map((option) => <Choice key={option} label={option} active={value === option} onClick={() => onChange(option)} />)}</div>;}
function SectionLabel({ children }) {return <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">{children}</p>;}
function EmptyState({ text }) {return <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">{text}</div>;}
function FlowMetric({ label, value, tone }) {return <div><p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p><p className={cn("num mt-1 text-sm font-semibold", tone === "success" && "text-success", tone === "destructive" && "text-destructive")}>{formatINRShort(value)}</p></div>;}