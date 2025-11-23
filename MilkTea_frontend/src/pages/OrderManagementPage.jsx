/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Input, message, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import OrderTable from "../components/Order/OrderTable.jsx";
import OrderDetailModal from "../components/Order/OrderDetailModal.jsx";
import OrderInvoiceModal from "../components/Order/OrderInvoiceModal.jsx";

import "../styles/ProductManagementPage.css";

const { Content } = Layout;
const { Search } = Input;
const { confirm } = Modal;

const API_ORDERS = "http://localhost:5159/shopAPI/DonHang";

const STATUS = {
  ChoXacNhan: 0,
  DangChuanBi: 1,
  HoanThanh: 2,
  DaHuy: 3,
};

const mapOrderFromApi = (d) => {
  const kh = d.khachHang || d.KhachHang;
  const nv = d.nhanVien || d.NhanVien;
  const km = d.khuyenMai || d.KhuyenMai;

  let promotionText = "";
  if (km) {
    promotionText = `${km.tenKM || ""} (${km.phanTramGiam || 0}%)`;
  }

  return {
    id: d.idDH,
    code: d.idDH,
    customerId: d.idKH,
    customerName: kh?.tenTK || kh?.ten || "Khách lẻ",
    customerPhone: kh?.sdt || kh?.soDienThoai || "",
    staffId: d.idNV,
    staffName: nv?.tenTK || nv?.ten || "",
    promotionId: d.idKM,
    promotionText,
    orderDate: new Date(d.ngayDat).toLocaleString("vi-VN"),
    status: d.trangThai,
    paymentMethod: d.phuongThuc,
    total: d.tinhTong,
    note: d.ghiChu || "",
  };
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // ====== Load danh sách đơn hàng ======
  // ====== Load danh sách đơn hàng ======
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ORDERS);
      if (!res.ok) throw new Error("Fetch đơn hàng thất bại");

      const json = await res.json();
      const list = json.data || json || [];

      const mapped = list
        .map(mapOrderFromApi)
        .sort((a, b) => {
          // lấy số phía sau DHxxx  
          const numA = parseInt(a.code.replace("DH", ""));
          const numB = parseInt(b.code.replace("DH", ""));
          return numB - numA; // giảm dần
        });

      setOrders(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadOrders();
  }, []);

  // ====== Search + filter ======
  const filteredOrders = useMemo(() => {
    const kw = searchText.toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        o.code.toLowerCase().includes(kw) ||
        o.customerName.toLowerCase().includes(kw) ||
        (o.customerPhone || "").toLowerCase().includes(kw);

      const matchStatus =
        statusFilter === "all" ||
        o.status === Number(statusFilter);

      return matchSearch && matchStatus;
    });
  }, [orders, searchText, statusFilter]);

  // ====== Xem chi tiết ======
  const handleViewDetail = (order) => {
    setDetailOrder(order);
    setDetailVisible(true);
  };

  // ====== Chuyển trạng thái tiếp ======
  const handleNextStatus = (order) => {
    confirm({
      title: `Chuyển trạng thái đơn ${order.code}?`,
      icon: <ExclamationCircleFilled />,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await fetch(`${API_ORDERS}/${order.code}/next`, {
            method: "PATCH",
          });
          if (!res.ok) {
            const text = await res.text();
            console.error(text);
            throw new Error("Không thể cập nhật trạng thái");
          }

          await loadOrders();
          message.success("Cập nhật trạng thái thành công");
        } catch (err) {
          console.error(err);
          message.error("Không thể chuyển trạng thái");
        }
      },
    });
  };

  // ====== Hủy đơn ======
  const handleCancelOrder = (order) => {
    confirm({
      title: `Hủy đơn hàng ${order.code}?`,
      icon: <ExclamationCircleFilled />,
      okText: "Hủy đơn",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          const res = await fetch(`${API_ORDERS}/${order.code}/huy`, {
            method: "PATCH",
          });
          if (!res.ok) {
            const text = await res.text();
            console.error(text);
            throw new Error("Không thể hủy đơn");
          }
          await loadOrders();
          message.success("Đã hủy đơn hàng");
        } catch (err) {
          console.error(err);
          message.error("Không thể hủy đơn");
        }
      },
    });
  };

  // ====== Xem hóa đơn ======
  const handleViewInvoice = (order) => {
    setInvoiceOrder(order);
    setInvoiceVisible(true);
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">
        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Quản lý đơn hàng</h2>
          </div>

          <div className="pm-func">
            <div className="pm-filters">
              <Search
                placeholder="Tìm theo mã đơn, tên KH, SĐT..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
              />

              <select
                className="pm-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ minWidth: 160, padding: "4px 8px" }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value={STATUS.ChoXacNhan}>Chờ xác nhận</option>
                <option value={STATUS.DangChuanBi}>Đang chuẩn bị</option>
                <option value={STATUS.HoanThanh}>Hoàn thành</option>
                <option value={STATUS.DaHuy}>Đã hủy</option>
              </select>
            </div>
          </div>

          <OrderTable
            orders={filteredOrders}
            loading={loading}
            onViewDetail={handleViewDetail}
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
            onViewInvoice={handleViewInvoice}
          />
        </div>

        <OrderDetailModal
          visible={detailVisible}
          order={detailOrder}
          onCancel={() => {
            setDetailVisible(false);
            setDetailOrder(null);
          }}
        />

        <OrderInvoiceModal
          visible={invoiceVisible}
          order={invoiceOrder}
          onCancel={() => {
            setInvoiceVisible(false);
            setInvoiceOrder(null);
          }}
        />
      </Content>
    </Layout>
  );
};

export default OrderManagementPage;
