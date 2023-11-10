import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../features/authentication/useCurrentUser";
import Spinner from "./Spinner";

function PublicdRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate("/");
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <Spinner />;

  if (!isLoading && !isAuthenticated) return children;
}

export default PublicdRoute;
