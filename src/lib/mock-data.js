

































export const user = {
  name: "Rahul Sharma",
  firstName: "Rahul",
  age: 34,
  city: "Mumbai",
  occupation: "Product Manager, fintech",
  clientSince: "Aug 2021",
  clientId: "MS-4471902",
  email: "rahul.sharma@example.com",
  phone: "+91 98200 41172",
  riskProfile: "Moderately Aggressive",
  panMasked: "AXXPS1234K",
  kyc: [
    { label: "PAN verified", status: "Verified", date: "12 Aug 2021" },
    { label: "Aadhaar e-KYC", status: "Verified", date: "12 Aug 2021" },
    { label: "Bank mandate", status: "Verified", date: "14 Aug 2021" },
    { label: "Nominee details", status: "Pending", date: "Action needed" },
    { label: "FATCA declaration", status: "Verified", date: "03 Jan 2024" }]

};

export const rm = {
  name: "Priya Menon",
  title: "Senior Relationship Manager",
  branch: "Mirae Asset Wealth Desk, Nariman Point",
  experience: "11 years",
  clients: 128,
  languages: ["English", "Hindi", "Marathi"],
  phone: "+91 22 6136 2200",
  email: "priya.menon@mstock.example",
  rating: 4.8,
  initials: "PM"
};

export const rmSlots = [
  "Today, 4:30 PM",
  "Today, 6:00 PM",
  "Tomorrow, 11:00 AM",
  "Tomorrow, 3:15 PM",
  "Fri, 10:30 AM",
  "Fri, 5:45 PM"];


export const rmTopics = [
  "Improve my Wealth360 score",
  "Review my mutual fund portfolio",
  "Plan Aarav's education goal",
  "Tax saving before March",
  "Insurance gap review",
  "Something else"];


export const holdings = [
  {
    id: "h1",
    name: "HDFC Bank",
    category: "Equity",
    subtitle: "NSE · 210 shares",
    invested: 289800,
    current: 356510,
    units: 210,
    xirr: 14.2
  },
  {
    id: "h2",
    name: "Infosys",
    category: "Equity",
    subtitle: "NSE · 180 shares",
    invested: 241200,
    current: 279540,
    units: 180,
    xirr: 11.4
  },
  {
    id: "h3",
    name: "Tata Motors",
    category: "Equity",
    subtitle: "NSE · 260 shares",
    invested: 176800,
    current: 253240,
    units: 260,
    xirr: 21.8
  },
  {
    id: "h4",
    name: "Reliance Industries",
    category: "Equity",
    subtitle: "NSE · 95 shares",
    invested: 234650,
    current: 268850,
    units: 95,
    xirr: 9.6
  },
  {
    id: "h5",
    name: "Parag Parikh Flexi Cap",
    category: "Mutual Funds",
    subtitle: "SIP ₹20,000/mo · Direct Growth",
    invested: 960000,
    current: 1348200,
    xirr: 18.4
  },
  {
    id: "h6",
    name: "Mirae Asset Large Cap",
    category: "Mutual Funds",
    subtitle: "SIP ₹12,000/mo · Direct Growth",
    invested: 576000,
    current: 712400,
    xirr: 13.1
  },
  {
    id: "h7",
    name: "Nippon India Small Cap",
    category: "Mutual Funds",
    subtitle: "SIP ₹8,000/mo · Direct Growth",
    invested: 384000,
    current: 561600,
    xirr: 24.6
  },
  {
    id: "h8",
    name: "ICICI Pru Corporate Bond",
    category: "Mutual Funds",
    subtitle: "Lump sum · Direct Growth",
    invested: 300000,
    current: 341700,
    xirr: 7.4
  },
  {
    id: "h9",
    name: "HDFC Bank FD",
    category: "Fixed Deposits",
    subtitle: "7.1% · matures Mar 2027",
    invested: 500000,
    current: 553800,
    xirr: 7.1
  },
  {
    id: "h10",
    name: "Sovereign Gold Bond 2029",
    category: "Gold",
    subtitle: "120 g · Series VII",
    invested: 528000,
    current: 691200,
    units: 120,
    xirr: 12.9
  },
  {
    id: "h11",
    name: "EPF corpus",
    category: "EPF & NPS",
    subtitle: "Employer + employee · 8.25%",
    invested: 1180000,
    current: 1418000,
    xirr: 8.25
  },
  {
    id: "h12",
    name: "NPS Tier I",
    category: "EPF & NPS",
    subtitle: "Aggressive lifecycle fund",
    invested: 420000,
    current: 512400,
    xirr: 11.2
  },
  {
    id: "h13",
    name: "Savings + liquid fund",
    category: "Cash",
    subtitle: "Emergency buffer",
    invested: 410000,
    current: 418600,
    xirr: 5.8
  }];


export const liabilities = [
  {
    id: "l1",
    name: "Home loan",
    lender: "HDFC Ltd",
    outstanding: 4260000,
    emi: 42800,
    rate: 8.6,
    tenureLeft: "14 yr 2 mo"
  },
  {
    id: "l2",
    name: "Car loan",
    lender: "Kotak Mahindra",
    outstanding: 385000,
    emi: 14200,
    rate: 9.4,
    tenureLeft: "2 yr 5 mo"
  }];


export const netWorthHistory = [
  { month: "Sep 24", assets: 5480000, liabilities: 4980000 },
  { month: "Oct 24", assets: 5612000, liabilities: 4932000 },
  { month: "Nov 24", assets: 5744000, liabilities: 4884000 },
  { month: "Dec 24", assets: 5901000, liabilities: 4835000 },
  { month: "Jan 25", assets: 6042000, liabilities: 4786000 },
  { month: "Feb 25", assets: 6188000, liabilities: 4736000 },
  { month: "Mar 25", assets: 6355000, liabilities: 4686000 },
  { month: "Apr 25", assets: 6498000, liabilities: 4635000 },
  { month: "May 25", assets: 6641000, liabilities: 4584000 },
  { month: "Jun 25", assets: 6790000, liabilities: 4532000 },
  { month: "Jul 25", assets: 6952000, liabilities: 4480000 },
  { month: "Aug 25", assets: 7116040, liabilities: 4645000 }];


export const scoreHistory = [
  { month: "Mar 25", score: 58 },
  { month: "Apr 25", score: 60 },
  { month: "May 25", score: 61 },
  { month: "Jun 25", score: 64 },
  { month: "Jul 25", score: 66 },
  { month: "Aug 25", score: 68 }];


export const goals = [
  {
    id: "retirement",
    name: "Retirement at 58",
    icon: "retirement",
    target: 62000000,
    saved: 3348400,
    monthlyContribution: 32000,
    targetYear: 2050,
    expectedReturn: 11,
    priority: "High",
    note: "EPF, NPS and equity SIPs all feed this goal."
  },
  {
    id: "education",
    name: "Aarav's education",
    icon: "education",
    target: 8500000,
    saved: 1348200,
    monthlyContribution: 20000,
    targetYear: 2038,
    expectedReturn: 11,
    priority: "High",
    note: "Undergraduate fees, assumed 8% education inflation."
  },
  {
    id: "home-upgrade",
    name: "Bigger home down payment",
    icon: "home",
    target: 4000000,
    saved: 691200,
    monthlyContribution: 18000,
    targetYear: 2031,
    expectedReturn: 9,
    priority: "Medium",
    note: "3BHK in Thane, part-funded by the gold bonds."
  },
  {
    id: "emergency",
    name: "6-month emergency fund",
    icon: "shield",
    target: 660000,
    saved: 418600,
    monthlyContribution: 10000,
    targetYear: 2027,
    expectedReturn: 6,
    priority: "High",
    note: "Parked in a liquid fund for instant access."
  },
  {
    id: "europe",
    name: "Europe trip with family",
    icon: "travel",
    target: 850000,
    saved: 212000,
    monthlyContribution: 8000,
    targetYear: 2028,
    expectedReturn: 8,
    priority: "Low",
    note: "Three weeks, summer 2028, four travellers."
  }];


export const monthlyCashflow = {
  income: 285000,
  expenses: 168000,
  investments: 88000,
  emi: 57000
};

export const spendingBreakdown = [
  { name: "Home loan EMI", value: 42800 },
  { name: "Household", value: 38500 },
  { name: "School fees", value: 24000 },
  { name: "Car & fuel", value: 21200 },
  { name: "Dining & leisure", value: 17600 },
  { name: "Insurance premiums", value: 11400 },
  { name: "Everything else", value: 12500 }];


export const insurance = {
  lifeCover: 15000000,
  lifeCoverNeeded: 34200000,
  healthCover: 700000,
  healthCoverNeeded: 1500000,
  criticalIllness: 0,
  premiumsPerYear: 136800
};

export const taxSaving = {
  section80cUsed: 108000,
  section80cLimit: 150000,
  nps80ccdUsed: 30000,
  nps80ccdLimit: 50000,
  healthPremium80dUsed: 21000,
  healthPremium80dLimit: 25000,
  estimatedSaving: 20904
};

export const idleCash = {
  savingsBalance: 268000,
  idealBalance: 120000,
  liquidFundRate: 6.9,
  savingsRate: 3.0
};

export const actionItems = [
  {
    id: "a1",
    title: "Top up term cover by ₹1.9 Cr",
    detail: "Your life cover is 4.4x annual income. 10x is the healthy benchmark.",
    impact: "+9 score",
    severity: "high"
  },
  {
    id: "a2",
    title: "Move ₹1.5 L of idle savings to a liquid fund",
    detail: "Earning 3% in savings against 6.9% in a liquid fund.",
    impact: "+3 score",
    severity: "medium"
  },
  {
    id: "a3",
    title: "Complete your ₹42,000 of 80C headroom",
    detail: "An ELSS top-up before 31 March saves about ₹13,100 in tax.",
    impact: "+2 score",
    severity: "medium"
  },
  {
    id: "a4",
    title: "Trim small-cap exposure to under 20%",
    detail: "Small caps are 24% of your equity, above your risk profile band.",
    impact: "+2 score",
    severity: "low"
  },
  {
    id: "a5",
    title: "Add a nominee to your demat account",
    detail: "Pending since account opening. Takes two minutes.",
    impact: "Compliance",
    severity: "low"
  }];


export const recentTransactions = [
  { id: "t1", date: "05 Sep 2025", label: "SIP — Parag Parikh Flexi Cap", amount: -20000 },
  { id: "t2", date: "05 Sep 2025", label: "SIP — Mirae Asset Large Cap", amount: -12000 },
  { id: "t3", date: "03 Sep 2025", label: "Salary credit", amount: 285000 },
  { id: "t4", date: "02 Sep 2025", label: "Home loan EMI", amount: -42800 },
  { id: "t5", date: "29 Aug 2025", label: "Dividend — HDFC Bank", amount: 4095 },
  { id: "t6", date: "24 Aug 2025", label: "Bought Tata Motors ×40", amount: -38400 }];


export const totalAssets = holdings.reduce((s, h) => s + h.current, 0);
export const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
export const totalLiabilities = liabilities.reduce((s, l) => s + l.outstanding, 0);
export const netWorth = totalAssets - totalLiabilities;

export const allocation = (() => {
  const map = new Map();
  for (const h of holdings) map.set(h.category, (map.get(h.category) ?? 0) + h.current);
  return [...map.entries()].map(([name, value]) => ({
    name,
    value,
    share: value / totalAssets * 100
  }));
})();

export const largestAssetSharePct = Math.max(...allocation.map((a) => a.share));

export const goalFundedPct =
  goals.reduce((s, g) => s + Math.min(1, g.saved / g.target), 0) / goals.length * 100;

export const baseScoreInputs = {
  monthlyIncome: monthlyCashflow.income,
  monthlyExpenses: monthlyCashflow.expenses,
  monthlyInvestment: monthlyCashflow.investments,
  emergencyMonths: idleCashMonths(),
  lifeCoverMultiple: insurance.lifeCover / (monthlyCashflow.income * 12),
  healthCover: insurance.healthCover,
  monthlyEmi: monthlyCashflow.emi,
  assetClasses: allocation.length,
  largestAssetSharePct,
  goalFundedPct,
  goalsOnTrackPct: 60
};

function idleCashMonths() {
  return 418600 / monthlyCashflow.expenses;
}

export const coachSuggestions = [
  "How can I improve my Wealth360 score?",
  "Am I on track for retirement?",
  "Is my portfolio too concentrated?",
  "How much tax can I still save?",
  "Do I have enough insurance?",
  "What should I do with my idle cash?"];