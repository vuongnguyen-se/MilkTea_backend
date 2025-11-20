import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import RecentActivities from "../components/RecentActivities";
import QuickActions from "../components/QuickActions";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css"
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  LineChartOutlined,
  InboxOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";


export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5159/shopAPI/Dashboard")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.log("Lỗi API Dashboard:", err));
  }, []);

  if (!data) return <p>Đang tải dữ liệu Dashboard...</p>;

  return (
    <div>
      {/*Navbar */}
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-body">
          <h2 style={{ marginBottom: 8, fontSize: 26 }}>Dashboard Quản lý</h2>
          <p style={{ marginBottom: 24, fontSize: 16, color: "#666" }}>
            Chào mừng bạn trở lại! Đây là tổng quan hệ thống hôm nay.
          </p>
          {/* Stats Row */}
          {/* HÀNG 1 */}
          <div className="stats-row" style={{ display: "flex", gap: "16px", marginTop: 20 }}>
            <StatCard
              title="Doanh thu hôm nay"
              value={data.todayRevenue.toLocaleString() + "đ"}
              sub="Theo ngày"
              color="#ff6b00"
              icon={<DollarOutlined />}
              style={{ "--left-color": "#ff6b00" }}
            />

            <StatCard
              title="Đơn hàng hôm nay"
              value={data.todayOrders}
              sub="Theo ngày"
              color="#2B7FFF"
              icon={<ShoppingCartOutlined />}
              style={{ "--left-color": "#2B7FFF" }}
            />

            <StatCard
              title="Tổng nhân viên"
              value={data.staffCount}
              sub="Nhân sự"
              color="#00C950"
              icon={<UserAddOutlined />}
              style={{ "--left-color": "#00C950" }}
            />
          </div>

          {/* HÀNG 2 */}
          <div className="stats-row" style={{ display: "flex", gap: "16px", marginTop: 20 }}>
            <StatCard
              title="Doanh thu tháng"
              value={data.monthlyRevenue.toLocaleString() + "đ"}
              sub="Theo tháng"
              color="#B457FF"
              icon={<LineChartOutlined />}
              style={{ "--left-color": "#B457FF" }}
            />

            <StatCard
              title="Cảnh báo tồn kho"
              value={data.lowStock}
              sub="Số nguyên liệu dưới mức an toàn"
              color="#EF4444"          // đỏ cảnh báo
              icon={<ExclamationCircleOutlined />}
              style={{ "--left-color": "#EF4444" }}
            />

            <StatCard
              title="Tổng sản phẩm"
              value={data.totalProducts}
              sub="Tổng số mặt hàng"
              color="#F59E0B"          // vàng cam đẹp
              icon={<InboxOutlined />} // icon kho hàng
              style={{ "--left-color": "#F59E0B" }}
            />
          </div>

          {/* Recent Activities */}
          <RecentActivities data={data.recentActivities} />

          {/* Quick Actions */}
          <QuickActions />
        </div>s
      </div>
    </div >
  );
}
