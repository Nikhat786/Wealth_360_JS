/**
 * Mock book-of-business for the RM Dashboard — internal/staff view only, never
 * shown to clients. "rahul-mehta" is flagged isLiveClient so the dashboard
 * overlays it with the real live app data instead of these static numbers.
 */
export const RM_CLIENT_ROSTER = [
{
  id: "rahul-mehta",
  isLiveClient: true,
  name: "Rahul Mehta",
  tier: "HNI",
  relationshipYears: 3,
  callRequested: true,
  lastActivity: "Requested call · 2 hours ago"
},
{
  id: "ananya-kapoor",
  name: "Ananya Kapoor",
  tier: "UHNI",
  aum: 42500000,
  wealthScore: 71,
  performance30d: 3.2,
  relationshipYears: 6,
  callRequested: true,
  lastActivity: "Requested call · 1 day ago",
  portfolioNote: "70% allocation in direct equity; no PMS or AIF exposure yet.",
  upsell: [
  { title: "PMS onboarding", detail: "AUM has crossed the discretionary PMS threshold with no mandate in place.", potential: "50–125 bps advisory fee" },
  { title: "Family floater top-up", detail: "Health cover unchanged for 4 years despite AUM growth.", potential: "~₹28,000 commission" }]

},
{
  id: "vikram-oberoi",
  name: "Vikram Oberoi",
  tier: "UHNI",
  aum: 68000000,
  wealthScore: 64,
  performance30d: -1.1,
  relationshipYears: 9,
  callRequested: false,
  lastActivity: "Active 3 days ago",
  portfolioNote: "Large single-stock concentration (38% in one holding); no succession plan on file.",
  upsell: [
  { title: "Family trust structuring", detail: "No will or trust on file for a ₹6.8 Cr portfolio.", potential: "₹49,999 engagement fee" },
  { title: "Concentration hedge", detail: "38% of the portfolio sits in a single stock.", potential: "Advisory mandate" }]

},
{
  id: "meera-iyer",
  name: "Meera Iyer",
  tier: "HNI",
  aum: 18200000,
  wealthScore: 55,
  performance30d: 1.8,
  relationshipYears: 2,
  callRequested: true,
  lastActivity: "Requested call · 3 hours ago",
  portfolioNote: "High idle cash balance; SIP contributions lapsed for 2 months.",
  upsell: [
  { title: "Liquid fund sweep", detail: "₹9.5L sitting in savings earning ~3% — move to a liquid or arbitrage fund.", potential: "25–75 bps trail" },
  { title: "Resume SIP", detail: "Two missed SIP cycles this quarter.", potential: "Retention" }]

},
{
  id: "arjun-nair",
  name: "Arjun Nair",
  tier: "HNI",
  aum: 12500000,
  wealthScore: 48,
  performance30d: -2.4,
  relationshipYears: 1,
  callRequested: false,
  lastActivity: "Active 6 days ago",
  portfolioNote: "New relationship; goals and risk profile still incomplete.",
  upsell: [
  { title: "Complete risk profiling", detail: "Goals and risk profile not yet captured, limiting personalization.", potential: "Data completeness" },
  { title: "Term insurance", detail: "No life cover on record for a primary earner with 2 dependents.", potential: "₹15,000+ commission" }]

},
{
  id: "priya-desai",
  name: "Priya Desai",
  tier: "UHNI",
  aum: 91000000,
  wealthScore: 82,
  performance30d: 4.6,
  relationshipYears: 11,
  callRequested: false,
  lastActivity: "Active today",
  portfolioNote: "Fully diversified model client; all protection gaps closed.",
  upsell: [
  { title: "Estate structuring review", detail: "Existing will hasn't been reviewed in 5 years despite AUM growth.", potential: "₹49,999 engagement fee" }]

}];
