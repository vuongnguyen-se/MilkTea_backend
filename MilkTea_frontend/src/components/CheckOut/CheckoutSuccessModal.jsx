import React, { useEffect, useState } from 'react';
import { Modal, Result, Statistic, Button } from 'antd';
import { formatCurrency } from '../utils/formatCurrency';
import '../../styles/Selling.css'

const { Countdown } = Statistic;

const CheckoutSuccessModal = ({
  visible,
  total,
  paymentMethod,
  issuingInvoice,
  onClose,
}) => {
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    if (visible) {
      setDeadline(Date.now() + 5000);
    }
  }, [visible]);

  const handleFinishCountdown = () => {
    if (visible) {
      onClose();
    }
  };

  const paymentText =
    paymentMethod === 'cash'
      ? 'Tiền mặt'
      : paymentMethod === 'bank'
        ? 'Ngân hàng'
        : 'Ví điện tử';

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onClose}
      centered
      width={480}
    >
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle={
          <>
            <div>Phương thức: {paymentText}</div>
            {issuingInvoice && <div>Sẽ in hóa đơn cho khách.</div>}
            <div>Tổng tiền: {formatCurrency(total)}</div>
          </>
        }
        extra={
          <Button type="primary" onClick={onClose}>
            Đóng ngay
          </Button>
        }
      />
      {deadline && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <small>
            Tự động đóng sau{' '}
            <Countdown
              value={deadline}
              format="s"
              onFinish={handleFinishCountdown}
            />{' '}
            giây
          </small>
        </div>
      )}
    </Modal>
  );
};

export default CheckoutSuccessModal;
