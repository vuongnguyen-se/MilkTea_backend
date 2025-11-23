// src/pages/IngredientManagementPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Layout, Input, Select, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import IngredientTablee from "../components/Ingredient/IngredientTablee.jsx";
import IngredientImportModal from "../components/Ingredient/IngredientImportModal.jsx";

const { Content } = Layout;
const { Search } = Input;

const API_KHO = "http://localhost:5159/shopAPI/KhoNL";
const API_NCC = "http://localhost:5159/shopAPI/NhaCungCap";
const API_CCNL = "http://localhost:5159/shopAPI/CungCapNguyenLieu";
const API_NHAP = "http://localhost:5159/shopAPI/PhieuKho/Nhap";

export default function IngredientManagementPage() {
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [unitFilter, setUnitFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [importModalVisible, setImportModalVisible] = useState(false);

  // Load kho nguyên liệu
  const fetchIngredients = async () => {
    try {
      const res = await fetch(API_KHO);
      const json = await res.json();

      setIngredients(
        json.data.map((i) => ({
          idNL: i.idNL,
          tenNL: i.tenNL,
          donVi: i.donVi,
          soLuongTon: Number(i.soLuongTon),
        }))
      );
    } catch (err) {
      console.error(err);
      message.error("Không thể tải kho nguyên liệu");
    }
  };

  // Load NCC
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_NCC);
      const json = await res.json();

      setSuppliers(
        json.data.map((x) => ({
          id: x.idNCC,
          name: x.tenNCC,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Load ban đầu
  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
  }, []);

  // Filter + Search
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((item) => {
      const keyword = searchText.toLowerCase();
      const matchSearch =
        item.tenNL.toLowerCase().includes(keyword) ||
        item.idNL.toLowerCase().includes(keyword);

      const matchUnit =
        unitFilter === "all" || item.donVi.toLowerCase() === unitFilter;

      return matchSearch && matchUnit;
    });
  }, [ingredients, searchText, unitFilter]);

  // Fetch NL của NCC
  const fetchSupplierIngredients = async (idNCC) => {
    const res = await fetch(`${API_CCNL}/${idNCC}`);
    const json = await res.json();
    return json.data;
  };

  // Submit nhập kho
  const onSubmitImport = async (payload) => {
    try {
      const res = await fetch(API_NHAP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      message.success("Nhập kho thành công");
      fetchIngredients();
    } catch (err) {
      console.error(err);
      message.error("Không thể nhập kho");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: 20 }}>
        <h2>Quản lý kho nguyên liệu</h2>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <Search
            placeholder="Tìm nguyên liệu..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />

          <Select
            value={unitFilter}
            onChange={setUnitFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">Tất cả đơn vị</Select.Option>
            <Select.Option value="kg">kg</Select.Option>
            <Select.Option value="lit">lit</Select.Option>
            <Select.Option value="hop">hộp</Select.Option>
          </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setImportModalVisible(true)}
            style={{ marginLeft: "auto" }}
          >
            Nhập kho từ NCC
          </Button>
        </div>

        {/* Bảng nguyên liệu */}
        <IngredientTablee ingredients={filteredIngredients} />

        {/* Modal nhập kho */}
        <IngredientImportModal
          visible={importModalVisible}
          onClose={() => setImportModalVisible(false)}
          suppliers={suppliers}
          fetchSupplierIngredients={fetchSupplierIngredients}
          onSubmitImport={onSubmitImport}
        />
      </Content>
    </Layout>
  );
}
