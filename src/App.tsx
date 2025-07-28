import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as HotToaster } from "react-hot-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuditChecklist from "./pages/AuditChecklist";
import StaffCompliance from "./pages/StaffCompliance";
import Policies from "./pages/Policies";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import ActivityLogs from "./pages/ActivityLogs";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Badge } from "./components/ui/badge";
import ReminderDropdown from "./components/ReminderDropdown";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const [greeting, setGreeting] = useState("Hello");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const name = user?.name || "User";
  const role = user?.role || "user";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);
  if (!token) {
    return children;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Header with Sidebar Toggle */}
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4">
            {/* Sidebar toggle on the left */}
            <SidebarTrigger className="mr-2" />

            {/* Right section with bell + user info */}
            <div className="flex items-center gap-4">
              {/* Reminder bell */}
              <ReminderDropdown />

              {/* Greeting and role info */}
              <div className="text-sm text-muted-foreground text-right">
                Hey,{" "}
                <span className="text-foreground font-semibold">
                  {name + ", " + greeting}
                </span>{" "}
                <Badge variant="outline" className="ml-2 capitalize">
                  {role}
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// Component to handle smooth scroll on route change
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HotToaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <AppLayout>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute
                          allowedRoles={["admin", "staff", "readonly"]}
                        >
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/audit-checklist"
                      element={
                        <ProtectedRoute
                          allowedRoles={["admin", "staff", "readonly"]}
                        >
                          <AuditChecklist />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/staff-compliance"
                      element={
                        <ProtectedRoute
                          allowedRoles={["admin", "staff", "readonly"]}
                        >
                          <StaffCompliance />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/policies"
                      element={
                        <ProtectedRoute
                          allowedRoles={["admin", "staff", "readonly"]}
                        >
                          <Policies />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/alerts"
                      element={
                        <ProtectedRoute
                          allowedRoles={["admin", "staff", "readonly"]}
                        >
                          <Alerts />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "readonly"]}>
                          <Reports />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/user-management"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/activity-logs"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <ActivityLogs />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute
                          allowedRoles={["admin", "staff", "readonly"]}
                        >
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
