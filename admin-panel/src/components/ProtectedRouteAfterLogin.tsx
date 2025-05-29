import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store";
import { isTokenValide } from "../utils/token";

export const ProtectedRouteAfterLogin = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = isTokenValide(token);


  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
