import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Spinner from "../../components/Spinner";

function PublicRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate("/");
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <Spinner />;

  if (!isLoading && !isAuthenticated) return children;
}

export default PublicRoute;
