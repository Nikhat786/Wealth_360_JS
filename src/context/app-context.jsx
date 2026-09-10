import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from

"react";

import { coachReply } from "@/lib/coach";
import {
  clearActivePan,
  getActivePan,
  getJourney,
  saveJourney } from
"@/lib/journeys";
import {
  buildActions,
  defaultDocs,
  defaultNominations,
  nextBestAction,
  nominationSummary,
  noExtraCover,
  protectionScore,
  totalHealthCover,
  totalLifeCover,
  transferScore } from




"@/lib/derived";
import { projectGoal } from "@/lib/goal-math";
import {
  baseScoreInputs,
  idleCash,
  largestAssetSharePct,
  liabilities,
  taxSaving } from

"@/lib/mock-data";
import { computeScore } from "@/lib/score";
import {
  emptySim,
  financialDNA,
  readinessScore,
  simulate } from



"@/lib/wealth360";
import {
  generateWealthIntelligence } from



"@/lib/wealthverse-intelligence";


































































































































































export const defaultAnswers = {
  name: "Rahul Mehta",
  age: 36,
  mobile: "9820198201",
  email: "rahul.mehta@example.com",
  pan: "ABCDE1234F",
  gender: "Male",
  city: "Mumbai",
  maritalStatus: "Married",
  occupation: "Technology Professional",
  employer: "Technology company",
  annualIncome: 3000000,
  monthlyTakeHome: 250000,
  expectedIncomeGrowth: 8,
  retirementAge: 58,
  dependents: 3,
  familyMembers: [
  { id: "family-spouse", name: "Priya Mehta", relation: "Spouse", age: 34, dependency: "Partial", needs: "Family security" },
  { id: "family-child-1", name: "Aanya Mehta", relation: "Child", age: 7, dependency: "Full", needs: "Education", educationGoal: "Undergraduate", educationYear: 2034, educationCorpus: 800000 },
  { id: "family-child-2", name: "Kabir Mehta", relation: "Child", age: 3, dependency: "Full", needs: "Education", educationGoal: "School and university", educationYear: 2038, educationCorpus: 0 },
  { id: "family-parent", name: "Ramesh Mehta", relation: "Parent", age: 65, dependency: "Partial", needs: "Healthcare and financial security" }],

  familyPriorities: ["Education", "Financial security", "Retirement"],
  salary: 250000,
  businessIncome: 0,
  annualBonus: 0,
  rentalIncome: 20000,
  dividendsIncome: 0,
  interestIncome: 0,
  otherIncome: 10000,
  household: 45000,
  schoolFees: 15000,
  emiExpenses: 60000,
  insuranceExpenses: 8500,
  lifestyle: 6500,
  healthcareExpenses: 0,
  travelExpenses: 0,
  otherExpenses: 0,
  equity: 1158140,
  mutualFunds: 2963900,
  deposits: 553800,
  gold: 691200,
  retirementCorpus: 1930400,
  cashSavings: 418600,
  propertyValue: 11500000,
  assets: [
  { id: "demo-stocks", name: "Direct equity portfolio", type: "Stocks", investedValue: 890000, currentValue: 1158140, startDate: "2022-02-01", holdingPeriod: 3.2, actualReturn: 30, expectedReturn: 11, risk: "High", liquidity: "High", taxTreatment: "Equity LTCG", incomeGenerated: 0, linkedGoal: "Wealth Creation", ownership: "Self", details: { provider: "m.Stock" } },
  { id: "demo-mutual-funds", name: "Core mutual fund portfolio", type: "Mutual Funds", investedValue: 2400000, currentValue: 2963900, startDate: "2021-06-01", holdingPeriod: 4.5, actualReturn: 12.4, expectedReturn: 10, risk: "Moderate", liquidity: "High", taxTreatment: "Equity LTCG", incomeGenerated: 0, linkedGoal: "Retirement", ownership: "Self", details: { sip: 30000, xirr: 12.4 } },
  { id: "demo-fd", name: "Family fixed deposit", type: "FD/RD", investedValue: 650000, currentValue: 650000, startDate: "2025-01-01", holdingPeriod: 1.5, actualReturn: 7.1, expectedReturn: 7.1, risk: "Low", liquidity: "Medium", taxTreatment: "Interest taxable", incomeGenerated: 0, linkedGoal: "Emergency Fund", ownership: "Self", details: { maturityMonths: 18, maturityAmount: 720000 } },
  { id: "demo-gold", name: "Gold and SGB holdings", type: "Gold/SGB", investedValue: 520000, currentValue: 691200, startDate: "2021-01-01", holdingPeriod: 5, actualReturn: 8.2, expectedReturn: 8, risk: "Moderate", liquidity: "Medium", taxTreatment: "Capital gains", incomeGenerated: 0, linkedGoal: "Wealth Creation", ownership: "Family", details: {} },
  { id: "demo-retirement", name: "EPF and NPS", type: "EPF/PPF/NPS", investedValue: 1700000, currentValue: 1930400, startDate: "2019-04-01", holdingPeriod: 7, actualReturn: 8, expectedReturn: 8, risk: "Moderate", liquidity: "Low", taxTreatment: "Retirement instruments", incomeGenerated: 0, linkedGoal: "Retirement", ownership: "Self", details: { monthlyContribution: 10000 } },
  { id: "demo-property", name: "Mumbai family home", type: "Real Estate", investedValue: 8200000, currentValue: 11500000, startDate: "2018-01-01", holdingPeriod: 8, actualReturn: 5.3, expectedReturn: 6, risk: "Moderate", liquidity: "Low", taxTreatment: "Property", incomeGenerated: 25000, linkedGoal: "Family home", ownership: "Self", details: { outstandingLoan: 3800000 } }],

  homeLoanEmi: 42000,
  carLoanEmi: 18000,
  personalLoanEmi: 0,
  creditCardDues: 0,
  liabilities: [
  { id: "demo-home-loan", provider: "HDFC Bank", type: "Home Loan", originalAmount: 5500000, outstandingAmount: 3800000, interestRate: 8.4, emi: 42000, startDate: "2018-01-01", originalTenure: 20, remainingTenure: 11, endDate: "2037-01-01", rateType: "Floating", prepaymentOption: true, prepaymentPenalty: 0 },
  { id: "demo-car-loan", provider: "ICICI Bank", type: "Vehicle Loan", originalAmount: 1200000, outstandingAmount: 850000, interestRate: 9.2, emi: 18000, startDate: "2024-01-01", originalTenure: 7, remainingTenure: 4, endDate: "2029-01-01", rateType: "Floating", prepaymentOption: true, prepaymentPenalty: 2 },
  { id: "demo-card", provider: "HDFC Card", type: "Credit Card", originalAmount: 45000, outstandingAmount: 45000, interestRate: 36, emi: 5000, startDate: "2026-01-01", originalTenure: 1, remainingTenure: 1, endDate: "2026-12-01", rateType: "Fixed", prepaymentOption: true, prepaymentPenalty: 0 }],

  lifeCover: 15000000,
  healthCover: 700000,
  criticalIllnessCover: 0,
  insurancePolicies: [
  { id: "demo-life-policy", insurer: "Sample Life Insurer", type: "Life", sumAssured: 12000000, premium: 32000, term: 25, startDate: "2021-08-01", renewalDate: "2026-08-01", nominee: "Priya Mehta", coveredMembers: ["Rahul Mehta"] },
  { id: "demo-health-policy", insurer: "Sample Health Insurer", type: "Health", sumAssured: 1000000, premium: 28000, term: 1, startDate: "2026-01-01", renewalDate: "2027-01-01", nominee: "Rahul Mehta", coveredMembers: ["Rahul Mehta", "Priya Mehta", "Aanya Mehta", "Kabir Mehta"] },
  { id: "demo-accident-policy", insurer: "Sample Accident Insurer", type: "Personal Accident", sumAssured: 2500000, premium: 5000, term: 1, startDate: "2026-01-01", renewalDate: "2027-01-01", nominee: "Priya Mehta", coveredMembers: ["Rahul Mehta"] }],

  selectedGoals: ["retirement", "education", "home-upgrade", "emergency"],
  monthlyInvestment: 88000,
  goalDetails: {},
  goals: [
  { id: "demo-education-goal", name: "Child Education", icon: "education", saved: 800000, target: 3500000, targetYear: 2034, duration: 8, monthlyContribution: 15000, expectedReturn: 10, inflation: 6, priority: "High", linkedInvestments: ["demo-mutual-funds"], fundingSource: "Monthly SIP", note: "Undergraduate fees, assumed 8% education inflation." },
  { id: "demo-retirement-goal", name: "Retirement", icon: "retirement", saved: 1930400, target: 40000000, targetYear: 2050, duration: 24, monthlyContribution: 20000, expectedReturn: 10, inflation: 6, priority: "High", linkedInvestments: ["demo-retirement", "demo-mutual-funds"], fundingSource: "EPF and SIP", note: "EPF, NPS and equity SIPs all feed this goal." },
  { id: "demo-travel-goal", name: "Travel", icon: "travel", saved: 200000, target: 800000, targetYear: 2028, duration: 2, monthlyContribution: 12000, expectedReturn: 7, inflation: 5, priority: "Medium", linkedInvestments: ["demo-fd"], fundingSource: "Monthly savings", note: "Three weeks with the family." },
  { id: "demo-emergency-goal", name: "Emergency Fund", icon: "shield", saved: 450000, target: 800000, targetYear: 2027, duration: 1, monthlyContribution: 6600, expectedReturn: 5, inflation: 5, priority: "High", linkedInvestments: ["demo-fd"], fundingSource: "Cash and FD", note: "Parked in a liquid fund for instant access." }],

  nomineesOnRecord: "some",
  hasWill: false,
  riskProfileCompleted: false,
  riskAppetite: 7,
  horizon: 15,
  reactionToDrop: "buy",
  liquidityPreference: "Medium",
  preferredAssetClasses: ["Mutual Funds", "Stocks", "Retirement/Pension"],
  lifeEvents: ["Retirement"],
  futureEvents: [{ id: "event-retirement", event: "Retirement", year: 2050, estimatedCost: 25000000, importance: "High" }]
};

export function derivedIncome(a) {
  return (
    a.salary +
    a.businessIncome +
    a.annualBonus / 12 +
    a.rentalIncome +
    a.dividendsIncome +
    a.interestIncome +
    a.otherIncome);

}
export function derivedExpenses(a) {
  return (
    a.household +
    a.schoolFees +
    a.emiExpenses +
    a.insuranceExpenses +
    a.lifestyle +
    a.healthcareExpenses +
    a.travelExpenses +
    a.otherExpenses);

}
export function derivedEmi(a) {
  return a.homeLoanEmi + a.carLoanEmi + a.personalLoanEmi;
}
export function derivedAssets(a) {
  return (
    a.equity + a.mutualFunds + a.deposits + a.gold + a.retirementCorpus + a.cashSavings);

}

















































































































































export function synthesizeAAProfile(baseAnswers) {
  const name = baseAnswers?.name || "Rahul Mehta";
  const age = baseAnswers?.age || 36;
  const mobile = baseAnswers?.mobile || "9820198201";
  const email = baseAnswers?.email || "rahul.mehta@example.com";
  const pan = baseAnswers?.pan || "ABCDE1234F";

  return {
    ...defaultAnswers,
    name,
    age,
    mobile,
    email,
    pan,
    // Account Aggregator can surface holdings, loans & policies, but not income or
    // goals — those aren't held by any FIP, so they're left at 0 for manual entry.
    annualIncome: 0,
    monthlyTakeHome: 0,
    salary: 0,
    businessIncome: 0,
    annualBonus: 0,
    rentalIncome: 0,
    dividendsIncome: 0,
    interestIncome: 0,
    otherIncome: 0,
    household: 45000,
    schoolFees: 15000,
    emiExpenses: 60000,
    insuranceExpenses: 8500,
    lifestyle: 6500,
    healthcareExpenses: 4000,
    travelExpenses: 10000,
    otherExpenses: 5000,
    equity: 1158140,
    mutualFunds: 2963900,
    deposits: 850000,
    gold: 520000,
    retirementCorpus: 1850000,
    cashSavings: 350000,
    propertyValue: 6500000,
    homeLoanEmi: 45000,
    carLoanEmi: 15000,
    personalLoanEmi: 0,
    creditCardDues: 28000,
    lifeCover: 15000000,
    healthCover: 2500000,
    criticalIllnessCover: 1000000,
    nomineesOnRecord: "all",
    hasWill: true,
    riskAppetite: 7,
    horizon: 15,
    reactionToDrop: "buy",
    liquidityPreference: "Medium",
    preferredAssetClasses: ["Equity", "Mutual Funds", "Real Estate", "Gold", "EPF"],
    lifeEvents: ["Children Education", "Retirement", "Home Upgrade"],
    monthlyInvestment: 88000,
    expectedIncomeGrowth: 8,
    retirementAge: 58,
    dependents: 3,
    familyMembers: defaultAnswers.familyMembers,
    familyPriorities: defaultAnswers.familyPriorities,
    // Goals are personal aspirations, not FIP-held data — start empty and add manually.
    selectedGoals: [],
    goalDetails: {},
    assets: [
    {
      id: "asset-aa-1",
      name: "HDFC Bank & ICICI Bank Savings",
      type: "Cash & Savings",
      investedValue: 350000,
      currentValue: 350000,
      startDate: "2018-04-01",
      holdingPeriod: 6,
      actualReturn: 3.5,
      expectedReturn: 3.5,
      risk: "Low",
      liquidity: "High",
      taxTreatment: "Interest taxable above ₹10k (80TTA)",
      incomeGenerated: 12250,
      linkedGoal: "Emergency Fund",
      ownership: "Self",
      details: { bank: "HDFC & ICICI", ifsc: "HDFC0000123" }
    },
    {
      id: "asset-aa-2",
      name: "Zerodha Equity Portfolio (Large & Midcap)",
      type: "Stocks",
      investedValue: 820000,
      currentValue: 1158140,
      startDate: "2019-06-15",
      holdingPeriod: 5,
      actualReturn: 14.8,
      expectedReturn: 12.0,
      risk: "High",
      liquidity: "High",
      taxTreatment: "LTCG 12.5% over ₹1.25L",
      incomeGenerated: 14500,
      linkedGoal: "Retirement",
      ownership: "Self",
      details: { depository: "CDSL", broker: "Zerodha" }
    },
    {
      id: "asset-aa-3",
      name: "CAMS Verified Mutual Funds (Flexi-cap & Large-cap)",
      type: "Mutual Funds",
      investedValue: 2150000,
      currentValue: 2963900,
      startDate: "2017-09-10",
      holdingPeriod: 7,
      actualReturn: 13.6,
      expectedReturn: 12.0,
      risk: "Moderate",
      liquidity: "High",
      taxTreatment: "Equity LTCG 12.5%",
      incomeGenerated: 0,
      linkedGoal: "Aarav's Education",
      ownership: "Self",
      details: { rta: "CAMS & KFintech", folios: "5 Folios Active" }
    },
    {
      id: "asset-aa-4",
      name: "SBI Scheduled Fixed Deposits",
      type: "FD/RD",
      investedValue: 800000,
      currentValue: 850000,
      startDate: "2023-01-10",
      holdingPeriod: 1.5,
      actualReturn: 7.1,
      expectedReturn: 7.1,
      risk: "Low",
      liquidity: "Medium",
      taxTreatment: "Taxable at slab rate",
      incomeGenerated: 60350,
      linkedGoal: "Emergency Fund",
      ownership: "Joint with Spouse",
      details: { bank: "State Bank of India", tenure: "3 Years" }
    },
    {
      id: "asset-aa-5",
      name: "EPFO UAN PF Passbook & PPF",
      type: "EPF/PPF/NPS",
      investedValue: 1400000,
      currentValue: 1850000,
      startDate: "2015-08-01",
      holdingPeriod: 9,
      actualReturn: 8.25,
      expectedReturn: 8.25,
      risk: "Low",
      liquidity: "Low",
      taxTreatment: "EEE (Exempt-Exempt-Exempt)",
      incomeGenerated: 0,
      linkedGoal: "Retirement",
      ownership: "Self",
      details: { uan: "100982347101", authority: "EPFO" }
    },
    {
      id: "asset-aa-6",
      name: "Sovereign Gold Bonds & Digital Gold",
      type: "Gold/SGB",
      investedValue: 380000,
      currentValue: 520000,
      startDate: "2020-11-20",
      holdingPeriod: 4,
      actualReturn: 11.2,
      expectedReturn: 9.0,
      risk: "Low",
      liquidity: "Medium",
      taxTreatment: "Tax free on RBI redemption",
      incomeGenerated: 9500,
      linkedGoal: "Wealth Creation",
      ownership: "Self",
      details: { tranche: "2020-21 Series VIII" }
    },
    {
      id: "asset-aa-7",
      name: "Primary Residential Property (Mumbai Suburbs)",
      type: "Real Estate",
      investedValue: 5200000,
      currentValue: 6500000,
      startDate: "2019-02-15",
      holdingPeriod: 5.5,
      actualReturn: 4.8,
      expectedReturn: 6.0,
      risk: "Moderate",
      liquidity: "Low",
      taxTreatment: "Section 54 exemption on reinvestment",
      incomeGenerated: 0,
      linkedGoal: "Home",
      ownership: "Joint with Spouse",
      details: { registration: "Maharashtra IGR Recorded" }
    }],

    liabilities: [
    {
      id: "liab-aa-1",
      provider: "HDFC Bank",
      type: "Home Loan",
      originalAmount: 5000000,
      outstandingAmount: 4200000,
      interestRate: 8.4,
      emi: 45000,
      startDate: "2019-03-01",
      originalTenure: 20,
      remainingTenure: 14.5,
      endDate: "2039-03-01",
      rateType: "Floating",
      prepaymentOption: true,
      prepaymentPenalty: 0
    },
    {
      id: "liab-aa-2",
      provider: "ICICI Bank",
      type: "Vehicle Loan",
      originalAmount: 850000,
      outstandingAmount: 450000,
      interestRate: 8.9,
      emi: 15000,
      startDate: "2022-08-15",
      originalTenure: 5,
      remainingTenure: 2.8,
      endDate: "2027-08-15",
      rateType: "Fixed",
      prepaymentOption: true,
      prepaymentPenalty: 0
    },
    {
      id: "liab-aa-3",
      provider: "Axis Bank Magnus",
      type: "Credit Card",
      originalAmount: 28000,
      outstandingAmount: 28000,
      interestRate: 42.0,
      emi: 28000,
      startDate: "2024-08-01",
      originalTenure: 0.1,
      remainingTenure: 0.1,
      endDate: "2024-09-20",
      rateType: "Fixed",
      prepaymentOption: true,
      prepaymentPenalty: 0
    }],

    insurancePolicies: [
    {
      id: "pol-aa-1",
      insurer: "HDFC Life Click 2 Protect 3D Plus",
      type: "Life",
      sumAssured: 15000000,
      premium: 22000,
      term: 35,
      startDate: "2018-05-10",
      renewalDate: "2027-05-10",
      nominee: "Priya Mehta (Spouse - 100%)",
      coveredMembers: ["Self"]
    },
    {
      id: "pol-aa-2",
      insurer: "Care Health Supreme Floater",
      type: "Health",
      sumAssured: 2500000,
      premium: 26500,
      term: 1,
      startDate: "2020-07-01",
      renewalDate: "2027-07-01",
      nominee: "Priya Mehta",
      coveredMembers: ["Self", "Priya Mehta", "Aanya Mehta", "Kabir Mehta"]
    }],

    goals: [],

    futureEvents: [
    {
      id: "event-aa-1",
      event: "Children Higher Education Abroad",
      year: 2035,
      estimatedCost: 8000000,
      importance: "High"
    },
    {
      id: "event-aa-2",
      event: "Retirement",
      year: 2048,
      estimatedCost: 30000000,
      importance: "High"
    }]

  };
}

const AppContext = createContext(null);

let messageId = 0;
const nextId = () => `m${++messageId}`;

export function AppProvider({ children }) {
  const [onboardingStatus, setOnboardingStatus] = useState(

    () => {
      if (typeof window === "undefined") return "not_started";
      const savedJourney = getJourney(getActivePan());
      if (savedJourney?.onboardingStatus) return savedJourney.onboardingStatus;
      const stored = window.localStorage.getItem("wealth360-onboarding-status");
      return stored === "completed" || stored === "in_progress" ? stored : "not_started";
    });
  const onboardingComplete = onboardingStatus === "completed";
  const [answers, setAnswers] = useState(() => {
    if (typeof window === "undefined") return defaultAnswers;
    const savedJourney = getJourney(getActivePan());
    if (!savedJourney) return defaultAnswers;
    const { onboardingStatus: _status, updatedAt: _updatedAt, ...rest } = savedJourney;
    return { ...defaultAnswers, ...rest };
  });
  const [whatIf, setWhatIfState] = useState({});
  const [contributions, setContributions] = useState(() =>
  Object.fromEntries((answers.goals || []).map((g) => [g.id, g.monthlyContribution]))
  );
  const [messages, setMessages] = useState([]);
  const [booking, setBooking] = useState(null);
  const [rmOpen, setRmOpen] = useState(false);
  const [stressMode, setStressMode] = useState(false);

  const [cover, setCover] = useState(noExtraCover);
  const [nominations, setNominations] = useState(defaultNominations);
  const [docs, setDocs] = useState(defaultDocs);
  const [extraSip, setExtraSip] = useState(0);
  const [sipPlan, setSipPlanState] = useState({
    monthly: 88000,
    years: 15,
    expectedReturn: 12,
    stepUp: 8
  });
  const [clearedLoans, setClearedLoans] = useState([]);
  const [taxTopUp, setTaxTopUp] = useState(0);
  const [idleMoved, setIdleMoved] = useState(0);
  const [dismissedActions, setDismissedActions] = useState([]);
  const [riskProfile, setRiskProfile] = useState("Moderate");
  const [sim, setSimState] = useState(emptySim);
  const [analysisSeen, setAnalysisSeen] = useState(false);

  // WealthVerse states
  const [subscriptionTier, setSubscriptionTierState] = useState("Basic");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("wealthverse-subscription-tier");
      if (saved && (saved === "Basic" || saved === "Premium" || saved === "Elite" || saved === "Enterprise")) {
        setSubscriptionTierState(saved);
      }
    }
  }, []);

  const setSubscriptionTier = useCallback((tier) => {
    setSubscriptionTierState(tier);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wealthverse-subscription-tier", tier);
    }
  }, []);

  // RM (Relationship Manager) staff session — separate from the client's own session.
  // Gates internal-only screens (business/revenue model, RM dashboard) that clients must never see.
  const [isRmSession, setIsRmSession] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("wealth360-rm-session") === "true";
  });

  const loginAsRm = useCallback(() => {
    setIsRmSession(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wealth360-rm-session", "true");
    }
  }, []);

  const logoutRm = useCallback(() => {
    setIsRmSession(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("wealth360-rm-session");
    }
  }, []);

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("Premium Feature");
  const [upgradeRecommendedPlan, setUpgradeRecommendedPlan] = useState("Premium");

  const triggerUpgradeModal = useCallback((feature, recommendedPlan = "Premium") => {
    setUpgradeFeature(feature);
    setUpgradeRecommendedPlan(recommendedPlan);
    setUpgradeModalOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModalOpen(false);
  }, []);

  const canAccessAA = true;
  const canAccessRM = subscriptionTier !== "Basic";
  const rmType =
  subscriptionTier === "Basic" ? "none" :
  subscriptionTier === "Premium" ? "shared" :
  subscriptionTier === "Elite" ? "dedicated" : "wealth_desk";
  const canAccessEstatePlanning = subscriptionTier === "Elite" || subscriptionTier === "Enterprise";
  const canAccessAdvancedVault = subscriptionTier === "Elite" || subscriptionTier === "Enterprise";

  const [accountAggregatorStatus, setAccountAggregatorStatus] =
  useState("not_connected");
  const [plannedLifeEvents, setPlannedLifeEvents] = useState([
  "event-child",
  "event-home"]
  );

  useEffect(() => {
    window.localStorage.setItem("wealth360-onboarding-status", onboardingStatus);
  }, [onboardingStatus]);

  // Persist the in-progress/completed journey under its PAN so it survives
  // reloads and can be looked back up by that PAN later.
  useEffect(() => {
    if (onboardingStatus === "not_started") return;
    if (!answers?.pan) return;
    saveJourney(answers.pan, answers, onboardingStatus);
  }, [answers, onboardingStatus]);

  const goals = useMemo(
    () =>
    (answers.goals || []).map((g) => ({
      ...g,
      monthlyContribution: contributions[g.id] ?? g.monthlyContribution
    })),
    [answers.goals, contributions]
  );

  const projections = useMemo(
    () => goals.map((g) => ({ goal: g, p: projectGoal(g, g.monthlyContribution) })),
    [goals]
  );

  const goalsOffTrack = projections.filter((x) => !x.p.onTrack).length;
  const goalsShortfall = projections.reduce((s, x) => s + Math.max(0, x.p.gap), 0);

  const emiTotal = useMemo(() => {
    const cleared = liabilities.
    filter((l) => clearedLoans.includes(l.id)).
    reduce((s, l) => s + l.emi, 0);
    return Math.max(0, derivedEmi(answers) - cleared);
  }, [answers, clearedLoans]);

  const emergencyMonths = useMemo(() => {
    const expenses = derivedExpenses(answers);
    return expenses > 0 ? (answers.cashSavings + idleMoved * 0) / expenses : 0;
  }, [answers, idleMoved]);

  const scoreInputs = useMemo(() => {
    const income = derivedIncome(answers);
    const expenses = derivedExpenses(answers);
    const onTrack = projections.length > 0 ?
    projections.filter((x) => x.p.onTrack).length / projections.length * 100 :
    100;
    const funded = goals.length > 0 ?
    goals.reduce((s, g) => s + Math.min(1, g.target > 0 ? g.saved / g.target : 1), 0) / goals.length * 100 :
    100;
    return {
      ...baseScoreInputs,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      monthlyInvestment: answers.monthlyInvestment + extraSip,
      monthlyEmi: emiTotal,
      emergencyMonths,
      lifeCoverMultiple: income > 0 ? totalLifeCover(cover) / (income * 12) : 0,
      healthCover: totalHealthCover(cover),
      largestAssetSharePct,
      goalFundedPct: funded,
      goalsOnTrackPct: onTrack
    };
  }, [answers, cover, emergencyMonths, emiTotal, extraSip, goals, projections]);

  const score = useMemo(() => computeScore(scoreInputs), [scoreInputs]);

  const whatIfScore = useMemo(
    () => computeScore({ ...scoreInputs, ...whatIf }),
    [scoreInputs, whatIf]
  );

  const nominations_summary = useMemo(() => nominationSummary(nominations), [nominations]);
  const transferReadiness = useMemo(() => transferScore(nominations, docs), [nominations, docs]);
  const protection = useMemo(() => protectionScore(cover), [cover]);

  const taxHeadroom = useMemo(() => {
    const raw =
    taxSaving.section80cLimit -
    taxSaving.section80cUsed + (
    taxSaving.nps80ccdLimit - taxSaving.nps80ccdUsed) + (
    taxSaving.healthPremium80dLimit - taxSaving.healthPremium80dUsed);
    return Math.max(0, raw - taxTopUp);
  }, [taxTopUp]);

  const idleSurplus = Math.max(
    0,
    idleCash.savingsBalance - idleCash.idealBalance - idleMoved
  );

  const actions = useMemo(
    () =>
    buildActions({
      cover,
      nominations,
      docs,
      emergencyMonths,
      emiRatioPct: emiTotal / Math.max(1, derivedIncome(answers)) * 100,
      goalsOffTrack,
      extraSip,
      largestAssetSharePct,
      taxHeadroom,
      idleSurplus
    }),
    [
    answers,
    cover,
    docs,
    emergencyMonths,
    emiTotal,
    extraSip,
    goalsOffTrack,
    idleSurplus,
    nominations,
    taxHeadroom]

  );

  const nextAction = useMemo(() => nextBestAction(actions), [actions]);

  const wealthReadiness = useMemo(() => readinessScore(goals), [goals]);
  const wealthContinuity = transferReadiness;

  const simResult = useMemo(
    () =>
    simulate(sim, {
      surplus: derivedIncome(answers) - derivedExpenses(answers),
      goalsOnTrack: goals.length - goalsOffTrack,
      goalsTotal: goals.length
    }),
    [answers, goals.length, goalsOffTrack, sim]
  );

  const dna = useMemo(
    () =>
    financialDNA({
      savingsRate:
      (derivedIncome(answers) - derivedExpenses(answers)) /
      Math.max(1, derivedIncome(answers)) *
      100,
      protection,
      emergencyMonths,
      emiRatio: emiTotal / Math.max(1, derivedIncome(answers)) * 100,
      riskAppetite: answers.riskAppetite,
      goalsOnTrackPct: (goals.length - goalsOffTrack) / Math.max(1, goals.length) * 100
    }),
    [answers, emergencyMonths, emiTotal, goals.length, goalsOffTrack, protection]
  );

  const totalAssetsVal = useMemo(() => derivedAssets(answers), [answers]);
  const totalLiabVal = useMemo(
    () => answers.liabilities.reduce((s, l) => s + l.outstandingAmount, 0),
    [answers.liabilities]
  );

  const sheruIntelligence = useMemo(
    () =>
    generateWealthIntelligence({
      answers,
      score,
      goals,
      goalsOffTrack,
      goalsShortfall,
      protectionScore: protection,
      transferScore: transferReadiness,
      subscriptionTier,
      totalAssets: totalAssetsVal,
      totalLiabilities: totalLiabVal,
      netWorth: totalAssetsVal - totalLiabVal,
      monthlySurplus: derivedIncome(answers) - derivedExpenses(answers),
      emergencyMonths,
      taxHeadroom,
      unnominatedCount: nominations_summary.missing.length,
      unnominatedValue: nominations_summary.totalValue - nominations_summary.coveredValue
    }),
    [
    answers,
    subscriptionTier,
    emergencyMonths,
    goals,
    goalsOffTrack,
    goalsShortfall,
    nominations_summary,
    protection,
    score,
    taxHeadroom,
    totalAssetsVal,
    totalLiabVal,
    transferReadiness]

  );

  const sheruAdvisory = sheruIntelligence.advisoryItems;
  const focusArea = sheruIntelligence.focusArea;
  const focusDescription = sheruIntelligence.focusDescription;
  const dynamicPriorities = sheruIntelligence.dynamicPriorities;
  const wealthInsights = sheruIntelligence.wealthInsights;
  const nextBestActions = sheruIntelligence.nextBestActions;
  const dashboardRecommendations = sheruIntelligence.dashboardRecommendations;

  const startOnboarding = useCallback(() => setOnboardingStatus("in_progress"), []);

  const connectAccountAggregator = useCallback(
    (customData) => {
      setAccountAggregatorStatus("connected");
      setOnboardingStatus("completed");
      if (customData) {
        setAnswers((prev) => ({ ...prev, ...customData }));
      }
    },
    []
  );

  const addGoal = useCallback((goal) => {
    const record = { ...goal, id: goal.id || `goal-${Date.now()}` };
    setAnswers((prev) => ({ ...prev, goals: [...(prev.goals || []), record] }));
    return record.id;
  }, []);

  const updateGoal = useCallback((goalId, patch) => {
    setAnswers((prev) => ({
      ...prev,
      goals: (prev.goals || []).map((g) => g.id === goalId ? { ...g, ...patch } : g)
    }));
  }, []);

  const removeGoal = useCallback((goalId) => {
    setAnswers((prev) => ({ ...prev, goals: (prev.goals || []).filter((g) => g.id !== goalId) }));
    setContributions((prev) => {
      const next = { ...prev };
      delete next[goalId];
      return next;
    });
  }, []);

  const addFutureEvent = useCallback((event) => {
    const record = { ...event, id: event.id || `event-${Date.now()}` };
    setAnswers((prev) => ({
      ...prev,
      futureEvents: [...(prev.futureEvents || []), record],
      lifeEvents: [...new Set([...(prev.lifeEvents || []), record.event])]
    }));
    return record.id;
  }, []);

  const updateFutureEvent = useCallback((eventId, patch) => {
    setAnswers((prev) => ({
      ...prev,
      futureEvents: (prev.futureEvents || []).map((e) => e.id === eventId ? { ...e, ...patch } : e)
    }));
  }, []);

  const removeFutureEvent = useCallback((eventId) => {
    setAnswers((prev) => ({ ...prev, futureEvents: (prev.futureEvents || []).filter((e) => e.id !== eventId) }));
  }, []);

  const updateRiskProfile = useCallback((patch) => {
    setAnswers((prev) => ({ ...prev, ...patch, riskProfileCompleted: true }));
  }, []);

  const dismissRiskPrompt = useCallback(() => {
    setAnswers((prev) => ({ ...prev, riskProfileCompleted: true }));
  }, []);

  const togglePlannedLifeEvent = useCallback((eventId) => {
    setPlannedLifeEvents((prev) =>
    prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  }, []);

  const setWhatIf = useCallback((patch) => {
    setWhatIfState((prev) => ({ ...prev, ...patch }));
  }, []);

  const coachContext = useMemo(
    () => ({
      score: score.total,
      grade: score.grade,
      pillars: score.pillars,
      lifeCover: totalLifeCover(cover),
      healthCover: totalHealthCover(cover),
      criticalIllness: cover.criticalIllness,
      protection,
      transferReadiness,
      nomineesMissing: nominations_summary.missing.map((a) => a.name),
      unnominatedValue: nominations_summary.totalValue - nominations_summary.coveredValue,
      monthlySip: answers.monthlyInvestment + extraSip,
      monthlyIncome: derivedIncome(answers),
      monthlyExpenses: derivedExpenses(answers),
      monthlyEmi: emiTotal,
      emergencyMonths,
      goalsOffTrack,
      goalsShortfall,
      taxHeadroom,
      idleSurplus,
      topAction: actions[0]?.title ?? null,
      netWorth: totalAssetsVal - totalLiabVal
    }),
    [
    actions,
    answers,
    cover,
    emergencyMonths,
    emiTotal,
    extraSip,
    goalsOffTrack,
    goalsShortfall,
    idleSurplus,
    nominations_summary,
    protection,
    score,
    taxHeadroom,
    transferReadiness,
    totalAssetsVal,
    totalLiabVal]

  );

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const reply = coachReply(trimmed, coachContext);
      setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: trimmed },
      {
        id: nextId(),
        role: "assistant",
        text: reply.text,
        ...(reply.bullets ? { bullets: reply.bullets } : {}),
        ...(reply.followUps ? { followUps: reply.followUps } : {})
      }]
      );
    },
    [coachContext]
  );

  const value = {
    onboardingStatus,
    onboardingComplete,
    answers,
    startOnboarding,
    saveOnboardingDraft: (a) => {
      setAnswers(a);
      setOnboardingStatus("in_progress");
    },
    completeOnboarding: (a) => {
      setAnswers(a);
      setCover((c) => ({ ...c, criticalIllness: a.criticalIllnessCover }));
      setOnboardingStatus("completed");
    },
    resetOnboarding: () => {
      setAnswers(defaultAnswers);
      setOnboardingStatus("not_started");
      clearActivePan();
    },
    scoreInputs,
    score,
    whatIf,
    setWhatIf,
    resetWhatIf: () => setWhatIfState({}),
    whatIfScore,
    whatIfActive: Object.keys(whatIf).length > 0,
    goals,
    addGoal,
    updateGoal,
    removeGoal,
    futureEvents: answers.futureEvents || [],
    addFutureEvent,
    updateFutureEvent,
    removeFutureEvent,
    updateRiskProfile,
    dismissRiskPrompt,
    contributions,
    setContribution: (goalId, amount) =>
    setContributions((prev) => ({ ...prev, [goalId]: amount })),
    resetContributions: () =>
    setContributions(Object.fromEntries((answers.goals || []).map((g) => [g.id, g.monthlyContribution]))),
    goalsOffTrack,
    goalsShortfall,
    projections,

    cover,
    addLifeCover: (amount) => setCover((c) => ({ ...c, extraLife: c.extraLife + amount })),
    addHealthCover: (amount) => setCover((c) => ({ ...c, extraHealth: c.extraHealth + amount })),
    addCriticalIllness: (amount) =>
    setCover((c) => ({ ...c, criticalIllness: c.criticalIllness + amount })),
    resetCover: () => setCover(noExtraCover),
    lifeCover: totalLifeCover(cover),
    healthCover: totalHealthCover(cover),
    protection,

    nominations,
    setNominee: (accountId, nominee) =>
    setNominations((prev) => ({ ...prev, [accountId]: nominee })),
    docs,
    toggleDoc: (docId) => setDocs((prev) => ({ ...prev, [docId]: !prev[docId] })),
    nominations_summary,
    transferReadiness,

    extraSip,
    setExtraSip,
    sipPlan,
    setSipPlan: (patch) => setSipPlanState((prev) => ({ ...prev, ...patch })),
    clearedLoans,
    toggleClearedLoan: (loanId) =>
    setClearedLoans((prev) =>
    prev.includes(loanId) ? prev.filter((id) => id !== loanId) : [...prev, loanId]
    ),
    taxTopUp,
    setTaxTopUp,
    idleMoved,
    setIdleMoved,

    actions,
    nextAction,
    dismissedActions,
    dismissAction: (id) =>
    setDismissedActions((prev) => prev.includes(id) ? prev : [...prev, id]),
    restoreActions: () => setDismissedActions([]),

    riskProfile,
    setRiskProfile,
    wealthReadiness,
    wealthContinuity,
    sim,
    setSim: (patch) => setSimState((prev) => ({ ...prev, ...patch })),
    resetSim: () => setSimState(emptySim),
    simResult,
    dna,
    analysisSeen,
    markAnalysisSeen: () => setAnalysisSeen(true),

    messages,
    sendMessage,
    clearChat: () => setMessages([]),
    booking,
    setBooking,
    rmOpen,
    setRmOpen,
    stressMode,
    setStressMode,

    // WealthVerse extensions
    subscriptionTier,
    setSubscriptionTier,
    isRmSession,
    loginAsRm,
    logoutRm,
    accountAggregatorStatus,
    setAccountAggregatorStatus,
    connectAccountAggregator,
    plannedLifeEvents,
    togglePlannedLifeEvent,
    sheruIntelligence,
    sheruAdvisory,

    // Subscription gating & upgrade modal
    canAccessAA,
    canAccessRM,
    rmType,
    canAccessEstatePlanning,
    canAccessAdvancedVault,
    upgradeModalOpen,
    upgradeFeature,
    upgradeRecommendedPlan,
    triggerUpgradeModal,
    closeUpgradeModal,

    // Dynamic & Adaptive Wealth Engine
    focusArea,
    focusDescription,
    dynamicPriorities,
    wealthInsights,
    nextBestActions,
    dashboardRecommendations,
    synthesizeAAProfile,
    totalAssets: totalAssetsVal,
    totalLiabilities: totalLiabVal,
    netWorth: totalAssetsVal - totalLiabVal
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}