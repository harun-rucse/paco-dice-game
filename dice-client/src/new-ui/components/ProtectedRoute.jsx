import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Spinner from "../../components/Spinner";

function ProtectedRoute({ children, roles = [] }) {
  const navigate = useNavigate();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !roles.includes(user?.role)) navigate("/");
  }, [user, isLoading, roles, navigate]);

  if (isLoading) return <Spinner />;

  if (roles.includes(user?.role)) return children;
}

export default ProtectedRoute;
