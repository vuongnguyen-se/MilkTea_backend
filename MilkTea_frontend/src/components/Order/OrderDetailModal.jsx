import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";

const API_INVOICE = "http://localhost:5159/shopAPI/HoaDon";
const API_ORDER_DETAIL = "http://localhost:5159/shopAPI/ChiTietDonHang";

const formatCurrency = (v) =>
  (v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// map enum size
const mapSize = (raw) => {
  if (raw === null || raw === undefined) return "";
  if (typeof raw === "number") {
    return ["S", "M", "L"][raw] ?? "";
  }
  const s = String(raw).toUpperCase();
  return ["S", "M", "L"].includes(s) ? s : "";
};

const OrderInvoiceModal = ({ visible, order, onCancel }) => {
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== LOAD HÓA ĐƠN + CHI TIẾT =====
  useEffect(() => {
    const loadData = async () => {
      if (!order) return;
      setLoading(true);

      try {
        // Hóa đơn
        const hdRes = await fetch(`${API_INVOICE}/${order.code}`);
        const hdJson = hdRes.ok ? await hdRes.json() : null;
        setInvoice(hdJson?.data ?? hdJson);

        // Chi tiết
        const ctRes = await fetch(`${API_ORDER_DETAIL}/${order.code}`);
        const ctJson = ctRes.ok ? await ctRes.json() : [];
        const list = ctJson.data || ctJson || [];

        setItems(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (visible && order) loadData();
    else {
      setInvoice(null);
      setItems([]);
    }
  }, [visible, order]);

  // ===== NHẬN DIỆN TOPPING =====
  const isTopping = (item) => {
    const sp = item.sanPham || item.SanPham;
    const loai = sp?.loaiSP;

    return (
      loai === "Topping" ||
      loai === "TOPPING" ||
      loai === "topping" ||
      loai === 0 // enum cho topping
    );
  };

  // ===== NHÓM TOPPING THEO NƯỚC =====
  const grouped = [];
  let lastDrink = null;

  items.forEach((item) => {
    if (!isTopping(item)) {
      // là NƯỚC
      const drinkGroup = {
        type: "drink",
        item,
        toppings: [],
      };
      grouped.push(drinkGroup);
      lastDrink = drinkGroup;
    } else {
      // là TOPPING
      if (lastDrink) {
        lastDrink.toppings.push(item);
      } else {
        // topping lẻ (hiếm khi xảy ra)
        grouped.push({ type: "topping", item });
      }
    }
  });

  // ===== TÍNH TIỀN =====
  const subtotal = grouped.reduce((sum, g) => {
    if (g.type === "drink") {
      const drink = g.item;
      const unitDrink = drink.donGia ?? drink.sanPham?.giaSP ?? 0;
      const qty = drink.soLuong ?? 1;

      const toppingTotal = g.toppings.reduce((tSum, tp) => {
        const unitTp = tp.donGia ?? tp.sanPham?.giaSP ?? 0;
        return tSum + unitTp * qty;
      }, 0);

      return sum + unitDrink * qty + toppingTotal;
    }

    return sum;
  }, 0);

  const paid = invoice?.soTien ?? order?.total ?? subtotal;
  const discount = Math.max(0, subtotal - paid);

  return (
    <Modal
      open={visible}
      title="Hóa đơn bán lẻ"
      onCancel={onCancel}
      onOk={onCancel}
      okText="Đóng"
      cancelButtonProps={{ style: { display: "none" } }}
      width={420}
      centered
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            border: "1px dashed #ccc",
            padding: 12,
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Trà sữa Bí Bo</div>
            <div>HÓA ĐƠN BÁN LẺ</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>
              {invoice
                ? new Date(invoice.ngay).toLocaleString("vi-VN")
                : new Date().toLocaleString("vi-VN")}
            </div>
          </div>

          <div style={{ fontSize: 11, marginTop: 8 }}>
            Mã đơn: {order?.code}
          </div>
          <div style={{ fontSize: 11 }}>
            Khách: {order?.customerName || "Khách lẻ"}
          </div>

          <div style={{ borderTop: "1px dashed #ccc", margin: "6px 0" }} />

          {/* LIST PRODUCTS */}
          <div style={{ fontWeight: 600, display: "flex", fontSize: 11 }}>
            <div style={{ flex: 3 }}>SP</div>
            <div style={{ flex: 1, textAlign: "right" }}>SL</div>
            <div style={{ flex: 2, textAlign: "right" }}>Thành tiền</div>
          </div>

          <div style={{ borderTop: "1px dashed #ccc", margin: "4px 0" }} />

          {grouped.length === 0 ? (
            <div style={{ fontSize: 11 }}>Không có sản phẩm.</div>
          ) : (
            grouped.map((g, idx) => {
              if (g.type === "drink") {
                const item = g.item;
                const sp = item.sanPham || item.SanPham;

                const name = sp?.tenSP || "Sản phẩm";
                const qty = item.soLuong ?? 1;
                const price = item.donGia ?? sp?.giaSP ?? 0;

                const lineTotal = price * qty;

                const size = mapSize(item.size);

                return (
                  <div key={idx} style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex" }}>
                      <div style={{ flex: 3 }}>{name}</div>
                      <div style={{ flex: 1, textAlign: "right" }}>{qty}</div>
                      <div style={{ flex: 2, textAlign: "right" }}>
                        {formatCurrency(lineTotal)}
                      </div>
                    </div>

                    <div style={{ fontSize: 10, color: "#555" }}>
                      {size ? `Size: ${size}` : ""}
                      {` | Đ: ${item.duong} | Đá: ${item.da}`}
                    </div>

                    {/* toppings */}
                    {g.toppings.map((tp, i2) => {
                      const sp2 = tp.sanPham || tp.SanPham;
                      const tpName = sp2?.tenSP || "Topping";
                      const tpPrice =
                        tp.donGia ?? sp2?.giaSP ?? 0;

                      return (
                        <div
                          key={`${idx}-${i2}`}
                          style={{
                            fontSize: 11,
                            display: "flex",
                            paddingLeft: 8
                          }}
                        >
                          <div style={{ flex: 3 }}>+ {tpName}</div>
                          <div style={{ flex: 1, textAlign: "right" }}>
                            {qty}
                          </div>
                          <div style={{ flex: 2, textAlign: "right" }}>
                            {formatCurrency(tpPrice * qty)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return null;
            })
          )}

          {/* TOTAL */}
          <div style={{ borderTop: "1px dashed #ccc", margin: "6px 0" }} />

          <div style={{ fontSize: 12 }}>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Tổng tiền:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Giảm giá:</span>
              <span>{discount > 0 ? formatCurrency(discount) : "-"}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              <span>Thanh toán:</span>
              <span>{formatCurrency(paid)}</span>
            </div>
          </div>

          <div style={{ borderTop: "1px dashed #ccc", margin: "8px 0" }} />

          <div style={{ textAlign: "center", fontSize: 11 }}>
            Cảm ơn quý khách!
            <br />
            Hẹn gặp lại tại Trà sữa Bí Bo 💚
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OrderInvoiceModal;
