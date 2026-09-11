/** Extra mock data layered on top of mock-data.ts — nominations, protection products, planner defaults. */



















export const nominationAccounts = [
  {
    id: "n1",
    name: "Mirae Asset demat & trading",
    institution: "Mirae Asset by Mirae Asset",
    type: "Demat",
    value: 1158140,
    defaultNominee: null
  },
  {
    id: "n2",
    name: "Mutual fund folios (4)",
    institution: "CAMS / KFintech",
    type: "Mutual Funds",
    value: 2963900,
    defaultNominee: "Sneha Sharma"
  },
  {
    id: "n3",
    name: "HDFC Bank fixed deposit",
    institution: "HDFC Bank",
    type: "Fixed Deposit",
    value: 553800,
    defaultNominee: null
  },
  {
    id: "n4",
    name: "EPF corpus",
    institution: "EPFO",
    type: "Retirement",
    value: 1418000,
    defaultNominee: "Sneha Sharma"
  },
  {
    id: "n5",
    name: "NPS Tier I",
    institution: "Protean CRA",
    type: "Retirement",
    value: 512400,
    defaultNominee: null
  },
  {
    id: "n6",
    name: "Salary & savings account",
    institution: "ICICI Bank",
    type: "Bank",
    value: 268000,
    defaultNominee: "Sneha Sharma"
  },
  {
    id: "n7",
    name: "Sovereign Gold Bonds",
    institution: "RBI /Mirae Asset demat",
    type: "Demat",
    value: 691200,
    defaultNominee: null
  },
  {
    id: "n8",
    name: "Term life policy",
    institution: "Max Life",
    type: "Insurance",
    value: 15000000,
    defaultNominee: "Sneha Sharma"
  }];


export const relations = ["Spouse", "Son", "Daughter", "Mother", "Father", "Sibling"];

export const familyMembers = [
  { name: "Sneha Sharma", relation: "Spouse", age: 32 },
  { name: "Aarav Sharma", relation: "Son", age: 6 },
  { name: "Kamla Sharma", relation: "Mother", age: 63 }];










export const transferDocs = [
  {
    id: "d1",
    label: "Registered will",
    detail: "A will removes ambiguity even where nominations exist.",
    done: false
  },
  {
    id: "d2",
    label: "Consolidated asset register",
    detail: "One sheet listing every account, folio and policy number.",
    done: false
  },
  {
    id: "d3",
    label: "Family informed of the register",
    detail: "Sneha knows where the register and credentials are kept.",
    done: true
  },
  {
    id: "d4",
    label: "Insurance policies shared with nominee",
    detail: "Policy copies and claim helpline stored with the register.",
    done: true
  }];


/** Illustrative only — not real products, quotes or recommendations. */











export const protectionProducts = [
  {
    id: "p1",
    kind: "life",
    name: "Term Shield Plus — illustrative",
    insurer: "Sample Life Insurer A",
    cover: 20000000,
    annualPremium: 23400,
    term: "Till age 65",
    highlights: ["Level cover", "Optional waiver of premium", "Online claim tracking"]
  },
  {
    id: "p2",
    kind: "life",
    name: "Income Replacement Term — illustrative",
    insurer: "Sample Life Insurer B",
    cover: 15000000,
    annualPremium: 18900,
    term: "Till age 60",
    highlights: ["Monthly payout option", "Loan-linked add-on", "Spouse rider available"]
  },
  {
    id: "p3",
    kind: "health",
    name: "Family Floater 10L — illustrative",
    insurer: "Sample Health Insurer C",
    cover: 1000000,
    annualPremium: 26800,
    term: "Annual, lifelong renewal",
    highlights: ["3 members covered", "No room-rent cap", "Day-care procedures"]
  },
  {
    id: "p4",
    kind: "health",
    name: "Super Top-up 25L — illustrative",
    insurer: "Sample Health Insurer D",
    cover: 2500000,
    annualPremium: 9700,
    term: "Annual, above ₹5L deductible",
    highlights: ["Cheapest way to add scale", "Cumulative deductible", "Pan-India network"]
  },
  {
    id: "p5",
    kind: "critical",
    name: "Critical Care 25L — illustrative",
    insurer: "Sample Health Insurer C",
    cover: 2500000,
    annualPremium: 14200,
    term: "Till age 65",
    highlights: ["Lump sum on diagnosis", "32 conditions", "Independent of hospital bills"]
  }];


export const retirementAssumptions = {
  currentAge: 34,
  retireAge: 58,
  lifeExpectancy: 85,
  monthlySpendToday: 120000,
  inflation: 6,
  preReturn: 11,
  postReturn: 7
};

export const sipDefaults = {
  monthly: 88000,
  years: 15,
  expectedReturn: 12,
  stepUp: 8
};

export const loanVsInvestDefaults = {
  loanId: "l2",
  surplusMonthly: 25000,
  investReturn: 12
};