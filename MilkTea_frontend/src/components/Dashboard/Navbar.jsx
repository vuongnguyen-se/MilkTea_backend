import { Button, Menu } from "antd";
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

  let items = [
    { key: "selling", icon: <ShoppingCartOutlined />, label: "Bán hàng" },
    { key: "order", icon: <AppstoreOutlined />, label: "Quản lý đơn hàng" },
    { key: "product", icon: <AppstoreOutlined />, label: "Quản lý sản phẩm" },
    { key: "promotion", icon: <AppstoreOutlined />, label: "Quản lý khuyến mãi" },
  ];

  // ❌ Nếu là nhân viên → ẩn staff + account + report
  if (user?.role === "QuanLy") {
    items.push(
      { key: "ingredient", icon: <AppstoreOutlined />, label: "Quản lý kho nguyên liệu" },
      { key: "stock-receipts", icon: <AppstoreOutlined />, label: "Quản lý phiếu nhập/xuất" },
      { key: "staff", icon: <TeamOutlined />, label: "Quản lý nhân viên" },
      { key: "account", icon: <TeamOutlined />, label: "Quản lý tài khoản" },
      { key: "report", icon: <BarChartOutlined />, label: "Báo cáo" },
    );
  }


  const handleClick = (e) => {
    switch (e.key) {
      case "selling":
        navigate("/selling");
        break;
      case "product":
        navigate("/management/product");
        break;
      case "ingredient":
        navigate("/management/ingredient");
        break;
      case "staff":
        navigate("/management/staff");
        break;
      case "account":
        navigate("/management/account");
        break;
      case "order":
        navigate("/management/order");
        break;
      case "promotion":
        navigate("/management/promotion");
        break;
      case "stock-receipts":
        navigate("/management/stock-receipts");
        break;
      default:
        break;
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Trà Sữa Bí Bo</h2>
        <Menu
          className="navbar-func"
          mode="horizontal"
          items={items}
          onClick={handleClick}
          style={{ border: "none" }}
        />
      </div>

      <Button danger icon={<LogoutOutlined />} onClick={() => {
        localStorage.removeItem("user");
        navigate("/login");
      }}>Đăng xuất</Button>
    </div>
  );
}
