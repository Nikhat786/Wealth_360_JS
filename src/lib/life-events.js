/**
 * Life Event Engine
 * 
 * Deterministic simulation of life milestones:
 * - Marriage
 * - Child Birth
 * - Job Switch
 * - Career Break
 * - Business Creation
 * - Home Purchase
 * - Early Retirement
 * - International Relocation
 * - Second Home
 * 
 * Computes Income, Expense, Protection, Goal, Net Worth & Score Impacts.
 */


















/** Free-form categories for a personal, undated future-event log (separate from the
 * deterministic LIFE_EVENTS_CATALOG simulator below). */
export const CUSTOM_EVENT_TYPES = ["Baby", "Marriage", "Home Purchase", "Job Change", "Career Break", "Education", "Travel", "Business", "Relocation", "Retirement", "Custom"];

export const LIFE_EVENTS_CATALOG = [
{
  id: "event-marriage",
  name: "Marriage",
  category: "Family",
  iconName: "Heart",
  tagline: "Combining households, dual income & shared long-term aspirations.",
  description: "Expands household investible surplus if dual-income, while increasing lifestyle and joint housing requirements.",
  monthlyIncomeDelta: +120000,
  monthlyExpenseDelta: +35000,
  lifeCoverDelta: +10000000,
  healthCoverDelta: +500000,
  netWorth10YrDelta: +14500000,
  healthScoreDelta: +6,
  primaryAction: "Update account nominations and convert individual health cover to a comprehensive family floater.",
  checklist: [
  "Add spouse as 100% or primary nominee across all Demat & MF accounts",
  "Consolidate health insurance into a ₹15L–₹25L family floater",
  "Draft combined household cashflow budget and joint retirement target"]

},
{
  id: "event-child",
  name: "Child Birth",
  category: "Family",
  iconName: "Baby",
  tagline: "Welcoming a dependent, child healthcare & 18-year education horizon.",
  description: "Adds recurring child care and education expenses. Substantially increases term insurance demand to safeguard guardian income.",
  monthlyIncomeDelta: 0,
  monthlyExpenseDelta: +25000,
  lifeCoverDelta: +7500000,
  healthCoverDelta: +500000,
  netWorth10YrDelta: -3800000,
  healthScoreDelta: -4,
  primaryAction: "Initiate an automated 15-year equity SIP for undergraduate education and increase term cover.",
  checklist: [
  "Increase pure term life insurance by ₹75L to guarantee education funding",
  "Set up dedicated goal: Child Higher Education (Target: ₹35L–₹50L)",
  "Add newborn to family health policy within 90 days of birth"]

},
{
  id: "event-job-switch",
  name: "Job Switch / Promotion",
  category: "Career",
  iconName: "Briefcase",
  tagline: "Compensation jump, bonus expansion & stock grant vesting.",
  description: "Raises baseline take-home income and annual bonus capacity. Creates surplus that should be absorbed into automated investing before lifestyle creep.",
  monthlyIncomeDelta: +65000,
  monthlyExpenseDelta: +10000,
  lifeCoverDelta: +2500000,
  healthCoverDelta: 0,
  netWorth10YrDelta: +9800000,
  healthScoreDelta: +8,
  primaryAction: "Direct 60% of net increment into systematic SIPs and loan prepayment.",
  checklist: [
  "Roll over previous company EPF account to current employer via UAN",
  "Maintain personal health insurance cover regardless of corporate coverage",
  "Recalibrate emergency fund to match new elevated monthly expense rate"]

},
{
  id: "event-career-break",
  name: "Career Break / Sabbatical",
  category: "Career",
  iconName: "PauseCircle",
  tagline: "Temporary pause in active salary for study, caregiving or exploration.",
  description: "Halts recurring monthly inflows for 6–12 months. Household must depend entirely on liquid cash reserves and passive investment yields.",
  monthlyIncomeDelta: -250000,
  monthlyExpenseDelta: -15000,
  lifeCoverDelta: 0,
  healthCoverDelta: 0,
  netWorth10YrDelta: -4200000,
  healthScoreDelta: -9,
  primaryAction: "Ring-fence 9–12 months of non-negotiable living expenses in liquid debt funds prior to start.",
  checklist: [
  "Ensure personal health insurance is active with auto-renewal enabled",
  "Pause voluntary SIP step-ups while preserving core retirement compounding",
  "Set up monthly automated withdrawal instruction from liquid buffer"]

},
{
  id: "event-business",
  name: "Starting a Business",
  category: "Career",
  iconName: "Building2",
  tagline: "Transitioning to entrepreneurship, lumpy cashflow & enterprise risk.",
  description: "Substitutes predictable salary with variable enterprise draws. Crucial to strictly segregate personal assets from business capital.",
  monthlyIncomeDelta: -80000,
  monthlyExpenseDelta: +10000,
  lifeCoverDelta: +15000000,
  healthCoverDelta: +1000000,
  netWorth10YrDelta: +18000000,
  healthScoreDelta: -5,
  primaryAction: "Setup a private family trust or MWP (Married Women's Property) Act cover to protect personal assets.",
  checklist: [
  "Structure life insurance under Married Women's Property (MWP) Act to shield from creditors",
  "Build a 12-month personal emergency buffer entirely distinct from company working capital",
  "Establish separate corporate bank and tax entities from day zero"]

},
{
  id: "event-home",
  name: "Home Purchase",
  category: "Property",
  iconName: "Home",
  tagline: "First home or upgrade, down payment deployment & long-term mortgage.",
  description: "Deploys substantial liquid down payment (₹25L–₹35L) and locks in a recurring 15–20 year EMI liability, but anchors household net worth in real property.",
  monthlyIncomeDelta: 0,
  monthlyExpenseDelta: +45000,
  lifeCoverDelta: +8000000,
  healthCoverDelta: 0,
  netWorth10YrDelta: +6500000,
  healthScoreDelta: -3,
  primaryAction: "Match home loan principal with equivalent term insurance and preserve a post-purchase emergency fund.",
  checklist: [
  "Buy dedicated term cover matching 100% of outstanding home loan principal",
  "Ensure post-down payment liquidity does not dip below 6 months of living expenses",
  "Plan annual prepayment strategy using annual performance bonuses to cut interest"]

},
{
  id: "event-early-retirement",
  name: "Early Retirement / FIRE",
  category: "Lifestyle",
  iconName: "Sun",
  tagline: "Transitioning to financial independence and living off investment yields.",
  description: "Active employment ends ahead of conventional age 58. Demands a safe withdrawal rate (SWR) under 3.5% and multi-asset bucket strategy.",
  monthlyIncomeDelta: -250000,
  monthlyExpenseDelta: -20000,
  lifeCoverDelta: -5000000,
  healthCoverDelta: +1500000,
  netWorth10YrDelta: +8500000,
  healthScoreDelta: +12,
  primaryAction: "Implement a 3-bucket cashflow strategy (Cash 3 yrs, Debt 7 yrs, Growth Equity 10+ yrs).",
  checklist: [
  "Verify that accumulated net worth is at least 30x annual expenses",
  "Clear all consumer and vehicle debts to reach zero debt liabilities",
  "Upgrade family health insurance with a high super top-up (₹50L+)"]

},
{
  id: "event-relocation",
  name: "International Relocation",
  category: "Career",
  iconName: "Plane",
  tagline: "Cross-border move, foreign currency earnings & NRI status transition.",
  description: "Transitions tax status to NRI/RNOR. Opportunity to earn in hard currency while compounding domestic assets in India.",
  monthlyIncomeDelta: +180000,
  monthlyExpenseDelta: +85000,
  lifeCoverDelta: +15000000,
  healthCoverDelta: +2000000,
  netWorth10YrDelta: +22000000,
  healthScoreDelta: +7,
  primaryAction: "Re-designate bank accounts to NRE/NRO and align FEMA compliance.",
  checklist: [
  "Convert resident bank accounts to NRO/NRE status as per FEMA regulations",
  "Ensure global health insurance coverage for host destination",
  "Optimize remittance flows into systematic Indian equity investments"]

},
{
  id: "event-second-home",
  name: "Second Home / Holiday Home",
  category: "Property",
  iconName: "Compass",
  tagline: "Vacation retreat, rental yield asset & generational real estate.",
  description: "Requires additional borrowing or capital deployment. Adds property maintenance costs offset partially by vacation rental yield.",
  monthlyIncomeDelta: +15000,
  monthlyExpenseDelta: +28000,
  lifeCoverDelta: +4000000,
  healthCoverDelta: 0,
  netWorth10YrDelta: +4500000,
  healthScoreDelta: -2,
  primaryAction: "Calculate net rental yield after property management costs and evaluate liquidity impact.",
  checklist: [
  "Ensure rental yield exceeds 3.5% net of property tax and upkeep",
  "Structure ownership joint with spouse for capital gain tax efficiency",
  "Ensure monthly EMI does not breach 35% total household debt-to-income"]

}];