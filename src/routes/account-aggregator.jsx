import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,

  Building,
  Check,
  CheckCircle2,
  FileCheck,
  Landmark,
  Layers,
  Loader2,
  Lock,
  PieChart,
  Receipt,

  ShieldCheck,
  Sparkles } from
"lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppShell } from "@/components/wealth/app-shell";
import { useApp, defaultAnswers } from "@/context/app-context";
import { cn } from "@/lib/utils";



const CONSENT_ACCOUNTS = [
{ id: "bank", label: "Bank Accounts", provider: "HDFC, ICICI, SBI", icon: Landmark },
{ id: "mf", label: "Mutual Funds", provider: "CAMS & KFintech CAS", icon: PieChart },
{ id: "stocks", label: "Stocks & Demat", provider: "CDSL & NSDL Repositories", icon: Layers },
{ id: "insurance", label: "Insurance Policies", provider: "Life & Health Repository", icon: ShieldCheck },
{ id: "epf", label: "EPF Passbook", provider: "EPFO UAN System", icon: Building },
{ id: "nps", label: "NPS Tier-I & II", provider: "Protean CRA", icon: Receipt },
{ id: "loans", label: "Loans & Mortgages", provider: "CIBIL / Experian Bureau", icon: FileCheck },
{ id: "fd", label: "Fixed & Recurring Deposits", provider: "Scheduled Commercial Banks", icon: Landmark }];


const FETCH_STEPS = [
{ id: 1, title: "Authenticating PAN & mobile OTP with DigiLocker" },
{ id: 2, title: "Connecting Account Aggregator (Anumati / Sahamati FIP)" },
{ id: 3, title: "Discovering linked Demat & Mutual Fund statements" },
{ id: 4, title: "Parsing bank transactions & monthly recurring cashflows" },
{ id: 5, title: "Fetching outstanding loan EMIs and credit bureau report" },
{ id: 6, title: "Synthesizing insurance covers and nomination records" },
{ id: 7, title: "Compiling verified financial profile for WealthVerse" }];


export default function AccountAggregatorPage() {
  const { connectAccountAggregator } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [pan, setPan] = useState("ABCDE1234F");
  const [selectedConsents, setSelectedConsents] = useState([
  "bank",
  "mf",
  "stocks",
  "insurance",
  "epf",
  "nps",
  "loans",
  "fd"]
  );
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [fetchProgress, setFetchProgress] = useState(0);

  // Auto-progress simulation for Step 3
  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setFetchProgress((prev) => {
          if (prev >= FETCH_STEPS.length) {
            clearInterval(interval);
            setTimeout(() => setStep(4), 600);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
      return () => clearInterval(interval);
    }
  }, [step]);

  const toggleConsent = (id) => {
    setSelectedConsents((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyAggregator = () => {
    // Generate synthesized profile data from AA
    const synthesizedData = {
      pan,
      name: "Rahul Mehta",
      age: 36,
      city: "Mumbai",
      maritalStatus: "Married",
      // Default benchmark cashflow values
      annualIncome: defaultAnswers.annualIncome,
      monthlyTakeHome: defaultAnswers.monthlyTakeHome,
      salary: defaultAnswers.salary,
      businessIncome: defaultAnswers.businessIncome,
      annualBonus: defaultAnswers.annualBonus,
      rentalIncome: defaultAnswers.rentalIncome,
      dividendsIncome: defaultAnswers.dividendsIncome,
      interestIncome: defaultAnswers.interestIncome,
      otherIncome: defaultAnswers.otherIncome,
      household: defaultAnswers.household,
      schoolFees: defaultAnswers.schoolFees,
      emiExpenses: defaultAnswers.emiExpenses,
      insuranceExpenses: defaultAnswers.insuranceExpenses,
      lifestyle: defaultAnswers.lifestyle,
      healthcareExpenses: defaultAnswers.healthcareExpenses,
      travelExpenses: defaultAnswers.travelExpenses,
      otherExpenses: defaultAnswers.otherExpenses,
      equity: 1158140,
      mutualFunds: 2963900,
      deposits: 650000,
      gold: 691200,
      retirementCorpus: 1930400,
      cashSavings: 418600,
      lifeCover: 15000000,
      healthCover: 1000000,
      nomineesOnRecord: "some",
      hasWill: false,
      goals: defaultAnswers.goals.slice(0, 3),
      selectedGoals: ["Child Education", "Retirement", "Emergency Fund"],
      goalDetails: {}
    };

    connectAccountAggregator(synthesizedData);
    void navigate("/wealth360/review");
  };

  return (
    <AppShell minimal>
      <div className="mx-auto max-w-3xl space-y-8 py-6 sm:py-10">
        {/* Progress Tracker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold tracking-wider text-primary uppercase">
              Fast-Track Onboarding · Step {step} of 5
            </span>
            <span>Account Aggregator (Simulated)</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-gold transition-all duration-500"
              style={{ width: `${step / 5 * 100}%` }} />
            
          </div>
        </div>

        {/* STEP 1: PAN Capture */}
        {step === 1 &&
        <div className="surface-card space-y-6 p-6 sm:p-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> Instant Financial Synthesis
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Enter your PAN to link your financial universe.
              </h1>
              <p className="text-sm text-muted-foreground">
                We will use your PAN to discover linked bank accounts, mutual funds, Demat holdings, EPF, and loans via Account Aggregator.
              </p>
            </div>

            <div className="max-w-md space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="pan" className="text-xs font-semibold uppercase">
                  Permanent Account Number (PAN)
                </Label>
                <Input
                id="pan"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="e.g. ABCDE1234F"
                className="font-mono text-base tracking-wider uppercase"
                maxLength={10} />
              
                <p className="text-[11px] text-muted-foreground">
                  Sample PAN loaded for simulated prototype demo.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-muted bg-muted/40 p-3.5 text-xs text-muted-foreground">
                <Lock className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span>
                  <strong>Encrypted & Consent-driven:</strong> Data is read-only for calculating your Wealth Health. No transactions are ever triggered without your approval.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-6">
              <Button variant="ghost" asChild>
                <Link to="/onboarding">Manual 9-Step Onboarding instead</Link>
              </Button>
              <Button
              size="lg"
              className="gap-2 bg-primary text-primary-foreground font-semibold"
              disabled={pan.length < 10}
              onClick={() => setStep(2)}>
              
                Proceed to Customer Consent <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        }

        {/* STEP 2: Consent Flow */}
        {step === 2 &&
        <div className="surface-card space-y-6 p-6 sm:p-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
                <ShieldCheck className="size-3.5" /> RBI Electronic Consent Artifact
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Customer Consent Authorization
              </h1>
              <p className="text-sm text-muted-foreground">
                Authorize Mirae Asset Sharekhan (FIU) to fetch verified financial records for PAN <strong>{pan}</strong>. Choose categories to include in your consolidated 360° dashboard.
              </p>
            </div>

            {/* PAN & FIU Authorization Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/40 p-3.5 border text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Customer Identifier</span>
                <span className="font-mono text-sm font-bold text-foreground">{pan}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Requester Entity (FIU)</span>
                <span className="font-semibold text-foreground">Mirae Asset Sharekhan</span>
                <span className="text-muted-foreground text-[10px] block">Reg: FIU-2024-MAS-0089</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Consent Purpose</span>
                <span className="font-semibold text-foreground">Wealth 360 Diagnostics</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Security Guarantee</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <Lock className="size-3" /> Read-Only (Encrypted)
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {CONSENT_ACCOUNTS.map((acc) => {
              const isChecked = selectedConsents.includes(acc.id);
              const Icon = acc.icon;
              return (
                <div
                  key={acc.id}
                  onClick={() => toggleConsent(acc.id)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                    isChecked ?
                    "border-primary/40 bg-primary/5 shadow-sm" :
                    "border-border bg-card opacity-60 hover:opacity-80"
                  )}>
                  
                    <div
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
                      isChecked ? "border-primary bg-primary text-white" : "border-muted-foreground"
                    )}>
                    
                      {isChecked && <Check className="size-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-primary" />
                        <p className="text-sm font-semibold">{acc.label}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{acc.provider}</p>
                    </div>
                  </div>);

            })}
            </div>

            {/* Explicit Customer Agreement Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-primary/30 bg-primary/[0.04] p-4 text-xs">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-0.5 size-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-foreground leading-relaxed">
                <strong>Customer Declaration:</strong> I hereby grant explicit electronic consent to <strong>Mirae Asset Sharekhan (FIU)</strong> to request and fetch my financial records from the selected Financial Information Providers (FIPs) for PAN <strong>{pan}</strong> via the RBI-regulated Account Aggregator framework. I understand this consent is strictly for portfolio analysis and is revocable by me at any time.
              </span>
            </label>

            <div className="flex items-center justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-1.5 size-4" /> Back to PAN
              </Button>
              <Button
              size="lg"
              className="gap-2 bg-primary text-primary-foreground font-semibold"
              disabled={selectedConsents.length === 0 || !consentAgreed}
              onClick={() => setStep(3)}>
              
                Authorize Consent & Fetch via AA ({selectedConsents.length}) <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        }

        {/* STEP 3: Fetch Screen */}
        {step === 3 &&
        <div className="surface-card space-y-6 p-6 text-center sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="size-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Building Your WealthVerse…
              </h1>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Connecting with registered Financial Information Providers (FIPs) and aggregating verified records.
              </p>
            </div>

            <div className="mx-auto max-w-lg space-y-3 text-left">
              {FETCH_STEPS.map((s, index) => {
              const isComplete = index < fetchProgress;
              const isCurrent = index === fetchProgress;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-xs transition-all",
                    isComplete ?
                    "border-emerald-500/20 bg-emerald-500/5 text-emerald-950 dark:text-emerald-300" :
                    isCurrent ?
                    "border-primary/30 bg-primary/5 font-semibold text-foreground" :
                    "border-border/50 text-muted-foreground opacity-50"
                  )}>
                  
                    {isComplete ?
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" /> :
                  isCurrent ?
                  <Loader2 className="size-4 shrink-0 animate-spin text-primary" /> :

                  <span className="size-4 shrink-0 rounded-full border border-current opacity-30" />
                  }
                    <span className="truncate">{s.title}</span>
                  </div>);

            })}
            </div>
          </div>
        }

        {/* STEP 4: Profile Generation & Summary */}
        {step === 4 &&
        <div className="surface-card space-y-6 p-6 sm:p-10">
            <div className="space-y-2 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="size-3.5" /> 8 Accounts Aggregated Successfully
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Your WealthVerse Profile is Generated!
              </h1>
              <p className="text-sm text-muted-foreground">
                Here is a summary of the financial universe synthesized from your PAN.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Verified Assets</p>
                <p className="font-display mt-1 text-xl font-bold text-foreground">₹72.6 L</p>
                <p className="text-xs text-muted-foreground mt-1">Demat, Mutual Funds, EPF, FDs</p>
              </div>

              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Verified Liabilities</p>
                <p className="font-display mt-1 text-xl font-bold text-destructive">₹46.5 L</p>
                <p className="text-xs text-muted-foreground mt-1">Home Loan, Vehicle Loan</p>
              </div>

              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Net Worth Today</p>
                <p className="font-display mt-1 text-xl font-bold text-primary">₹26.1 L</p>
                <p className="text-xs text-muted-foreground mt-1">Ready for 360° optimization</p>
              </div>

              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Monthly Cashflow</p>
                <p className="font-display mt-1 text-xl font-bold text-foreground">₹2.5 L Inflow</p>
                <p className="text-xs text-muted-foreground mt-1">₹88,000 net surplus / month</p>
              </div>

              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Insurance Repositories</p>
                <p className="font-display mt-1 text-xl font-bold text-foreground">₹1.5 Cr Life</p>
                <p className="text-xs text-muted-foreground mt-1">₹10 L health floater active</p>
              </div>

              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Succession & Nominees</p>
                <p className="font-display mt-1 text-xl font-bold text-amber-600">3 of 5 Nominated</p>
                <p className="text-xs text-muted-foreground mt-1">Requires 2 nominee updates</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-1.5 size-4" /> Edit Consents
              </Button>
              <Button size="lg" className="gap-2 bg-primary" onClick={handleApplyAggregator}>
                Review & Confirm Profile <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        }
      </div>
    </AppShell>);

}