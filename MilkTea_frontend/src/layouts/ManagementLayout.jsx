// src/layouts/ManagementLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import Topbar from "../components/Topbar/Topbar.jsx";

export default function ManagementLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Topbar />
      <div style={{ paddingTop: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}
