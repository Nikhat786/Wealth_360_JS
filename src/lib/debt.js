









export function debtSummary(liabilities, monthlyIncome) {
  const totalOutstanding = liabilities.reduce((sum, loan) => sum + loan.outstandingAmount, 0);
  const totalEmi = liabilities.reduce((sum, loan) => sum + loan.emi, 0);
  const weightedRate = totalOutstanding > 0 ?
  liabilities.reduce((sum, loan) => sum + loan.outstandingAmount * loan.interestRate, 0) / totalOutstanding :
  0;
  return {
    totalOutstanding,
    totalEmi,
    debtToIncome: monthlyIncome > 0 ? totalEmi / monthlyIncome * 100 : 0,
    highestCost: liabilities.slice().sort((a, b) => b.interestRate - a.interestRate)[0] ?? null,
    weightedRate
  };
}

export function repaymentStrategy(summary, extraMonthly) {
  const baselineYears = Math.max(1, Math.ceil(summary.totalOutstanding / Math.max(1, summary.totalEmi * 12)));
  const acceleratedYears = Math.max(1, Math.ceil(summary.totalOutstanding / Math.max(1, (summary.totalEmi + extraMonthly) * 12)));
  const interestEstimate = summary.totalOutstanding * (summary.weightedRate / 100) * baselineYears * 0.55;
  const acceleratedInterest = summary.totalOutstanding * (summary.weightedRate / 100) * acceleratedYears * 0.55;
  return {
    baselineYears,
    acceleratedYears,
    interestEstimate,
    acceleratedInterest,
    interestSaved: Math.max(0, interestEstimate - acceleratedInterest),
    monthsSaved: Math.max(0, (baselineYears - acceleratedYears) * 12)
  };
}