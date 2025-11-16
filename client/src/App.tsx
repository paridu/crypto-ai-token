import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainLayout from "./components/MainLayout";
import { useAuth } from "@/_core/hooks/useAuth";

import Dashboard from "./pages/DashboardEnhanced";
import Watchlist from "./pages/Watchlist";
import Alerts from "./pages/Alerts";
import Arbitrage from "./pages/Arbitrage";
import Predictions from "./pages/Predictions";
import Settings from "./pages/Settings";
import Portfolio from "./pages/Portfolio";
import CryptoDetails from "./pages/CryptoDetails";
import Trading from "./pages/Trading";
import LiveTrading from "./pages/LiveTrading";
import Landing from "./pages/Landing";
import RLDetails from "./pages/RLDetails";
import AIInsights from "./pages/AIInsights";

function Router() {
  const { isAuthenticated } = useAuth();

  // make sure to consider if you need authentication for certain routes
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={isAuthenticated ? Dashboard : Landing} />
        <Route path="/dashboard-old" component={Dashboard} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/arbitrage" component={Arbitrage} />
        <Route path="/predictions" component={Predictions} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/settings" component={Settings} />
        <Route path="/trading" component={Trading} />
        <Route path="/live-trading" component={LiveTrading} />
        <Route path="/rl-details" component={RLDetails} />
        <Route path="/ai-insights" component={AIInsights} />
        <Route path="/crypto/:symbol" component={CryptoDetails} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
