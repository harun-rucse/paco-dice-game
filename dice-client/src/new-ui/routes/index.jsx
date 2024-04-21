import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import AppLayout from "../components/AppLayout";

const Homepage = lazy(() => import("../pages/Homepage"));
const DiceGame = lazy(() => import("../pages/DiceGame"));
const Staking = lazy(() => import("../pages/Staking"));

function Routes() {
  const element = useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "dice", element: <DiceGame /> },
        { path: "staking", element: <Staking /> },
      ],
    },

    { path: "*", element: <PageNotFound /> },
  ]);
  return element;
}

export default Routes;
