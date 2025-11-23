import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Radio, Checkbox, Divider, Space } from 'antd';
import { SIZES, SUGAR_LEVELS, ICE_LEVELS } from '../data/products.jsx';
import { formatCurrency } from '../utils/formatCurrency.jsx';
import '../../styles/Selling.css';

const API_SANPHAM = "http://localhost:5159/shopAPI/SanPham";

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

  // ✔ NEW — danh sách topping lấy từ DB
  const [toppingsFromDB, setToppingsFromDB] = useState([]);

  // ================================
  // 🔥 Tải topping có loaiSP = 0 từ DB
  // ================================
  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const res = await fetch(API_SANPHAM);
        const data = await res.json();

        const list = data.data || data;

        const toppings = list.filter(sp => sp.loaiSP === 0 && sp.tinhtrang === true);

        setToppingsFromDB(toppings);
      } catch (err) {
        console.error("Lỗi load topping từ DB:", err);
      }
    };

    fetchToppings();
  }, []);

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

    // Convert list topping được chọn sang dạng BE yêu cầu
    const toppingObjects = toppingsFromDB
      .filter(t => selectedToppings.includes(t.idSP))
      .map(t => ({
        id: t.idSP,
        name: t.tenSP,
        price: t.giaSP,
      }));

    const totalToppingPrice = toppingObjects.reduce(
      (sum, t) => sum + t.price,
      0
    );

    const totalPrice = product.basePrice + totalToppingPrice;

    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      size,
      sugar,
      ice,
      toppings: toppingObjects,
      quantity: 1,
      price: totalPrice,
      isToppingOnly: false,
    };

    onAddToCart(cartItem);
    handleClose();
  };

  const totalPrice = useMemo(() => {
    if (!product) return 0;

    const sizeInfo = SIZES.find((s) => s.value === size);

    const toppingsTotal = toppingsFromDB
      .filter((t) => selectedToppings.includes(t.idSP))
      .reduce((sum, t) => sum + t.giaSP, 0);

    return product.basePrice + (sizeInfo?.priceDiff || 0) + toppingsTotal;
  }, [product, size, selectedToppings, toppingsFromDB]);

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
      {/* SIZE */}
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

      {/* ĐƯỜNG */}
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

      {/* ĐÁ */}
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

      {/* TOPPING */}
      <div className="product-modal-section">
        <div className="section-label">Topping</div>

        <Checkbox.Group
          value={selectedToppings}
          onChange={(values) => setSelectedToppings(values)}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {toppingsFromDB.map((t) => (
              <div key={t.idSP} className="topping-row">
                <Checkbox value={t.idSP}>{t.tenSP}</Checkbox>
                <span className="topping-price">+{formatCurrency(t.giaSP)}</span>
              </div>
            ))}
          </Space>
        </Checkbox.Group>
      </div>

      <Divider />

      {/* FOOTER */}
      <div className="product-modal-footer">
        <div className="product-modal-total">
          Tổng tiền: <strong>{formatCurrency(totalPrice)}</strong>
        </div>

        <button className="btn-primary" onClick={handleOk}>
          Thêm vào giỏ - {formatCurrency(totalPrice)}
        </button>
      </div>
    </Modal>
  );
};

export default ProductConfigModal;
