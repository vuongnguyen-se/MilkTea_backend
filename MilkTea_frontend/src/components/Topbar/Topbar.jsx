import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ShopOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  TeamOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "../../styles/ProductManagementPage.css";

const Topbar = ({ activeTab }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="pm-topbar">
      <div className="pm-topbar-left">

        <div className="pm-shop-name">Trà Sữa Bí Bo</div>

        <div className="pm-nav-tabs">

          {/* Bán hàng */}
          <Button
            icon={<ShopOutlined />}
            className={activeTab === "sale" ? "pm-nav-active" : ""}
            onClick={() => navigate("/selling")}
          >
            Bán hàng
          </Button>

          {/* Đơn hàng */}
          <Button
            icon={<ShopOutlined />}
            className={activeTab === "order" ? "pm-nav-active" : ""}
            onClick={() => navigate("/management/order")}
          >
            Quản lý đơn hàng
          </Button>

          {/* Sản phẩm */}
          <Button
            icon={<AppstoreOutlined />}
            className={activeTab === "product" ? "pm-nav-active" : ""}
            onClick={() => navigate("/management/product")}
          >
            Quản lý sản phẩm
          </Button>

          {/* Khuyến mãi */}
          <Button
            icon={<DatabaseOutlined />}
            className={activeTab === "promotion" ? "pm-nav-active" : ""}
            onClick={() => navigate("/management/promotion")}
          >
            Quản lý khuyến mãi
          </Button>

          {/* 🔒 Chỉ Quản Lý mới thấy các mục dưới */}
          {user?.role === "QuanLy" && (
            <>
              <Button
                icon={<DatabaseOutlined />}
                className={activeTab === "ingredient" ? "pm-nav-active" : ""}
                onClick={() => navigate("/management/ingredient")}
              >
                Quản lý kho nguyên liệu
              </Button>

              <Button
                icon={<DatabaseOutlined />}
                className={activeTab === "stock-receipts" ? "pm-nav-active" : ""}
                onClick={() => navigate("/management/stock-receipts")}
              >
                Quản lý phiếu nhập/xuất
              </Button>

              <Button
                icon={<TeamOutlined />}
                className={activeTab === "staff" ? "pm-nav-active" : ""}
                onClick={() => navigate("/management/staff")}
              >
                Quản lý nhân viên
              </Button>

              <Button
                icon={<TeamOutlined />}
                className={activeTab === "account" ? "pm-nav-active" : ""}
                onClick={() => navigate("/management/account")}
              >
                Quản lý tài khoản
              </Button>

              {/* <Button
                icon={<BarChartOutlined />}
                className={activeTab === "report" ? "pm-nav-active" : ""}
                onClick={() => navigate("/management/report")}
              >
                Báo cáo
              </Button> */}
            </>
          )}

        </div>
      </div>

      {/* Phần bên phải */}
      <div className="pm-topbar-right">
        <Button icon={<HomeOutlined />} onClick={() => navigate("/")}>
          Trở về Dashboard
        </Button>

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
    </div>
  );
};

export default Topbar;
