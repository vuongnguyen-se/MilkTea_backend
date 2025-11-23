// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import SellingPage from "./pages/SellingPage.jsx";

import ProductManagementPage from "./pages/ProductManagementPage.jsx";
import IngredientManagementPage from "./pages/IngredientManagementPage.jsx";
import StaffManagementPage from "./pages/StaffManagementPage.jsx";
import AccountManagementPage from "./pages/AccountManagementPage.jsx";
import OrderManagementPage from "./pages/OrderManagementPage.jsx";
import PromotionManagementPage from "./pages/PromotionManagementPage.jsx";
import StockReceiptManagementPage from "./pages/StockReceiptManagementPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import ManagementLayout from "./layouts/ManagementLayout.jsx";
import Navbar from "./components/Dashboard/Navbar.jsx";
import RequireAuth from "./components/Auth/RequireAuth.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🧭 DASHBOARD */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <>
                <Dashboard />
              </>
            </RequireAuth>
          }
        />

        {/* 🛒 SELLING */}
        <Route
          path="/selling"
          element={
            <RequireAuth>
              <SellingPage />
            </RequireAuth>
          }
        />

        {/* 🏢 MANAGEMENT (DÙNG TOPBAR) */}
        <Route element={<ManagementLayout />}>
          <Route path="/management/product" element={
            <RequireAuth allowRoles={["QuanLy", "NhanVien"]}>
              <ProductManagementPage />
            </RequireAuth>
          }/>
          <Route path="/management/ingredient" element={
            <RequireAuth allowRoles={["QuanLy"]}>
              <IngredientManagementPage />
            </RequireAuth>
          }/>
          <Route path="/management/staff" element={
            <RequireAuth allowRoles={["QuanLy"]}>
              <StaffManagementPage />
            </RequireAuth>
          }/>
          <Route path="/management/account" element={
            <RequireAuth allowRoles={["QuanLy"]}>
              <AccountManagementPage />
            </RequireAuth>
          }/>
          <Route path="/management/order" element={
            <RequireAuth allowRoles={["QuanLy", "NhanVien"]}>
              <OrderManagementPage />
            </RequireAuth>
          }/>
          <Route path="/management/promotion" element={
            <RequireAuth allowRoles={["QuanLy", "NhanVien"]}>
              <PromotionManagementPage />
            </RequireAuth>
          }/>
          <Route path="/management/stock-receipts" element={
            <RequireAuth allowRoles={["QuanLy"]}>
              <StockReceiptManagementPage />
            </RequireAuth>
          }/>
        </Route>

        {/* ❌ MẶC ĐỊNH → DASHBOARD */}
        <Route path="*" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
