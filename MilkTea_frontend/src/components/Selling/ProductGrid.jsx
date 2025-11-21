import React from "react";
import { Button, Card, List } from "antd";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { formatCurrency } from "../utils/formatCurrency.jsx";

const ProductGrid = ({ products, onSelectProduct }) => {
  return (
    <div className="sales-column sales-products">

      {/* ===== HEADER + ACTIONS ===== */}
      <div className="left-header">
        <div className="left-header-info">
          <div className="left-header-title">Trà Sữa Bí Bo</div>
          <div className="left-header-subtitle">
            Chọn món để thêm vào đơn hàng
          </div>
        </div>

        <div className="left-header-actions">
          <Button icon={<HomeOutlined />}>Trở về Dashboard</Button>
          <Button danger icon={<LogoutOutlined />}>Đăng xuất</Button>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <div className="product-navbar">
        <Button type="default">Quản lý sản phẩm</Button>
        <Button type="default">Báo cáo</Button>
        <Button type="default">Quản lý nguyên liệu</Button>
        <Button type="default">Quản lý nhân viên</Button>
        <Button type="primary" className="active">Tất Cả</Button>
        <Button type="default">Thức uống</Button>
      </div>

      {/* ===== GRID SẢN PHẨM ===== */}
      <div className="product-grid">
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <Card
                hoverable
                className="product-card"
                onClick={() => onSelectProduct(product)}
              >
                <div className="product-card-image" />
                <div className="product-card-body">
                  <div className="product-card-name">{product.name}</div>
                  <div className="product-card-price">
                    {formatCurrency(product.basePrice)}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ProductGrid;
