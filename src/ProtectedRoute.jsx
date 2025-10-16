import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useAuthContext } from "./helpers/auth/authContext";
import { useCommonContext } from "./helpers/common/CommonContext";

function ProtectedRoute() {
  const navigate = useNavigate();
  const { isLogin, loading } = useAuthContext();
  const { setShow } = useCommonContext();
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" role="status" variant="info">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // if (!isLogin) {
  //   return <Navigate to="/login" replace />;
  // }

  useEffect(() => {
    if (!isLogin) {
      setShow(true);
      navigate("/", { replace: true });
    }
  }, [isLogin, setShow]);

  if (!isLogin) {
    return null; // Don't render the checkout page
  }

  // Proceed to the protected component
  return <Outlet />;
}

export default ProtectedRoute;
