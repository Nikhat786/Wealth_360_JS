/**
 * Mock book-of-business for the RM Dashboard — internal/staff view only, never
 * shown to clients. "rahul-mehta" is flagged isLiveClient so the dashboard and
 * client report overlay it with the real live app data instead of these
 * static numbers (see useRmRoster below).
 */
import { useMemo } from "react";

import { useApp } from "@/context/app-context";

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
  phone: "9821044120",
  email: "ananya.kapoor@example.com",
  riskProfile: "Aggressive",
  scoreBreakdown: [
  { key: "savings", label: "Savings", score: 78 },
  { key: "protection", label: "Protection", score: 52 },
  { key: "diversification", label: "Diversify", score: 44 },
  { key: "debt", label: "Debt", score: 88 },
  { key: "liquidity", label: "Liquidity", score: 70 },
  { key: "goals", label: "Goals", score: 74 }],

  assetAllocation: [
  { name: "Stocks", value: 29750000 },
  { name: "Mutual Funds", value: 6800000 },
  { name: "Gold/SGB", value: 2550000 },
  { name: "FD/RD", value: 3400000 }],

  goals: [
  { name: "Retirement", saved: 18000000, target: 60000000, targetYear: 2045, onTrack: true },
  { name: "Child Education", saved: 3200000, target: 9000000, targetYear: 2036, onTrack: false }],

  insurance: { lifeCover: 20000000, healthCover: 1000000, hasWill: false, note: "No family floater top-up in 4 years; no will on file." },
  activityLog: [
  { date: "1 day ago", note: "Requested a call back — wants to discuss PMS onboarding." },
  { date: "2 weeks ago", note: "Added ₹15L to direct equity via block deal." },
  { date: "6 weeks ago", note: "Portfolio review completed — flagged concentration risk." }],

  performanceHistory: [
  { label: "M1", value: 38900000 },
  { label: "M2", value: 39600000 },
  { label: "M3", value: 40100000 },
  { label: "M4", value: 40850000 },
  { label: "M5", value: 41200000 },
  { label: "M6", value: 42500000 }],

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
  phone: "9833021198",
  email: "vikram.oberoi@example.com",
  riskProfile: "Aggressive",
  scoreBreakdown: [
  { key: "savings", label: "Savings", score: 72 },
  { key: "protection", label: "Protection", score: 60 },
  { key: "diversification", label: "Diversify", score: 28 },
  { key: "debt", label: "Debt", score: 91 },
  { key: "liquidity", label: "Liquidity", score: 66 },
  { key: "goals", label: "Goals", score: 68 }],

  assetAllocation: [
  { name: "Stocks", value: 34000000 },
  { name: "Real Estate", value: 20400000 },
  { name: "Mutual Funds", value: 8160000 },
  { name: "Gold/SGB", value: 5440000 }],

  goals: [
  { name: "Wealth Creation", saved: 42000000, target: 100000000, targetYear: 2038, onTrack: true },
  { name: "Estate Planning", saved: 0, target: 1, targetYear: 2026, onTrack: false }],

  insurance: { lifeCover: 30000000, healthCover: 1500000, hasWill: false, note: "No will or family trust on file for a ₹6.8 Cr portfolio." },
  activityLog: [
  { date: "3 days ago", note: "Logged into portfolio dashboard, reviewed holdings." },
  { date: "3 weeks ago", note: "Declined estate structuring pitch — revisit next quarter." },
  { date: "2 months ago", note: "Single stock position grew to 38% after rally." }],

  performanceHistory: [
  { label: "M1", value: 66200000 },
  { label: "M2", value: 67800000 },
  { label: "M3", value: 69500000 },
  { label: "M4", value: 68900000 },
  { label: "M5", value: 68700000 },
  { label: "M6", value: 68000000 }],

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
  phone: "9845112230",
  email: "meera.iyer@example.com",
  riskProfile: "Moderate",
  scoreBreakdown: [
  { key: "savings", label: "Savings", score: 48 },
  { key: "protection", label: "Protection", score: 55 },
  { key: "diversification", label: "Diversify", score: 62 },
  { key: "debt", label: "Debt", score: 74 },
  { key: "liquidity", label: "Liquidity", score: 40 },
  { key: "goals", label: "Goals", score: 50 }],

  assetAllocation: [
  { name: "Mutual Funds", value: 8190000 },
  { name: "FD/RD", value: 5460000 },
  { name: "Cash", value: 2730000 },
  { name: "Gold/SGB", value: 1820000 }],

  goals: [
  { name: "Home Down Payment", saved: 3500000, target: 8000000, targetYear: 2029, onTrack: false },
  { name: "Retirement", saved: 4200000, target: 35000000, targetYear: 2050, onTrack: true }],

  insurance: { lifeCover: 8000000, healthCover: 500000, hasWill: false, note: "Health cover below recommended level for family size." },
  activityLog: [
  { date: "3 hours ago", note: "Requested a call back — concerned about lapsed SIPs." },
  { date: "2 months ago", note: "Missed second consecutive SIP cycle." },
  { date: "4 months ago", note: "Onboarded via branch walk-in." }],

  performanceHistory: [
  { label: "M1", value: 17100000 },
  { label: "M2", value: 17300000 },
  { label: "M3", value: 17600000 },
  { label: "M4", value: 17450000 },
  { label: "M5", value: 17900000 },
  { label: "M6", value: 18200000 }],

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
  phone: "9900112233",
  email: "arjun.nair@example.com",
  riskProfile: "Not assessed",
  scoreBreakdown: [
  { key: "savings", label: "Savings", score: 55 },
  { key: "protection", label: "Protection", score: 30 },
  { key: "diversification", label: "Diversify", score: 50 },
  { key: "debt", label: "Debt", score: 62 },
  { key: "liquidity", label: "Liquidity", score: 58 },
  { key: "goals", label: "Goals", score: 32 }],

  assetAllocation: [
  { name: "Stocks", value: 6250000 },
  { name: "Mutual Funds", value: 3750000 },
  { name: "FD/RD", value: 2500000 }],

  goals: [
  { name: "Not yet defined", saved: 0, target: 1, targetYear: 2026, onTrack: false }],

  insurance: { lifeCover: 0, healthCover: 300000, hasWill: false, note: "No life cover on record for a primary earner with 2 dependents." },
  activityLog: [
  { date: "6 days ago", note: "Logged in, browsed goal-planning tools." },
  { date: "3 weeks ago", note: "Completed KYC and initial fund transfer." },
  { date: "1 month ago", note: "Relationship opened via referral." }],

  performanceHistory: [
  { label: "M1", value: 12100000 },
  { label: "M2", value: 12400000 },
  { label: "M3", value: 12900000 },
  { label: "M4", value: 12700000 },
  { label: "M5", value: 12750000 },
  { label: "M6", value: 12500000 }],

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
  phone: "9769004411",
  email: "priya.desai@example.com",
  riskProfile: "Moderate",
  scoreBreakdown: [
  { key: "savings", label: "Savings", score: 88 },
  { key: "protection", label: "Protection", score: 90 },
  { key: "diversification", label: "Diversify", score: 85 },
  { key: "debt", label: "Debt", score: 95 },
  { key: "liquidity", label: "Liquidity", score: 80 },
  { key: "goals", label: "Goals", score: 82 }],

  assetAllocation: [
  { name: "Stocks", value: 27300000 },
  { name: "Mutual Funds", value: 22750000 },
  { name: "Real Estate", value: 22750000 },
  { name: "EPF/PPF/NPS", value: 9100000 },
  { name: "Gold/SGB", value: 9100000 }],

  goals: [
  { name: "Retirement", saved: 55000000, target: 90000000, targetYear: 2040, onTrack: true },
  { name: "Philanthropy Fund", saved: 8000000, target: 15000000, targetYear: 2030, onTrack: true }],

  insurance: { lifeCover: 50000000, healthCover: 2500000, hasWill: true, note: "Will last reviewed 5 years ago despite AUM growth since." },
  activityLog: [
  { date: "Today", note: "Logged in, reviewed quarterly performance report." },
  { date: "2 weeks ago", note: "Rebalanced portfolio per model allocation." },
  { date: "5 years ago", note: "Will last notarized and filed." }],

  performanceHistory: [
  { label: "M1", value: 83400000 },
  { label: "M2", value: 85100000 },
  { label: "M3", value: 86800000 },
  { label: "M4", value: 88200000 },
  { label: "M5", value: 89600000 },
  { label: "M6", value: 91000000 }],

  upsell: [
  { title: "Estate structuring review", detail: "Existing will hasn't been reviewed in 5 years despite AUM growth.", potential: "₹49,999 engagement fee" }]

}];


/** Group an assets array (as stored on app-context answers) by type into a chart-friendly allocation list. */
function allocationFromAssets(assets) {
  const map = (assets || []).reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + a.currentValue;
    return acc;
  }, {});
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

/**
 * Builds the live overlay for the one client this prototype has real data
 * for, from the current app-context state, in the same normalized shape as
 * the rest of the roster.
 */
function useLiveClientOverlay() {
  const { answers, score, totalAssets, sheruAdvisory, booking, riskProfile, projections, accountAggregatorStatus } = useApp();

  return useMemo(() => {
    const activityLog = [];
    if (booking) {
      activityLog.push({
        date: "Just now",
        note: `Requested a ${booking.mode} call — ${booking.topic}${booking.note ? `: ${booking.note}` : ""}`
      });
    }
    if (accountAggregatorStatus === "connected" || accountAggregatorStatus === "linked") {
      activityLog.push({ date: "Recently", note: "Linked accounts via Account Aggregator." });
    }
    activityLog.push({ date: "On file", note: "Completed the Wealth360 onboarding journey." });

    return {
      name: answers.name,
      tier: "HNI",
      aum: totalAssets,
      wealthScore: score.total,
      portfolioNote: sheruAdvisory[0]?.headline ?? "No immediate portfolio flags.",
      callRequested: Boolean(booking),
      lastActivity: booking ? `Requested ${booking.mode} · ${booking.topic}` : "No pending requests",
      phone: answers.mobile,
      email: answers.email,
      riskProfile,
      scoreBreakdown: score.pillars.map((p) => ({ key: p.key, label: p.short, score: p.score })),
      assetAllocation: allocationFromAssets(answers.assets),
      goals: projections.map(({ goal, p }) => ({
        name: goal.name,
        saved: goal.saved,
        target: goal.target,
        targetYear: goal.targetYear,
        onTrack: p.onTrack
      })),
      insurance: {
        lifeCover: answers.lifeCover,
        healthCover: answers.healthCover,
        hasWill: answers.hasWill,
        note: sheruAdvisory.find((i) => i.category === "Protection")?.headline ?? "No protection gaps flagged."
      },
      activityLog,
      upsell: sheruAdvisory.slice(0, 4).map((item) => ({
        title: item.headline,
        detail: item.suggestedAction,
        potential: item.category
      }))
    };
  }, [answers, score, totalAssets, sheruAdvisory, booking, riskProfile, projections, accountAggregatorStatus]);
}

/** The merged RM book-of-business: static roster overlaid with live data for the one real client. */
export function useRmRoster() {
  const liveClient = useLiveClientOverlay();
  return useMemo(
    () => RM_CLIENT_ROSTER.map((c) => c.isLiveClient ? { ...c, ...liveClient } : c),
    [liveClient]
  );
}
