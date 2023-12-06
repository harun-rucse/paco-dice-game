import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import PageNotFound from "./pages/PageNotFound";
import Spinner from "./components/Spinner";
import { BalanceProvider } from "./context/BalanceContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicdRoute from "./components/PublicRoute";

const AppLayout = lazy(() => import("./components/AppLayout"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const Homepage = lazy(() => import("./pages/Homepage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminApproval = lazy(() => import("./pages/AdminApproval"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminWithdrawable = lazy(() => import("./pages/AdminWithdrawable"));
const AdminDeposit = lazy(() => import("./pages/AdminDeposit"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BalanceProvider>
        <ReactQueryDevtools initialIsOpen={false} />

        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Homepage />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute roles={["admin", "user"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reset-password/:resetToken"
                  element={
                    <PublicdRoute>
                      <ResetPassword />
                    </PublicdRoute>
                  }
                />

                <Route path="/staking" element={<ComingSoon />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="approval" element={<AdminApproval />} />
                <Route path="withdrawables" element={<AdminWithdrawable />} />
                <Route path="add-deposit" element={<AdminDeposit />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{
            zIndex: 999999999,
          }}
        />
      </BalanceProvider>
    </QueryClientProvider>
  );
}

export default App;
