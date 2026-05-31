import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, isHydrating } = useAuthStore();

  // Still checking the refresh cookie — don't redirect yet
  if (isHydrating) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;