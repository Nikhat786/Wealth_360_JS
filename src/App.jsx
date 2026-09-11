import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/app-context";
import { ScrollToTop } from "@/components/wealth/scroll-to-top";

import IndexPage from "./routes/index";
import PortfolioPage from "./routes/portfolio";
import DebtPage from "./routes/debt";
import TransferPage from "./routes/transfer";
import ScorePage from "./routes/score";
import ProtectPage from "./routes/protect";
import ProfilePage from "./routes/profile";
import PlansPage from "./routes/plans";
import OnboardingPage from "./routes/onboarding";
import LifeEventsPage from "./routes/life-events";
import KnowPage from "./routes/know";
import InsightsPage from "./routes/insights";
import GoalsIndexPage from "./routes/goals.index";
import GoalsGoalIdPage from "./routes/goals.$goalId";
import CoachPage from "./routes/coach";
import AnalysisPage from "./routes/analysis";
import AccountAggregatorPage from "./routes/account-aggregator";
import WelcomePage from "./routes/welcome";
import Wealth360LandingPage from "./routes/wealth360";
import Wealth360ReviewPage from "./routes/wealth360.review";
import WealthVerseBusinessPage from "./routes/wealthverse-business";
import RmLoginPage from "./routes/rm.login";
import RmDashboardPage from "./routes/rm.dashboard";
import RmClientPage from "./routes/rm.client";

const queryClient = new QueryClient();

// This replaces the TanStack Router RootComponent
function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ScrollToTop />
        <Outlet />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Navigate to="/wealth360" replace />} />
          <Route path="/dashboard" element={<IndexPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/debt" element={<DebtPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/score" element={<ScorePage />} />
          <Route path="/protect" element={<ProtectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/life-events" element={<LifeEventsPage />} />
          <Route path="/know" element={<KnowPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/goals" element={<GoalsIndexPage />} />
          <Route path="/goals/:goalId" element={<GoalsGoalIdPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/account-aggregator" element={<AccountAggregatorPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/wealth360" element={<Wealth360LandingPage />} />
          <Route path="/wealth360/journey" element={<OnboardingPage />} />
          <Route path="/wealth360/review" element={<Wealth360ReviewPage />} />
          <Route path="/wealth360/analysis" element={<AnalysisPage />} />
          <Route path="/wealth360/dashboard" element={<IndexPage />} />
          <Route path="/rm/login" element={<RmLoginPage />} />
          <Route path="/rm/dashboard" element={<RmDashboardPage />} />
          <Route path="/rm/client/:clientId" element={<RmClientPage />} />
          <Route path="/rm/revenue-model" element={<WealthVerseBusinessPage />} />
          <Route path="/wealthverse-business" element={<WealthVerseBusinessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
