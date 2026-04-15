import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  loginPath?: string;
}

export function ProtectedRoute({ isAuthenticated, loginPath = "/login" }: ProtectedRouteProps) 
{
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}