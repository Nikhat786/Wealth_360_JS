/**
 * WealthVerse Intelligence & Adaptive Wealth Engine
 * 
 * Deterministic multi-dimensional intelligence layer.
 * Converts raw financial information, goals, risk profiles, life stages,
 * and subscription tiers into dynamic priorities, adaptive recommendations,
 * risk alerts, opportunity alerts, and Sheru AI Wealth Guide insights.
 * 
 * NO EXTERNAL APIS OR LLM DEPENDENCIES.
 */

import { formatINR, formatINRShort } from "./format";



import { idleCash } from "./mock-data";
import { getDashboardConfig } from "./config-engine";
































































export function generateWealthIntelligence(inputs)










{
  const {
    answers,
    goals,
    goalsShortfall,
    monthlySurplus,
    emergencyMonths,
    taxHeadroom,
    unnominatedCount,
    unnominatedValue,
    subscriptionTier = "Basic"
  } = inputs;

  const advisoryItems = [];
  const riskAlerts = [];
  const opportunityAlerts = [];
  const wealthInsights = [];
  const nextBestActions = [];

  const age = answers.age || 36;
  const annualIncome = Math.max(answers.annualIncome || answers.salary * 12 || 100000, 1);
  const dashboardConfig = getDashboardConfig(age, annualIncome);

  const focusArea = dashboardConfig.focusArea;
  const focusDescription = dashboardConfig.focusDescription;

  // Append JSON-driven insights
  dashboardConfig.insights.forEach((insight, index) => {
    wealthInsights.push({
      id: `insight-config-${index}`,
      category: "Allocation",
      title: "Profile Strategy",
      issue: insight,
      reason: `Based on your life stage (${dashboardConfig.ageBracket} years) and income (${dashboardConfig.incomeBracket}).`,
      impact: "Aligns your portfolio with the recommended milestones for your profile.",
      suggestedAction: `Explore ${dashboardConfig.recommendedProducts.join(", ")}.`,
      expectedOutcome: "Optimized trajectory for long-term wealth compounding.",
      priority: "Medium"
    });
  });

  // 2. Protection Gap Analysis (Proactive Protection Alert)
  const lifeCoverNeeded = annualIncome * 10 + inputs.totalLiabilities + goalsShortfall;
  const lifeCoverGap = Math.max(0, lifeCoverNeeded - answers.lifeCover);

  if (lifeCoverGap > 0) {
    const item = {
      id: "gap-protection",
      category: "Protection",
      title: "Protection Alert: Term Deficit",
      headline: `Top up term cover by ${formatINRShort(lifeCoverGap)}`,
      whatChanged: `Your existing life cover of ${formatINRShort(answers.lifeCover)} is ${(answers.lifeCover / Math.max(1, annualIncome)).toFixed(1)}x annual income against the recommended 10x + loan liabilities benchmark.`,
      whyItMatters: `With ${answers.dependents} dependents and ${formatINRShort(inputs.totalLiabilities)} in outstanding liabilities, an unforeseen income disruption leaves your family with an unhedged deficit.`,
      financialImpact: `Leaves an unhedged gap of ${formatINRShort(lifeCoverGap)} against family liabilities and long-term education goals.`,
      suggestedAction: `Add a ${formatINRShort(lifeCoverGap)} pure term policy with annual premium ~${formatINR(Math.round(lifeCoverGap * 0.0014))}.`,
      expectedOutcome: "Family continuity is 100% secured and Wealth Readiness improves by +9 points.",
      expectedImpact: "+9 points to Wealth Health and comprehensive family risk insulation.",
      priorityLevel: "High",
      severity: "high",
      rmTopic: "Term Life & Family Floater Review",
      routeTo: "/protect"
    };
    advisoryItems.push(item);
    riskAlerts.push(`Life cover is short by ${formatINRShort(lifeCoverGap)} against income and liability commitments.`);

    wealthInsights.push({
      id: "insight-prot",
      category: "Protection",
      title: "Under-insured Life Cover",
      issue: `Current term cover is short by ${formatINRShort(lifeCoverGap)} based on 10x income standard.`,
      reason: "Liabilities and dependent commitments have expanded without a corresponding policy adjustment.",
      impact: "In the event of an untimely tragedy, dependent goals and mortgage payments would face liquidity default.",
      suggestedAction: `Secure an online term policy of ${formatINRShort(lifeCoverGap)} with critical illness rider.`,
      expectedOutcome: "Immediate 100% financial security for dependents and loans.",
      priority: "High"
    });

    nextBestActions.push({
      id: "act-term",
      title: "Top up Term Life Cover",
      subtitle: `Bridge ${formatINRShort(lifeCoverGap)} gap for ₹${Math.round(lifeCoverGap * 0.0014 / 12)}/mo`,
      action: "Review Protection",
      route: "/protect",
      tierRequired: "Basic",
      priority: "High"
    });
  }

  // 3. Goal Funding Gap & Retirement Shortfall (Proactive Goal Alert)
  const retirementGoal = goals.find((g) => g.id === "retirement" || g.name.toLowerCase().includes("retire"));
  if (retirementGoal) {
    const retirementGap = Math.max(0, retirementGoal.target - retirementGoal.saved);
    const suggestedSipIncrease = Math.round(retirementGap * 0.00015);
    const item = {
      id: "gap-retirement",
      category: "Retirement",
      title: "Retirement Goal Funding Gap",
      headline: `Retirement corpus projection has a ${formatINRShort(retirementGap)} milestone gap`,
      whatChanged: `Target corpus at age ${answers.retirementAge || 58} is ${formatINRShort(retirementGoal.target)}. Current accumulated corpus is ${formatINRShort(retirementGoal.saved)}.`,
      whyItMatters: `Longevity risk and healthcare inflation (10% p.a.) require a dedicated compounding engine to maintain post-retirement standard of living.`,
      financialImpact: `Projected retirement corpus currently falls short of target by ${formatINRShort(retirementGap)}.`,
      suggestedAction: `Increase retirement SIP by ${formatINR(suggestedSipIncrease)} per month and allocate to diversified index + flexi-cap funds.`,
      expectedOutcome: `Closes the ${retirementGoal.targetYear} shortfall and improves retirement readiness by +14%.`,
      expectedImpact: "Closes the 2050 target shortfall and elevates Goal Readiness by +14 points.",
      priorityLevel: "High",
      severity: "high",
      rmTopic: "Retirement Wealth Projection & NPS Setup",
      routeTo: `/goals/${retirementGoal.id}`,
      marketLinked: true
    };
    advisoryItems.push(item);

    wealthInsights.push({
      id: "insight-retire",
      category: "Retirement",
      title: "Retirement Milestone Shortfall",
      issue: `Projected corpus will miss the ${formatINRShort(retirementGoal.target)} target by ${formatINRShort(retirementGap)}.`,
      reason: "Monthly SIP contributions have not kept pace with annual salary increments.",
      impact: "Forces either postponed retirement age or reduced post-retirement monthly spending.",
      suggestedAction: `Increase monthly SIP by ${formatINR(suggestedSipIncrease)} with an 8% annual step-up.`,
      expectedOutcome: "Attains full financial independence by target year.",
      priority: "High"
    });

    nextBestActions.push({
      id: "act-retire-sip",
      title: "Step-up Retirement SIP",
      subtitle: `Add ${formatINR(suggestedSipIncrease)}/mo to close ${formatINRShort(retirementGap)} gap`,
      action: "Adjust Goal",
      route: `/goals/${retirementGoal.id}`,
      tierRequired: "Basic",
      priority: "High"
    });
  }

  // 4. Debt Optimization (Proactive Debt Alert)
  const highestCostLoan = answers.liabilities.slice().sort((a, b) => b.interestRate - a.interestRate)[0];
  if (highestCostLoan && highestCostLoan.interestRate >= 8.5) {
    const projectedInterestSaving = Math.round(highestCostLoan.outstandingAmount * 0.08);
    const item = {
      id: "gap-debt",
      category: "Debt",
      title: "High-Cost Debt Optimization",
      headline: `${highestCostLoan.type} (${highestCostLoan.interestRate}%) creates guaranteed cashflow drag`,
      whatChanged: `Your ${highestCostLoan.provider} ${highestCostLoan.type} carries ${highestCostLoan.interestRate}% interest on ${formatINRShort(highestCostLoan.outstandingAmount)} outstanding.`,
      whyItMatters: `This interest rate exceeds conservative fixed-income hurdle rates, making early prepayment equivalent to a risk-free guaranteed return.`,
      financialImpact: `Accumulates ~${formatINR(Math.round(highestCostLoan.outstandingAmount * highestCostLoan.interestRate / 100))} in annual interest payouts.`,
      suggestedAction: `Prepay ${formatINR(25000)}/month or apply annual bonuses directly toward loan principal.`,
      expectedOutcome: `Saves an estimated ${formatINRShort(projectedInterestSaving)} in total interest and reduces tenure by up to 24 months.`,
      expectedImpact: `Saves an estimated ${formatINRShort(projectedInterestSaving)} in interest.`,
      priorityLevel: "Medium",
      severity: "medium",
      rmTopic: "Debt Restructuring & Accelerated Prepayment",
      routeTo: "/debt"
    };
    advisoryItems.push(item);
    opportunityAlerts.push(`Prepaying ${highestCostLoan.type} yields a risk-free guaranteed saving of ${highestCostLoan.interestRate}%.`);

    wealthInsights.push({
      id: "insight-debt",
      category: "Debt",
      title: "Sub-optimal Debt Burden",
      issue: `Borrowing at ${highestCostLoan.interestRate}% erodes compounding gains from other assets.`,
      reason: "High interest floating loans are being serviced only on scheduled monthly EMIs.",
      impact: "Unnecessary interest outflow drains surplus capital away from wealth creation.",
      suggestedAction: "Initiate semi-annual principal prepayments of 5% of outstanding balance.",
      expectedOutcome: "Shortens debt horizon by 2 years and saves major interest.",
      priority: "Medium"
    });

    nextBestActions.push({
      id: "act-prepay",
      title: "Accelerate Loan Prepayment",
      subtitle: `Save up to ${formatINRShort(projectedInterestSaving)} on ${highestCostLoan.type}`,
      action: "Optimize Debt",
      route: "/debt",
      tierRequired: "Premium",
      priority: "Medium"
    });
  }

  // 5. Tax Saving Opportunity (Proactive Tax Alert)
  if (taxHeadroom > 0) {
    const potentialSaving = Math.round(taxHeadroom * 0.312);
    const item = {
      id: "gap-tax",
      category: "Tax",
      title: "Tax Optimization Opportunity",
      headline: `Unutilized headroom can save ${formatINR(potentialSaving)} this fiscal`,
      whatChanged: `You have ${formatINR(taxHeadroom)} of unused deduction headroom under 80C, 80CCD(1B), and 80D.`,
      whyItMatters: `Unclaimed tax allowances result in direct cash leakages that could otherwise compound tax-free.`,
      financialImpact: `Direct cash tax leakage of ${formatINR(potentialSaving)} per year.`,
      suggestedAction: `Deploy ₹50,000 in NPS Tier-I and remainder in 3-year ELSS funds before March 31.`,
      expectedOutcome: `Immediate tax saving of ${formatINR(potentialSaving)} credited to your annual cashflow.`,
      expectedImpact: `Immediate tax refund of ~${formatINR(potentialSaving)}.`,
      priorityLevel: "Medium",
      severity: "medium",
      rmTopic: "Annual Tax Optimization & ELSS Allocation",
      routeTo: "/insights",
      marketLinked: true
    };
    advisoryItems.push(item);
    opportunityAlerts.push(`Save up to ${formatINR(potentialSaving)} in direct taxes using Section 80C & 80CCD.`);

    wealthInsights.push({
      id: "insight-tax",
      category: "Tax",
      title: "Unutilized Tax Allowances",
      issue: `${formatINR(taxHeadroom)} in tax deductions remains unallocated before financial year end.`,
      reason: "Investments have not been synchronized with Section 80C and 80CCD(1B) timelines.",
      impact: "Direct excess income tax deduction of ~31.2% on unutilized headroom.",
      suggestedAction: "Lock in ₹50k NPS Tier-I deposit and ELSS tax-saver mutual funds.",
      expectedOutcome: `Instant tax reduction of ${formatINR(potentialSaving)}.`,
      priority: "Medium"
    });

    nextBestActions.push({
      id: "act-tax-save",
      title: "Claim Section 80CCD & 80C",
      subtitle: `Save up to ${formatINR(potentialSaving)} before March 31`,
      action: "Harvest Tax",
      route: "/insights",
      tierRequired: "Basic",
      priority: "Medium"
    });
  }

  // 6. Wealth Transfer & Succession Risk (Proactive Transfer Alert)
  if (unnominatedCount > 0 || !answers.hasWill) {
    const item = {
      id: "gap-transfer",
      category: "Transfer",
      title: "Wealth Transfer & Succession Risk",
      headline: `${unnominatedCount} asset${unnominatedCount > 1 ? "s" : ""} without active nominations`,
      whatChanged: `${formatINRShort(unnominatedValue)} across ${unnominatedCount} accounts does not have a registered nominee on file.`,
      whyItMatters: `In the event of an untimely demise, absence of registered nominees and a drafted Will leads to lengthy probate processes, family disputes, and frozen accounts.`,
      financialImpact: `Puts ${formatINRShort(unnominatedValue)} in investments at risk of probate delays.`,
      suggestedAction: `Complete 3-step digital nomination mapping and draft your legally compliant Digital Will.`,
      expectedOutcome: "Seamless 100% legal continuity for your family with zero administrative friction.",
      expectedImpact: `Elevates Wealth Continuity score to 85+ and secures family inheritance.`,
      priorityLevel: "High",
      severity: "high",
      rmTopic: "Estate Planning, Nomination & Will Drafting",
      routeTo: "/transfer"
    };
    advisoryItems.push(item);
    riskAlerts.push(`${unnominatedCount} financial accounts worth ${formatINRShort(unnominatedValue)} lack registered nominees.`);

    wealthInsights.push({
      id: "insight-transfer",
      category: "Transfer",
      title: "Incomplete Succession Planning",
      issue: `${unnominatedCount} accounts lack designated beneficiaries, and no Will is on record.`,
      reason: "Asset acquisition occurred across multiple institutions without centralized nomination audit.",
      impact: "Heirs may face extensive court succession certificate requirements lasting 12–24 months.",
      suggestedAction: "Assign 100% nominees across all accounts and formalize a digital Will.",
      expectedOutcome: "Guaranteed smooth asset transition without legal encumbrance.",
      priority: "High"
    });

    nextBestActions.push({
      id: "act-will",
      title: "Draft Digital Will & Nominees",
      subtitle: `Secure ${formatINRShort(unnominatedValue)} across ${unnominatedCount} accounts`,
      action: "Start Will",
      route: "/transfer",
      tierRequired: "Elite",
      priority: "High"
    });
  }

  // 7. Liquidity Alert
  if (emergencyMonths < 6) {
    riskAlerts.push(`Liquid emergency reserve covers only ${emergencyMonths.toFixed(1)} months of expenses (Target: 6 months).`);
  } else if (idleCash.savingsBalance > idleCash.idealBalance) {
    const idleExcess = idleCash.savingsBalance - idleCash.idealBalance;
    const foregoneYield = Math.round(idleExcess * (idleCash.liquidFundRate - idleCash.savingsRate) / 100);
    opportunityAlerts.push(`${formatINRShort(idleExcess)} idle cash in savings can earn ~${formatINR(foregoneYield)}/yr extra in an instant-redemption liquid fund.`);
  }

  // Dynamic priorities ranked by severity
  const dynamicPriorities = [
  ...advisoryItems.filter((a) => a.priorityLevel === "High").map((a) => a.headline)].
  slice(0, 4);

  // RM topics
  const rmTopics = [
  ...advisoryItems.map((a) => a.rmTopic),
  "Half-Yearly Portfolio Health Review"];


  return {
    advisoryItems,
    riskAlerts,
    opportunityAlerts,
    rmTopics: Array.from(new Set(rmTopics)),
    focusArea,
    focusDescription,
    dynamicPriorities,
    wealthInsights,
    nextBestActions,
    dashboardRecommendations: advisoryItems.slice(0, 3)
  };
}