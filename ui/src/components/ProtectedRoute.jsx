import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../features/authentication/useCurrentUser";
import Spinner from "./Spinner";

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
