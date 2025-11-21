import React from "react";
import { Button } from "antd";
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
  return (
    <div className="pm-topbar">
      <div className="pm-topbar-left">
        <div className="pm-shop-name">Trà Sữa Bí Bo</div>

        <div className="pm-nav-tabs">
          <Button
            icon={<ShopOutlined />}
            className={activeTab === "sale" ? "pm-nav-active" : ""}
          >
            Bán hàng
          </Button>

          <Button
            icon={<AppstoreOutlined />}
            className={activeTab === "product" ? "pm-nav-active" : ""}
          >
            Quản lý sản phẩm
          </Button>

          <Button
            icon={<BarChartOutlined />}
            className={activeTab === "report" ? "pm-nav-active" : ""}
          >
            Báo cáo
          </Button>

          <Button
            icon={<DatabaseOutlined />}
            className={activeTab === "ingredient" ? "pm-nav-active" : ""}
          >
            Quản lý nguyên liệu
          </Button>

          <Button
            icon={<TeamOutlined />}
            className={activeTab === "staff" ? "pm-nav-active" : ""}
          >
            Quản lý nhân viên
          </Button>
        </div>
      </div>

      <div className="pm-topbar-right">
        <Button icon={<HomeOutlined />}>Trở về Dashboard</Button>
        <Button danger icon={<LogoutOutlined />}>Đăng xuất</Button>
      </div>
    </div>
  );
};

export default Topbar;
