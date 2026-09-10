

export const CURRENT_YEAR = 2025;











/** Future value of a lump sum plus a monthly contribution. */
export function futureValue(present, monthly, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = Math.max(0, Math.round(years * 12));
  const lump = present * Math.pow(1 + r, n);
  const sip = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return lump + sip;
}

/** Monthly contribution needed to reach a target. */
export function requiredMonthly(target, present, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  const lump = present * Math.pow(1 + r, n);
  const shortfall = Math.max(0, target - lump);
  if (shortfall === 0) return 0;
  if (r === 0) return shortfall / n;
  return shortfall / ((Math.pow(1 + r, n) - 1) / r * (1 + r));
}

export function projectGoal(goal, monthly) {
  const yearsLeft = Math.max(0.5, goal.targetYear - CURRENT_YEAR);
  const projected = futureValue(goal.saved, monthly, goal.expectedReturn, yearsLeft);
  const gap = goal.target - projected;
  const series = [];
  const step = yearsLeft > 12 ? Math.ceil(yearsLeft / 10) : 1;
  for (let y = 0; y <= yearsLeft; y += step) {
    series.push({
      year: CURRENT_YEAR + y,
      projected: Math.round(futureValue(goal.saved, monthly, goal.expectedReturn, y)),
      target: Math.round(goal.target * (0.25 + 0.75 * y / yearsLeft))
    });
  }
  if (series[series.length - 1]?.year !== CURRENT_YEAR + yearsLeft) {
    series.push({
      year: Math.round(CURRENT_YEAR + yearsLeft),
      projected: Math.round(projected),
      target: goal.target
    });
  }
  return {
    yearsLeft,
    projected,
    gap,
    onTrack: projected >= goal.target * 0.98,
    fundedPct: goal.target > 0 ? Math.min(100, goal.saved / goal.target * 100) : 100,
    requiredMonthly: requiredMonthly(goal.target, goal.saved, goal.expectedReturn, yearsLeft),
    series
  };
}