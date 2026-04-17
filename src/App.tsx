import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DashboardV2 from "./pages/dashboard/Index";
import AccountsPageV2 from "./pages/dashboard/Accounts";
import CopyGroupsPageV2 from "./pages/dashboard/CopyGroups";
import { UserProvider } from "./contexts/UserContext";
import SignalHubPage from "./pages/dashboard/SignalHub";
import HistoryPageV2 from "./pages/dashboard/History";
import LogsPageV2 from "./pages/dashboard/Logs";
import SettingsPageV2 from "./pages/dashboard/Settings";
import SocialHubPage from "./pages/SocialHub";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/AuthRoutes";


import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardV2 /></ProtectedRoute>} />
          <Route path="/dashboard/accounts" element={<ProtectedRoute><AccountsPageV2 /></ProtectedRoute>} />
          <Route path="/dashboard/groups" element={<ProtectedRoute><CopyGroupsPageV2 /></ProtectedRoute>} />
          <Route path="/dashboard/signals" element={<ProtectedRoute><SignalHubPage /></ProtectedRoute>} />
          <Route path="/dashboard/history" element={<ProtectedRoute><HistoryPageV2 /></ProtectedRoute>} />
          <Route path="/dashboard/logs" element={<ProtectedRoute><LogsPageV2 /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPageV2 /></ProtectedRoute>} />
          <Route path="/social-hub" element={<SocialHubPage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />

          {/* Placeholder for future routes */}

          <Route path="*" element={<div className="flex items-center justify-center h-screen text-white bg-[#131313]">404 - Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
