import React, { useState } from 'react';
import { Layout } from 'antd';
import ProductGrid from '../components/Selling/ProductGrid.jsx';
import Cart from '../components/Selling/Cart.jsx';
import PaymentPanel from '../components/Selling/PaymentPanel.jsx';
import ProductConfigModal from '../components/Selling/ProductConfigModal.jsx';
import CheckoutSuccessModal from '../components/CheckOut/CheckoutSuccessModal.jsx';
import { PRODUCTS } from '../components/data/products.jsx';
import '../styles/Selling.css';

const { Content } = Layout;

const SalesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [issuingInvoice, setIssuingInvoice] = useState(true);
  const [checkoutInfo, setCheckoutInfo] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setConfigModalVisible(true);
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setConfigModalVisible(false);
  };

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = ({ subtotal, tax, total }) => {
    if (cartItems.length === 0) return;
    setCheckoutInfo({ subtotal, tax, total });
  };

  const handleCloseCheckoutModal = () => {
    setCheckoutInfo(null);
    setCartItems([]);
  };

  return (
    <Layout className="sales-layout">
      <Content className="sales-content">
        <div className="sales-container">
          {/* Cột trái: sản phẩm */}
          <ProductGrid
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
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

      {/* Modal chọn option cho sản phẩm */}
      <ProductConfigModal
        visible={configModalVisible}
        product={selectedProduct}
        onCancel={() => setConfigModalVisible(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Modal thông báo thanh toán thành công */}
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
