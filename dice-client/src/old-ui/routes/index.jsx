import { lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";

import PageNotFound from "../pages/PageNotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import StakingLayout from "../components/StakingLayout";

const AppLayout = lazy(() => import("../components/AppLayout"));
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const Homepage = lazy(() => import("../pages/Homepage"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminApproval = lazy(() => import("../pages/AdminApproval"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Profile = lazy(() => import("../pages/Profile"));
const AdminWithdrawable = lazy(() => import("../pages/AdminWithdrawable"));
const AdminDeposit = lazy(() => import("../pages/AdminDeposit"));
const Staking = lazy(() => import("../pages/Staking"));
const AdminBurn = lazy(() => import("../pages/AdminBurn"));
const Lottery = lazy(() => import("../pages/Lottery"));

function Routes() {
  const element = useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Homepage /> },
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
      path: "/staking",
      element: <StakingLayout />,
      children: [{ index: true, element: <Staking /> }],
    },

    {
      path: "/lottery",
      element: <StakingLayout />,
      children: [{ index: true, element: <Lottery /> }],
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
      ],
    },

    { path: "*", element: <PageNotFound /> },
  ]);
  return element;
}

export default Routes;
