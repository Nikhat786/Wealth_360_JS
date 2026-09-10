/**
 * FIRE (Financial Independence / Retire Early) Calculator Engine
 * 
 * Computes:
 * - Required Corpus (Standard, Lean, Fat)
 * - Safe Withdrawal Capacity (SWR 3.5%–4.0%)
 * - Years to FI
 * - Projected FI Date
 * - Progress Percentage
 */






















export function computeFire(inputs) {
  const {
    annualExpenses,
    currentInvestments,
    monthlySavings,
    safeWithdrawalRatePct = 3.5,
    expectedRealReturnPct = 6.0,
    currentAge = 36
  } = inputs;

  const swr = safeWithdrawalRatePct / 100;
  const multiplier = Math.round(1 / swr);

  const requiredCorpus = Math.round(annualExpenses * multiplier);
  const leanFireCorpus = Math.round(requiredCorpus * 0.75); // 75% for essential expenses
  const fatFireCorpus = Math.round(requiredCorpus * 1.4); // 140% for luxury buffer

  const currentMonthlyWithdrawalCapacity = Math.round(currentInvestments * swr / 12);
  const fireProgressPct = Math.min(100, Math.round(currentInvestments / Math.max(1, requiredCorpus) * 100));

  // Compound growth solving for future value = requiredCorpus
  // FV = PV*(1+r)^n + PMT * [((1+r)^n - 1) / r] * (1+r)
  const rMonthly = expectedRealReturnPct / 100 / 12;
  const pmt = monthlySavings;
  const pv = currentInvestments;

  let months = 0;
  let accumulated = pv;
  const maxMonths = 600; // 50 years cap

  if (accumulated >= requiredCorpus) {
    months = 0;
  } else {
    while (accumulated < requiredCorpus && months < maxMonths) {
      accumulated = accumulated * (1 + rMonthly) + pmt * (1 + rMonthly);
      months++;
    }
  }

  const yearsToFi = Math.round(months / 12 * 10) / 10;
  const projectedFiAge = Math.round(currentAge + yearsToFi);
  const currentYear = new Date().getFullYear();
  const projectedFiYear = currentYear + Math.ceil(yearsToFi);

  return {
    requiredCorpus,
    leanFireCorpus,
    fatFireCorpus,
    currentMonthlyWithdrawalCapacity,
    fireProgressPct,
    yearsToFi,
    projectedFiAge,
    projectedFiYear,
    ruleOfThumbMultiplier: multiplier
  };
}