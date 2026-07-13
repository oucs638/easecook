import {Navigate, Outlet, useLocation} from "react-router";

import {useAuth} from "../auth/useAuth";

export function ProtectedRoute() {
  const {status} = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return <div className="auth-status">Checking session...</div>;
  }

  if (status !== "authenticated") {
    return <Navigate replace state={{from: location.pathname}} to="/login"/>;
  }

  return <Outlet/>;
}
