import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import AppLayout from "../components/AppLayout";
import DiceGame from "../pages/DiceGame";

const Homepage = lazy(() => import("../pages/Homepage"));

function Routes() {
  const element = useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "dice", element: <DiceGame /> },
      ],
    },

    { path: "*", element: <PageNotFound /> },
  ]);
  return element;
}

export default Routes;
