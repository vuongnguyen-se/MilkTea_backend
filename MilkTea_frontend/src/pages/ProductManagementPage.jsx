// src/pages/ProductManagementPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Layout, Button, Input, Select, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Topbar from "../components/Topbar/Topbar.jsx";
import ProductTable from "../components/Product/ProductTable.jsx";
import ProductModal from "../components/Product/ProductModal.jsx";

import "../styles/ProductManagementPage.css";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const API_BASE = "http://localhost:5159/shopAPI/SanPham";

// map API → UI
const mapFromApi = (sp) => ({
  id: sp.idSP,
  code: sp.idSP,
  name: sp.tenSP,
  category: sp.loaiSP === 0 ? "Topping" : "ThucUong",
  price: Number(sp.giaSP),
  isActive: Boolean(sp.tinhtrang),
  description: sp.mota || "",
  imageUrl: "",
  inStock: Boolean(sp.tinhtrang),
});

// map UI → API JSON
const mapToApi = (values) => ({
  idSP: values.code,
  tenSP: values.name,
  giaSP: values.price,
  loaiSP: values.category === "Topping" ? 0 : 1,
  mota: values.description || "",
  tinhtrang: values.inStock ?? true,
});

// tạo mã SP mới
const getNextIdByCategory = (products, category) => {
  const prefix = category === "Topping" ? "TP" : "TS";
  const sameCat = products.filter((p) => p.category === category);

  let maxNumber = 0;
  sameCat.forEach((p) => {
    const code = p.code || "";
    const num = parseInt(code.slice(2), 10);
    if (!isNaN(num) && num > maxNumber) maxNumber = num;
  });

  const nextNum = maxNumber + 1;
  return prefix + String(nextNum).padStart(3, "0");
};

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [form] = Form.useForm();

  // Load data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_BASE);
        const data = await res.json();
        setProducts(data.map(mapFromApi));
      } catch (err) {
        message.error("Không tải được danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // filter list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const keyword = searchText.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(keyword) ||
        p.code.toLowerCase().includes(keyword);

      const matchCategory =
        categoryFilter === "all" || p.category === categoryFilter;

      // ⭐ THÊM LỌC TRẠNG THÁI
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && p.isActive === true) ||
        (statusFilter === "inactive" && p.isActive === false);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchText, categoryFilter, statusFilter]);


  // Add
  const openAddModal = () => {
    const defaultCategory = "ThucUong";
    const nextCode = getNextIdByCategory(products, defaultCategory);

    form.resetFields();
    form.setFieldsValue({
      code: nextCode,
      category: defaultCategory,
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
      inStock: true,
    });
    setEditingProduct(null);
    setModalVisible(true);
  };

  // Edit
  const openEditModal = (item) => {
    setEditingProduct(item);
    form.setFieldsValue({
      code: item.code,
      category: item.category,
      name: item.name,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
      inStock: item.isActive,
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Submit modal
  const submitModal = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct) {
        // UPDATE
        const payload = mapToApi(values);

        const res = await fetch(`${API_BASE}/${editingProduct.code}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        const updated = mapFromApi(json.data);

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
        message.success("Cập nhật thành công");
      } else {
        // ADD
        const finalCode =
          values.code || getNextIdByCategory(products, values.category);

        const payload = mapToApi({ ...values, code: finalCode });

        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        const created = mapFromApi(json.data);
        setProducts((prev) => [...prev, created]);

        message.success("Thêm sản phẩm thành công");
      }

      closeModal();
    } catch (err) {
      message.error("Không thể lưu sản phẩm");
    }
  };

  // DELETE
  const deleteProduct = async (id) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    try {
      const res = await fetch(`${API_BASE}/${target.code}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setProducts((prev) => prev.filter((p) => p.id !== id));
      message.success("Xóa thành công");
    } catch {
      message.error("Không thể xóa");
    }
  };

  // ⭐ FIX CHÍNH: TOGGLE ACTIVE CHUẨN 100%
  const toggleActive = async (id, value) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    // update UI trước
    const newLocal = { ...target, isActive: value, inStock: value };
    setProducts((prev) => prev.map((p) => (p.id === id ? newLocal : p)));

    // payload chính xác
    const payload = {
      idSP: target.code,
      tenSP: target.name,
      giaSP: target.price,
      loaiSP: target.category === "Topping" ? 0 : 1,
      mota: target.description,
      tinhtrang: value,
    };

    try {
      const res = await fetch(`${API_BASE}/${target.code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      message.success("Đã cập nhật trạng thái");
    } catch {
      message.error("Không thể cập nhật");

      // revert nếu lỗi
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !value } : p))
      );
    }
  };

  const handleCategoryChangeInModal = (category) => {
    const nextCode = getNextIdByCategory(products, category);
    form.setFieldsValue({ code: nextCode });
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">
        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Quản lý sản phẩm</h2>
          </div>

          <div className="pm-func">
            <div className="pm-filters">
              <Search
                placeholder="Tìm kiếm…"
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />

              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ minWidth: 150 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="ThucUong">Thức uống</Option>
                <Option value="Topping">Topping</Option>
              </Select>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="active">Đang bán</Option>
                <Option value="inactive">Ngưng bán</Option>
              </Select>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
              Thêm sản phẩm
            </Button>
          </div>

          <ProductTable
            products={filteredProducts}
            onEdit={openEditModal}
            onDelete={deleteProduct}
            onToggleActive={toggleActive}
            loading={loading}
          />
        </div>

        <ProductModal
          visible={modalVisible}
          form={form}
          editingProduct={editingProduct}
          onCancel={closeModal}
          onSubmit={submitModal}
          onCategoryChange={handleCategoryChangeInModal}
        />
      </Content>
    </Layout>
  );
};

export default ProductManagementPage;
