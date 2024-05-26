import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import AdminLayout from "../components/admin/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// Lazy-loaded page components
const Homepage = lazy(() => import("../pages/Homepage"));
const DiceGame = lazy(() => import("../pages/DiceGame"));
const Staking = lazy(() => import("../pages/Staking"));
const Lottery = lazy(() => import("../pages/Lottery"));
const Profile = lazy(() => import("../pages/Profile"));
const Referral = lazy(() => import("../pages/Referral"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminApproval = lazy(() => import("../pages/admin/Approval"));
const AdminWithdrawable = lazy(() => import("../pages/admin/Withdrawable"));
const AdminDeposit = lazy(() => import("../pages/admin/Deposit"));
const AdminBurn = lazy(() => import("../pages/admin/Burn"));
const AdminComingSoon = lazy(() => import("../pages/admin/ComingSoon"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

function Routes() {
  const routingElements = useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "dice", element: <DiceGame /> },
        { path: "staking", element: <Staking /> },
        { path: "lottery", element: <Lottery /> },
        { path: "referral", element: <Referral /> },
        { path: "faucet", element: <ComingSoon /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute roles={["admin", "user"]}>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "reset-password/:resetToken",
          element: (
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          ),
        },
      ],
    },

    {
      path: "/admin",
      element: (
        <ProtectedRoute roles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate replace to="dashboard" /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "approval", element: <AdminApproval /> },
        { path: "withdrawables", element: <AdminWithdrawable /> },
        { path: "add-deposit", element: <AdminDeposit /> },
        { path: "burn", element: <AdminBurn /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute roles={["admin", "user"]}>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "staking",
          element: <AdminComingSoon />,
        },
        {
          path: "events",
          element: <AdminComingSoon />,
        },
        {
          path: "lottery",
          element: <AdminComingSoon />,
        },
        {
          path: "users",
          element: <AdminComingSoon />,
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },

    {
      path: "*",
      element: <AppLayout />,
      children: [{ path: "*", element: <PageNotFound /> }],
    },
  ]);

  return routingElements;
}

export default Routes;
