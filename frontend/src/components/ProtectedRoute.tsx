import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { isTokenValide } from "../utils/token";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = isTokenValide(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
