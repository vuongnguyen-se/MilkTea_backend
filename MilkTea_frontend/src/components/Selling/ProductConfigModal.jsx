import React, { useMemo, useState } from 'react';
import { Modal, Radio, Checkbox, Divider, Space } from 'antd';
import { SIZES, SUGAR_LEVELS, ICE_LEVELS, TOPPINGS } from '../data/products.jsx';
import { formatCurrency } from '../utils/formatCurrency.jsx';
import '../../styles/Selling.css';

const ProductConfigModal = ({
  visible,
  product,
  onCancel,
  onAddToCart,
}) => {
  const [size, setSize] = useState('M');
  const [sugar, setSugar] = useState(100);
  const [ice, setIce] = useState(100);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const resetState = () => {
    setSize('M');
    setSugar(100);
    setIce(100);
    setSelectedToppings([]);
  };

  const handleClose = () => {
    resetState();
    onCancel();
  };

  const handleOk = () => {
    if (!product) return;
    const sizeInfo = SIZES.find((s) => s.value === size);
    const toppingsInfo = TOPPINGS.filter((t) =>
      selectedToppings.includes(t.id),
    );

    const toppingsTotal = toppingsInfo.reduce(
      (sum, t) => sum + t.price,
      0,
    );
    const itemPrice = product.basePrice + (sizeInfo?.priceDiff || 0) + toppingsTotal;

    onAddToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      size: size,
      sugar,
      ice,
      toppings: toppingsInfo,
      quantity: 1,
      price: itemPrice,
    });

    resetState();
  };

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const sizeInfo = SIZES.find((s) => s.value === size);
    const toppingsTotal = TOPPINGS.filter((t) =>
      selectedToppings.includes(t.id),
    ).reduce((sum, t) => sum + t.price, 0);
    return product.basePrice + (sizeInfo?.priceDiff || 0) + toppingsTotal;
  }, [product, size, selectedToppings]);

  if (!product) return null;

  return (
    <Modal
      open={visible}
      title={product.name}
      onCancel={handleClose}
      width={520}
      footer={null}
      destroyOnClose
    >
      <div className="product-modal-section">
        <div className="section-label">Size</div>
        <Radio.Group
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <Space wrap>
            {SIZES.map((s) => (
              <Radio.Button key={s.key} value={s.value}>
                {s.label}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <Divider />

      <div className="product-modal-section">
        <div className="section-label">Đường</div>
        <Radio.Group
          value={sugar}
          onChange={(e) => setSugar(e.target.value)}
        >
          <Space wrap>
            {SUGAR_LEVELS.map((l) => (
              <Radio.Button key={l.value} value={l.value}>
                {l.label}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <div className="product-modal-section">
        <div className="section-label">Đá</div>
        <Radio.Group
          value={ice}
          onChange={(e) => setIce(e.target.value)}
        >
          <Space wrap>
            {ICE_LEVELS.map((l) => (
              <Radio.Button key={l.value} value={l.value}>
                {l.label}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <Divider />

      <div className="product-modal-section">
        <div className="section-label">Topping</div>
        <Checkbox.Group
          value={selectedToppings}
          onChange={(values) => setSelectedToppings(values)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {TOPPINGS.map((t) => (
              <div key={t.id} className="topping-row">
                <Checkbox value={t.id}>{t.name}</Checkbox>
                <span className="topping-price">
                  +{formatCurrency(t.price)}
                </span>
              </div>
            ))}
          </Space>
        </Checkbox.Group>
      </div>

      <Divider />

      <div className="product-modal-footer">
        <div className="product-modal-total">
          Tổng tiền: <strong>{formatCurrency(totalPrice)}</strong>
        </div>
        <button
          className="btn-primary"
          onClick={handleOk}
        >
          Thêm vào giỏ - {formatCurrency(totalPrice)}
        </button>
      </div>
    </Modal>
  );
};

export default ProductConfigModal;
