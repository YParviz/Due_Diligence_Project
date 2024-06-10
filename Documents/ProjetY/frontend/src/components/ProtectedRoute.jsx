import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user.logged) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
