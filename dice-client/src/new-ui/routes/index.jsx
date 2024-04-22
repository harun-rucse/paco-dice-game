import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy-loaded page components
const Homepage = lazy(() => import("../pages/Homepage"));
const DiceGame = lazy(() => import("../pages/DiceGame"));
const Staking = lazy(() => import("../pages/Staking"));
const Lottery = lazy(() => import("../pages/Lottery"));
const Profile = lazy(() => import("../pages/Profile"));
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
        { path: "referral", element: <ComingSoon /> },
        { path: "faucet", element: <ComingSoon /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute roles={["admin", "user"]}>
              <Profile />
            </ProtectedRoute>
          ),
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
