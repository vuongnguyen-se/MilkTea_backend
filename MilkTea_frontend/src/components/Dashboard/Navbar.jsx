import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import {
  LogoutOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const items = [
    { key: "selling", icon: <ShoppingCartOutlined />, label: "Bán hàng" },
    { key: "order", icon: <AppstoreOutlined />, label: "Quản lý đơn hàng" },
    { key: "product", icon: <AppstoreOutlined />, label: "Quản lý sản phẩm" },
    { key: "promotion", icon: <AppstoreOutlined />, label: "Quản lý khuyến mãi" },
  ];

  if (user?.role === "QuanLy") {
    items.push(
      { key: "ingredient", icon: <AppstoreOutlined />, label: "Quản lý kho nguyên liệu" },
      { key: "stock-receipts", icon: <AppstoreOutlined />, label: "Quản lý phiếu nhập/xuất" },
      { key: "staff", icon: <TeamOutlined />, label: "Quản lý nhân viên" },
      { key: "account", icon: <TeamOutlined />, label: "Quản lý tài khoản" },
      // { key: "report", icon: <BarChartOutlined />, label: "Báo cáo" },
    );
  }

  const handleClick = (key) => {
    switch (key) {
      case "selling": navigate("/selling"); break;
      case "order": navigate("/management/order"); break;
      case "product": navigate("/management/product"); break;
      case "promotion": navigate("/management/promotion"); break;
      case "ingredient": navigate("/management/ingredient"); break;
      case "stock-receipts": navigate("/management/stock-receipts"); break;
      case "staff": navigate("/management/staff"); break;
      case "account": navigate("/management/account"); break;
      case "report": navigate("/management/report"); break;
      default: break;
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Trà Sữa Bí Bo</h2>

        <div className="navbar-tabs">
          {items.map(item => (
            <Button
              key={item.key}
              icon={item.icon}
              className="navbar-tab"
              onClick={() => handleClick(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Button
        danger
        icon={<LogoutOutlined />}
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Đăng xuất
      </Button>
    </div>
  );
}
