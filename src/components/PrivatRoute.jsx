// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user?.isLoggedIn) {
    // Jika belum login, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // Jika bukan admin, bisa tampilkan halaman 403 atau redirect ke home
    return <Navigate to="/403" replace />;
  }

  // Jika admin, render children (Dashboard)
  return children;
};

export default PrivateRoute;
