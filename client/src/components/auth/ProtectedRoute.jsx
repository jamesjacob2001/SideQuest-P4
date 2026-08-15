import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import { buildAuthRedirectState } from "../../utils/authRedirect.js";
import { useAuth } from "./useAuth.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate replace state={buildAuthRedirectState(location)} to="/login" />
    );
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
