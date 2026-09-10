import dashboardConfig from "./config/dashboard-config.json";











export function getDashboardConfig(age, annualIncome) {
  // Determine age bracket
  let currentAgeBracket = "36-45"; // Default
  for (const bracket of dashboardConfig.ageBrackets) {
    if (age >= bracket.min && age <= bracket.max) {
      currentAgeBracket = bracket.id;
      break;
    }
  }

  // Determine income bracket
  let currentIncomeBracket = "5L-15L"; // Default
  for (const bracket of dashboardConfig.incomeBrackets) {
    if (annualIncome >= bracket.min && annualIncome <= bracket.max) {
      currentIncomeBracket = bracket.id;
      break;
    }
  }

  // Find corresponding configuration
  const config = dashboardConfig.configurations.find(
    (c) => c.ageBracket === currentAgeBracket && c.incomeBracket === currentIncomeBracket
  );

  // Fallback to a default if not found
  if (!config) {
    return {
      ageBracket: currentAgeBracket,
      incomeBracket: currentIncomeBracket,
      focusArea: "Wealth Creation & Protection",
      focusDescription: "Balance long-term growth with adequate family security.",
      recommendedGoals: ["Retirement", "Emergency Fund"],
      recommendedProducts: ["Mutual Funds", "Term Insurance"],
      insights: ["Maintain a disciplined SIP approach.", "Ensure emergency funds cover 6 months."]
    };
  }

  return config;
}