import React, { useMemo, useState } from "react";
import { Card, Divider, Button, Tag, message } from "antd";
import { formatCurrency } from "../utils/formatCurrency.jsx";
import "../../styles/Selling.css";
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

  const [appliedCode, setAppliedCode] = useState(null);
  const [promoPercent, setPromoPercent] = useState(null);

  const safeItems = Array.isArray(items) ? items : [];

  // ===== TẠM TÍNH =====
  const subtotal = useMemo(
    () => safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [safeItems]
  );

  // ===== ÁP DỤNG MÃ =====
  const applyPromo = async () => {
    const code = promotionCode.trim().toUpperCase();
    if (!code) {
      setAppliedCode(null);
      setPromoPercent(null);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5159/shopAPI/KhuyenMai/Check?code=${code}`
      );

      if (!res.ok) {
        message.error("Mã không hợp lệ hoặc đã hết hạn!");
        setAppliedCode(null);
        setPromoPercent(null);
        return;
      }

      const json = await res.json();

      setAppliedCode(code);
      setPromoPercent(json.percent); // 0.30 = 30%
      message.success("Đã áp dụng mã " + code);

    } catch (err) {
      message.error("Không thể kiểm tra mã giảm giá!");
      setAppliedCode(null);
      setPromoPercent(null);
    }
  };

  // ===== TÍNH GIẢM GIÁ & TỔNG =====
  const discountAmount = promoPercent ? subtotal * promoPercent : 0;
  const estimatedTotal = subtotal - discountAmount;

  // ===== CHECKOUT =====
  const handleCheckout = () => {
    onCheckout({
      customerPhone,
      promotionCode: appliedCode,
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
            placeholder="Nhập SĐT (bỏ trống = khách lẻ)"
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
              placeholder="VD: HAPPYHOUR"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value)}
            />
            <Button onClick={applyPromo}>Áp dụng</Button>
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

        {/* KHUYẾN MÃI */}
        {promoPercent !== null && (
          <div className="payment-summary-row" style={{ color: "green" }}>
            <span>
              Khuyến mãi ({appliedCode} – {promoPercent * 100}%)
            </span>
            <span>- {formatCurrency(discountAmount)}</span>
          </div>
        )}

        <Divider />

        {/* TỔNG CỘNG */}
        <div className="payment-total-row">
          <span className="payment-total-label">Tổng cộng (ước tính)</span>
          <span className="payment-total-value">
            {formatCurrency(estimatedTotal)}
          </span>
        </div>

        <Button
          type="primary"
          block
          size="large"
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
