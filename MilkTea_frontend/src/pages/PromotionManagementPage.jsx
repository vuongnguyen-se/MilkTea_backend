// src/pages/PromotionManagementPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Button, Input, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import PromotionTable from "../components/Promotion/PromotionTable.jsx";
import PromotionModal from "../components/Promotion/PromotionModal.jsx";

import "../styles/ProductManagementPage.css"; // 💚 DÙNG CHUNG STYLE

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const API_BASE = "http://localhost:5159/shopAPI/KhuyenMai";

// map API → UI
const mapFromApi = (km) => ({
  id: km.idKM,
  code: km.idKM,
  name: km.tenKM,
  shortcut: km.tenKhuyenMai,
  percent: Number(km.phanTramGiam),
  start: km.ngayBatDau,
  end: km.ngayKetThuc,
});

const mapToApi = (v) => ({
  idKM: v.code,
  tenKM: v.name,
  tenKhuyenMai: v.shortcut,
  phanTramGiam: v.percent,
  ngayBatDau: v.start,
  ngayKetThuc: v.end,
});

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_BASE);
        const json = await res.json();
        setPromotions(json.data.map(mapFromApi));
      } catch {
        message.error("Không thể tải danh sách khuyến mãi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // xác định trạng thái theo ngày
  const checkStatus = (km) => {
    const now = new Date();
    const start = new Date(km.start);
    const end = new Date(km.end);

    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "active";
  };

  // lọc
  const filtered = useMemo(() => {
    return promotions.filter((km) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        km.code.toLowerCase().includes(keyword) ||
        km.name.toLowerCase().includes(keyword) ||
        km.shortcut.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "all" || checkStatus(km) === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [promotions, search, statusFilter]);

  // mở modal thêm
  const openAdd = () => {
    setEditing(null);
    setModalVisible(true);
  };

  // mở modal sửa
  const openEdit = (item) => {
    setEditing(item);
    setModalVisible(true);
  };

  // xóa
  const remove = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setPromotions((prev) => prev.filter((km) => km.id !== id));
      message.success("Xóa thành công");
    } catch {
      message.error("Không thể xóa");
    }
  };

  // lưu
  const save = async (values) => {
    const payload = mapToApi(values);

    if (editing) {
      // update
      try {
        const res = await fetch(`${API_BASE}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        const updated = mapFromApi(json.data);

        setPromotions((prev) =>
          prev.map((km) => (km.id === editing.id ? updated : km))
        );

        message.success("Cập nhật thành công");
      } catch {
        message.error("Không thể cập nhật");
      }
    } else {
      // create
      try {
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        const created = mapFromApi(json.data);

        setPromotions((prev) => [...prev, created]);
        message.success("Thêm thành công");
      } catch {
        message.error("Không thể tạo mới");
      }
    }

    setModalVisible(false);
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">

        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Quản lý khuyến mãi</h2>
          </div>

          <div className="pm-func">
            <div className="pm-filters">

              <Search
                placeholder="Tìm kiếm…"
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />

              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 180 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="active">Đang diễn ra</Option>
                <Option value="upcoming">Sắp diễn ra</Option>
                <Option value="expired">Đã kết thúc</Option>
              </Select>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAdd}
            >
              Thêm khuyến mãi
            </Button>
          </div>

          <PromotionTable
            data={filtered}
            loading={loading}
            onEdit={openEdit}
            onDelete={remove}
          />
        </div>

        <PromotionModal
          visible={modalVisible}
          editing={editing}
          onCancel={() => setModalVisible(false)}
          onSubmit={save}
        />
      </Content>
    </Layout>
  );
};

export default PromotionManagementPage;
