import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthProviderContext } from "../../context/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactElement;
  loginPageRoute: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  loginPageRoute,
}) => {
  const { hasCheckedAuth, isAuthenticated } = useAuthProviderContext();
  const location = useLocation();

  if (!isAuthenticated && hasCheckedAuth) {
    // Redirect to login and preserve the location state to come back after logging in.
    return (
      <Navigate
        replace
        state={{ referrer: location.pathname }}
        to={loginPageRoute}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
