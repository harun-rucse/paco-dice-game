import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../features/authentication/useCurrentUser";
import Spinner from "./Spinner";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user?.role !== "admin") navigate("/");
  }, [user, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  if (user?.role === "admin") return children;
}

export default ProtectedRoute;
