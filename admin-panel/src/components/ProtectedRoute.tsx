import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { isTokenValide } from "../utils/token";

export const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = isTokenValide(token);
   
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
