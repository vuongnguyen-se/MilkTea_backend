// src/components/Selling/PaymentPanel.jsx
import React, { useMemo, useState } from 'react';
import { Card, Divider, Button, Tag } from 'antd';
import { formatCurrency } from '../utils/formatCurrency.jsx';
import '../../styles/Selling.css';
import {
  CreditCardOutlined,
  MobileOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const PaymentPanel = ({
  items,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout,
}) => {
  const [customerPhone, setCustomerPhone] = useState("");
  const [promotionCode, setPromotionCode] = useState("");

  // discount chỉ tính khi người dùng bấm ÁP DỤNG
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState(null);

  const safeItems = Array.isArray(items) ? items : [];

  // Tạm tính
  const subtotal = useMemo(
    () =>
      safeItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [safeItems],
  );

  // ===== BẤM ÁP DỤNG =====
  const applyPromo = () => {
    const code = promotionCode.trim().toUpperCase();
    let discount = 0;

    if (!code) {
      setAppliedDiscount(0);
      setAppliedCode(null);
      return;
    }

    // RULE TẠM THỜI
    if (code === "GIANGSINH") discount = 3000;
    else if (code === "NAMMOI2026") discount = 5000;
    else if (code === "HAPPYHOUR") discount = subtotal * 0.1;
    else discount = 0;

    setAppliedDiscount(discount);
    setAppliedCode(code);
  };

  const total = Math.max(0, subtotal - appliedDiscount);

  const handleCheckout = () => {
    onCheckout({
      subtotal,
      discount: appliedDiscount,
      total,
      customerPhone,
      promotionCode: appliedCode, // mã đã xác nhận
    });
  };

  return (
    <div className="sales-column sales-payment">
      <Card title="Thanh toán" bordered={false}>

        {/* KHÁCH HÀNG */}
        <div className="payment-section">
          <div className="payment-label">Khách hàng</div>
          <input
            className="payment-input"
            placeholder="Nhập SĐT khách hàng (bỏ trống = khách lẻ)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        {/* MÃ KHUYẾN MÃI */}
        <div className="payment-section">
          <div className="payment-label">Mã khuyến mãi</div>
          <div className="promo-row">
            <input
              className="payment-input"
              placeholder="Nhập mã khuyến mãi (VD: GIANGSINH)"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value)}
            />
            <Button type="default" onClick={applyPromo}>
              Áp dụng
            </Button>
          </div>

          <div className="promo-tags">
            <Tag onClick={() => setPromotionCode("GIANGSINH")}>GIANGSINH</Tag>
            <Tag onClick={() => setPromotionCode("NAMMOI2026")}>NAMMOI2026</Tag>
            <Tag onClick={() => setPromotionCode("HAPPYHOUR")}>HAPPYHOUR</Tag>
          </div>
        </div>

        <Divider />

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <div className="payment-section">
          <div className="payment-label">Phương thức thanh toán</div>
          <div className="payment-method-container">
            <div
              className={`payment-box ${paymentMethod === "cash" ? "active" : ""}`}
              onClick={() => onPaymentMethodChange("cash")}
            >
              <DollarOutlined className="payment-box-icon" />
              <div className="payment-box-label">Tiền mặt</div>
            </div>

            <div
              className={`payment-box ${paymentMethod === "bank" ? "active" : ""}`}
              onClick={() => onPaymentMethodChange("bank")}
            >
              <CreditCardOutlined className="payment-box-icon" />
              <div className="payment-box-label">Ngân hàng</div>
            </div>

            <div
              className={`payment-box ${paymentMethod === "ewallet" ? "active" : ""}`}
              onClick={() => onPaymentMethodChange("ewallet")}
            >
              <MobileOutlined className="payment-box-icon" />
              <div className="payment-box-label">Ví điện tử</div>
            </div>
          </div>
        </div>

        <Divider />

        {/* TẠM TÍNH */}
        <div className="payment-summary-row">
          <span>Tạm tính</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {/* KHUYẾN MÃI ĐÃ ÁP DỤNG */}
        {appliedDiscount > 0 && (
          <div className="payment-summary-row" style={{ color: "green" }}>
            <span>Khuyến mãi ({appliedCode})</span>
            <span>- {formatCurrency(appliedDiscount)}</span>
          </div>
        )}

        <Divider />

        {/* TỔNG CỘNG */}
        <div className="payment-total-row">
          <span className="payment-total-label">Tổng cộng</span>
          <span className="payment-total-value">
            {formatCurrency(total)}
          </span>
        </div>

        <Button
          type="primary"
          block
          size="large"
          className="btn-checkout"
          onClick={handleCheckout}
          disabled={safeItems.length === 0}
        >
          Thanh toán
        </Button>
      </Card>
    </div>
  );
};

export default PaymentPanel;
