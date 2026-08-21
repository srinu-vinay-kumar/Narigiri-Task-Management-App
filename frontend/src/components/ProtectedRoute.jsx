import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth, apiStatusConstants } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, apiStatus } = useAuth();

  if (apiStatus === apiStatusConstants.loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-container__icon" />
      </div>
    );
  }

  if (requireAuth) {
    if (user === null || apiStatus === apiStatusConstants.failure)
      return <Navigate to="/auth/login" replace />;
  }

  if (!requireAuth) {
    if (user && apiStatus === apiStatusConstants.success)
      return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;
