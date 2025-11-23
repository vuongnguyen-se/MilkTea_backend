import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";

const API_INVOICE = "http://localhost:5159/shopAPI/HoaDon";
const API_ORDER_DETAIL = "http://localhost:5159/shopAPI/ChiTietDonHang";

const formatCurrency = (v) =>
  (v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const mapSize = (raw) => {
  if (raw === null || raw === undefined) return "";
  if (typeof raw === "number") {
    if (raw === 0) return "S";
    if (raw === 1) return "M";
    if (raw === 2) return "L";
    return "";
  }
  const s = String(raw).toUpperCase();
  if (["S", "M", "L"].includes(s)) return s;
  return "";
};

const OrderInvoiceModal = ({ visible, order, onCancel }) => {
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // load hóa đơn + chi tiết đơn hàng
  useEffect(() => {
    const fetchData = async () => {
      if (!order) return;
      setLoading(true);
      try {
        // hóa đơn
        const hdRes = await fetch(`${API_INVOICE}/${order.code}`);
        let hdData = null;
        if (hdRes.ok) {
          const hdJson = await hdRes.json();
          hdData = hdJson.data ?? hdJson;
        }

        // chi tiết đơn hàng
        const ctRes = await fetch(`${API_ORDER_DETAIL}/${order.code}`);
        let ctList = [];
        if (ctRes.ok) {
          const ctJson = await ctRes.json();
          ctList = ctJson.data || ctJson || [];
        }

        setInvoice(hdData);
        setItems(ctList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (visible && order) {
      fetchData();
    } else {
      setInvoice(null);
      setItems([]);
    }
  }, [visible, order]);

  // tính tổng tiền gốc (nước + topping)
  const subtotal = items.reduce((sum, item) => {
    const unit =
      item.donGia ??
      item.dongia ??
      item.sanPham?.giaSP ??
      item.SanPham?.giaSP ??
      0;
    const qty = item.soLuong ?? item.soluong ?? 1;
    return sum + unit * qty;
  }, 0);

  // số tiền khách thực trả (từ bảng hoadon)
  const paid = invoice?.soTien ?? order?.total ?? subtotal;

  // tiền giảm giá (tổng - thanh toán)
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
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Trà sữa Bí Bo</div>
            <div>HÓA ĐƠN BÁN LẺ</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>
              {invoice
                ? new Date(invoice.ngay).toLocaleString("vi-VN")
                : new Date().toLocaleString("vi-VN")}
            </div>
          </div>

          <div style={{ fontSize: 11, marginBottom: 4 }}>
            Mã đơn: {order?.code}
          </div>
          <div style={{ fontSize: 11, marginBottom: 4 }}>
            Khách: {order?.customerName || "Khách lẻ"}
          </div>

          <div style={{ borderTop: "1px dashed #ccc", margin: "4px 0" }} />

          <div style={{ display: "flex", fontWeight: 600, fontSize: 11 }}>
            <div style={{ flex: 3 }}>SP</div>
            <div style={{ flex: 1, textAlign: "right" }}>SL</div>
            <div style={{ flex: 2, textAlign: "right" }}>Thành tiền</div>
          </div>

          <div style={{ borderTop: "1px dashed #ccc", margin: "4px 0" }} />

          {items.length === 0 ? (
            <div style={{ fontSize: 11 }}>Không có chi tiết đơn hàng.</div>
          ) : (
            items.map((item, idx) => {
              const sp = item.sanPham || item.SanPham;
              const tenSP = sp?.tenSP || sp?.ten || "Sản phẩm";
              const loai = sp?.loaiSP;
              const isTopping =
                loai === 0 ||
                loai === "Topping" ||
                loai === "TOPPING" ||
                loai === "topping";

              const soLuong = item.soLuong ?? item.soluong ?? 1;
              const gia =
                item.donGia ??
                item.dongia ??
                sp?.giaSP ??
                0;
              const thanhTienItem = gia * soLuong;

              const sizeText = mapSize(item.size);
              const noteParts = [];
              if (!isTopping) {
                if (sizeText) noteParts.push(`Size: ${sizeText}`);
                if (item.duong !== undefined && item.duong !== null)
                  noteParts.push(`Đ: ${item.duong}`);
                if (item.da !== undefined && item.da !== null)
                  noteParts.push(`Đá: ${item.da}`);
              }
              const noteText = noteParts.join(" | ");

              return (
                <div key={idx} style={{ marginBottom: 4 }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 3 }}>
                      {isTopping ? `+ ${tenSP}` : tenSP}
                    </div>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      {soLuong}
                    </div>
                    <div style={{ flex: 2, textAlign: "right" }}>
                      {formatCurrency(thanhTienItem)}
                    </div>
                  </div>
                  {!isTopping && noteText && (
                    <div style={{ fontSize: 10, color: "#555" }}>
                      {noteText}
                    </div>
                  )}
                </div>
              );
            })
          )}

          <div style={{ borderTop: "1px dashed #ccc", margin: "4px 0" }} />

          <div style={{ fontSize: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <span>Tổng tiền:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <span>Giảm giá:</span>
              <span>{discount > 0 ? formatCurrency(discount) : "-"}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                fontWeight: 700,
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
