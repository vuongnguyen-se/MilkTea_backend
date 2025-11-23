// src/components/Auth/RequireAuth.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children, allowRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ❌ Không có user → quay về login
  if (!user) return <Navigate to="/login" replace />;

  // ❌ Nếu role không đúng → về dashboard (không cho vào)
  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireAuth;
