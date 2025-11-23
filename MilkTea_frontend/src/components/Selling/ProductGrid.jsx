import React from "react";
import { Button, Card, List } from "antd";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { formatCurrency } from "../utils/formatCurrency.jsx";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({ products, onSelectProduct, onFilter, filterType }) => {
  const navigate = useNavigate();
  // Khi chọn sản phẩm
  const handleSelect = (product) => {
    // Topping → không mở modal
    if (product.type === 0) {
      onSelectProduct({
        ...product,
        isToppingOnly: true
      });
      return;
    }

    // Nước → mở modal cấu hình
    onSelectProduct(product);
  };

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
          <Button icon={<HomeOutlined />} onClick={() => navigate("/")}>
            Trở về Dashboard
          </Button>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <div className="product-navbar">
        <Button
          type={filterType === "all" ? "primary" : "default"}
          onClick={() => onFilter("all")}
        >
          Tất Cả
        </Button>

        <Button
          type={filterType === "drink" ? "primary" : "default"}
          onClick={() => onFilter("drink")}
        >
          Thức uống
        </Button>

        <Button
          type={filterType === "topping" ? "primary" : "default"}
          onClick={() => onFilter("topping")}
        >
          Topping
        </Button>
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
