import React, { useEffect, useMemo, useState } from "react";
import { Layout, Input, Select, message } from "antd";
import dayjs from "dayjs";

import StockReceiptTable from "../components/Ingredient/StockReceiptTable.jsx";
import "../styles/ProductManagementPage.css";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const API_PHIEU = "http://localhost:5159/shopAPI/PhieuKho";

// Hàm bỏ dấu để tìm kiếm
const normalize = (str) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase() || "";

const mapReceiptFromApi = (p) => ({
  id: p.idPhieu,
  code: p.idPhieu,
  ingredientId: p.idNL,
  ingredientName: p.nguyenLieu?.tenNL || p.idNL,
  supplierId: p.idNCC,
  supplierName: p.nhaCungCap?.tenNCC || "",
  quantity: p.soLuong,
  type: p.idNCC ? "nhap" : "xuat",
  rawDate: p.ngay,
  dateText: dayjs(p.ngay).format("DD/MM/YYYY HH:mm"),
  note: p.ghiChu || "",
});

const StockReceiptManagementPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_PHIEU);
      if (!res.ok) throw new Error();

      const json = await res.json();
      const list = json.data || [];

      const mapped = list.map(mapReceiptFromApi);

      // sắp xếp mới nhất lên đầu
      mapped.sort(
        (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
      );

      setReceipts(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách phiếu kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  const filteredReceipts = useMemo(() => {
    const kw = normalize(searchText);

    return receipts.filter((r) => {
      const matchSearch =
        !kw ||
        normalize(r.code).includes(kw) ||
        normalize(r.ingredientName).includes(kw) ||
        normalize(r.ingredientId).includes(kw) ||
        normalize(r.supplierName).includes(kw);

      const matchType = typeFilter === "all" || r.type === typeFilter;

      return matchSearch && matchType;
    });
  }, [receipts, searchText, typeFilter]);

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">
        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Lịch sử phiếu kho</h2>
          </div>

          <div className="pm-func">
            <div className="pm-filters">
              <Search
                placeholder="Tìm theo mã phiếu, nguyên liệu, NCC..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ minWidth: 260 }}
              />

              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 160 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="nhap">Phiếu nhập</Option>
                <Option value="xuat">Phiếu xuất</Option>
              </Select>
            </div>
          </div>

          <StockReceiptTable receipts={filteredReceipts} loading={loading} />
        </div>
      </Content>
    </Layout>
  );
};

export default StockReceiptManagementPage;
