import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import AppLayout from "../components/AppLayout";

const Homepage = lazy(() => import("../pages/Homepage"));
const DiceGame = lazy(() => import("../pages/DiceGame"));
const Staking = lazy(() => import("../pages/Staking"));
const Lottery = lazy(() => import("../pages/Lottery"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

function Routes() {
  const element = useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "dice", element: <DiceGame /> },
        { path: "staking", element: <Staking /> },
        { path: "lottery", element: <Lottery /> },
      ],
    },

    {
      path: "*",
      element: <AppLayout />,
      children: [{ path: "*", element: <PageNotFound /> }],
    },
  ]);

  return element;
}

export default Routes;
