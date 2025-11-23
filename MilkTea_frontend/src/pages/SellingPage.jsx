import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";
import ProductGrid from "../components/Selling/ProductGrid.jsx";
import Cart from "../components/Selling/Cart.jsx";
import PaymentPanel from "../components/Selling/PaymentPanel.jsx";
import ProductConfigModal from "../components/Selling/ProductConfigModal.jsx";
import CheckoutSuccessModal from "../components/CheckOut/CheckoutSuccessModal.jsx";
import "../styles/Selling.css";

const { Content } = Layout;

const API_SANPHAM = "http://localhost:5159/shopAPI/SanPham";
const API_CHECKOUT = "http://localhost:5159/shopAPI/BanHang/Checkout";

const SalesPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [configModalVisible, setConfigModalVisible] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [issuingInvoice, setIssuingInvoice] = useState(true);
  const [checkoutInfo, setCheckoutInfo] = useState(null);

  // ====== LOAD SẢN PHẨM ======
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(API_SANPHAM);
        const data = await res.json();
        if (!res.ok) throw new Error("Lỗi tải sản phẩm");

        const mapped = data.map((sp) => ({
          id: sp.idSP,
          name: sp.tenSP,
          basePrice: Number(sp.giaSP),
          type: sp.loaiSP, // 0: Topping, 1: Thức uống
          status: Boolean(sp.tinhtrang),
        }));

        const active = mapped.filter((p) => p.status);
        setAllProducts(active);
        setProducts(active);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải danh sách sản phẩm!");
      }
    };

    loadProducts();
  }, []);

  // ====== LỌC ======
  const applyFilter = (type) => {
    setFilterType(type);
    if (type === "all") {
      setProducts(allProducts);
    } else if (type === "drink") {
      setProducts(allProducts.filter((p) => p.type === 1));
    } else if (type === "topping") {
      setProducts(allProducts.filter((p) => p.type === 0));
    }
  };

  // ====== CHỌN SẢN PHẨM ======
  const handleSelectProduct = (product) => {
    // Topping -> add thẳng vào giỏ
    if (product.type === 0) {
      const item = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        size: "M",
        sugar: 100,
        ice: 100,
        toppings: [],
        quantity: 1,
        price: product.basePrice,
      };
      setCartItems((prev) => [...prev, item]);
      return;
    }

    // Nước -> mở modal cấu hình
    setSelectedProduct(product);
    setConfigModalVisible(true);
  };

  // ====== GIỎ HÀNG ======
  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setConfigModalVisible(false);
    setSelectedProduct(null);
  };

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ====== CHECKOUT (GỌI BACKEND) ======
  const handleCheckout = async ({ customerPhone, promotionCode }) => {
    if (cartItems.length === 0) return;

    try {
      const payload = {
        items: cartItems,
        paymentMethod,
        customerPhone: customerPhone || null,
        promotionCode: promotionCode || null,
        issuingInvoice,
      };

      const res = await fetch(API_CHECKOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        message.error(text || "Thanh toán thất bại");
        return;
      }

      const json = await res.json();

      setCheckoutInfo({
        subtotal: json.subtotal,
        discount: json.discount,
        total: json.total,
        orderCode: json.idDH,
      });

      message.success("Thanh toán thành công");
      setCartItems([]);
    } catch (err) {
      console.error(err);
      message.error("Không thể kết nối server");
    }
  };

  const handleCloseCheckoutModal = () => {
    setCheckoutInfo(null);
  };

  return (
    <Layout className="sales-layout">
      <Content className="sales-content">
        <div className="sales-container">
          {/* Cột trái: sản phẩm */}
          <ProductGrid
            products={products}
            onSelectProduct={handleSelectProduct}
            onFilter={applyFilter}
            filterType={filterType}
          />

          {/* Cột giữa: giỏ hàng */}
          <Cart
            items={cartItems}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />

          {/* Cột phải: thanh toán */}
          <PaymentPanel
            items={cartItems}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onCheckout={handleCheckout}
            issuingInvoice={issuingInvoice}
            onToggleInvoice={setIssuingInvoice}
          />
        </div>
      </Content>

      {/* Modal cấu hình sản phẩm */}
      <ProductConfigModal
        visible={configModalVisible}
        product={selectedProduct}
        onCancel={() => {
          setConfigModalVisible(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Modal thông báo thanh toán */}
      <CheckoutSuccessModal
        visible={!!checkoutInfo}
        total={checkoutInfo?.total || 0}
        paymentMethod={paymentMethod}
        issuingInvoice={issuingInvoice}
        onClose={handleCloseCheckoutModal}
      />
    </Layout>
  );
};

export default SalesPage;
