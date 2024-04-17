import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import AppLayout from "../components/AppLayout";

const Homepage = lazy(() => import("../pages/Homepage"));

function Routes() {
  const element = useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [{ index: true, element: <Homepage /> }],
    },

    { path: "*", element: <PageNotFound /> },
  ]);
  return element;
}

export default Routes;
