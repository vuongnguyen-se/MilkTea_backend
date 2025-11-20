import { Card } from "antd";
import { ShoppingCartOutlined, InboxOutlined, UserAddOutlined, LineChartOutlined } from "@ant-design/icons";
import "./../styles/QuickActions.css";

export default function QuickActions() {
  const items = [
    { icon: <ShoppingCartOutlined />, label: "Bán hàng", color: "#FF6900" },
    { icon: <InboxOutlined />, label: "Nhập kho", color: "#2B7FFF" },
    { icon: <UserAddOutlined />, label: "Thêm NV", color: "#00C950" },
    { icon: <LineChartOutlined />, label: "Xem BC", color: "#B457FF" },
  ];

  return (
    <Card title="Thao tác nhanh" style={{ borderRadius: 12 }}>
      <div className="quick-wrapper">
        {items.map((item, i) => (
          <Card
            key={i}
            className="quick-card"
            style={{ "--hover-color": item.color }}  // 🌟 CHỈ THÊM DÒNG NÀY
          >
            <div className="quick-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="quick-label">{item.label}</div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
