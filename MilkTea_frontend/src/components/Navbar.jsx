import { Button, Menu } from "antd";
import "./../styles/Navbar.css"; // thêm css
import {
  LogoutOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export default function Navbar() {
  const items = [
    { key: "1", icon: <ShoppingCartOutlined />, label: "Bán hàng" },
    { key: "2", icon: <AppstoreOutlined />, label: "Quản lý kho nguyên liệu" },
    { key: "3", icon: <TeamOutlined />, label: "Quản lý nhân viên" },
    { key: "4", icon: <BarChartOutlined />, label: "Báo cáo" },
  ];

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Trà Sữa Bí Bo</h2>
        <Menu className="navbar-func" mode="horizontal" items={items} style={{ border: "none" }} />
      </div>

      <Button className="button" danger icon={<LogoutOutlined />}>Đăng xuất</Button>
    </div>
  );
}
