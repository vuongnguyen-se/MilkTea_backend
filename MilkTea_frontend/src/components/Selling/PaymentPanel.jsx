import React, { useMemo } from 'react';
import { Card, Radio, Switch, Divider, Button, Tag } from 'antd';
import { formatCurrency } from '../utils/formatCurrency.jsx';
import '../../styles/Selling.css';
import {
  CreditCardOutlined,
  MobileOutlined,
  DollarOutlined,
} from "@ant-design/icons";


const TAX_RATE = 0.1;

const PaymentPanel = ({
  items,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout,
  issuingInvoice,
  onToggleInvoice,
}) => {
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [items],
  );

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="sales-column sales-payment">
      <Card title="Thanh toán" bordered={false}>
        <div className="payment-section">
          <div className="payment-label">Khách hàng</div>
          <input
            className="payment-input"
            placeholder="Nhập SĐT khách hàng (optional)"
          />
        </div>

        <div className="payment-section">
          <div className="payment-label">Mã khuyến mãi</div>
          <div className="promo-row">
            <input
              className="payment-input"
              placeholder="Nhập mã khuyến mãi"
            />
            <Button type="default">Áp dụng</Button>
          </div>
          <div className="promo-tags">
            <Tag>GIAM10</Tag>
            <Tag>GIAM20</Tag>
            <Tag>GIAM50K</Tag>
          </div>
        </div>

        <Divider />

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

        <div className="payment-section invoice-row">
          <div className="payment-label">In hóa đơn</div>
          <Switch
            checked={issuingInvoice}
            onChange={onToggleInvoice}
          />
        </div>

        <Divider />

        <div className="payment-summary-row">
          <span>Tạm tính</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="payment-summary-row">
          <span>Thuế (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        <Divider />

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
          onClick={() => onCheckout({ subtotal, tax, total })}
          disabled={items.length === 0}
        >
          Thanh toán
        </Button>
      </Card>
    </div>
  );
};

export default PaymentPanel;
