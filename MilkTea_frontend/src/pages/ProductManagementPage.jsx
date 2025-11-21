import React, { useMemo, useState } from "react";
import { Layout, Button, Input, Select, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Topbar from "../components/Topbar/Topbar.jsx";
import ProductTable from "../components/Product/ProductTable.jsx";
import ProductModal from "../components/Product/ProductModal.jsx";

import "../styles/ProductManagementPage.css";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const initialProducts = [
  { id: 1, code: "TS001", name: "Trà Sữa Trân Châu", category: "drink", price: 40000, isActive: true, inStock: true },
  { id: 2, code: "TS002", name: "Trà Oolong Kem Mặn", category: "drink", price: 55000, isActive: true, inStock: true },
  { id: 3, code: "TP001", name: "Trân Châu Đen", category: "topping", price: 5000, isActive: true, inStock: true },
];

const ProductManagementPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.code.toLowerCase().includes(searchText.toLowerCase());

      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [products, searchText, categoryFilter]);

  const openAddModal = () => {
    form.resetFields();
    form.setFieldsValue({ code: Date.now().toString(), category: "drink", price: 0, inStock: true });
    setEditingProduct(null);
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingProduct(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const submitModal = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...values } : p))
        );
      } else {
        setProducts((prev) => [...prev, { id: Date.now(), ...values, isActive: true }]);
      }
      setModalVisible(false);
    });
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleActive = (id, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: value } : p))
    );
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">

        <Topbar activeTab="product" />

        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Quản lý sản phẩm</h2>
          </div>

          <div className="pm-func">
            <div className="pm-filters">
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                onChange={(e) => setSearchText(e.target.value)}
              />

              <Select value={categoryFilter} onChange={setCategoryFilter}>
                <Option value="all">Tất cả</Option>
                <Option value="drink">Thức uống</Option>
                <Option value="topping">Topping</Option>
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
          />
        </div>

        <ProductModal
          visible={modalVisible}
          form={form}
          editingProduct={editingProduct}
          onCancel={() => setModalVisible(false)}
          onSubmit={submitModal}
        />
      </Content>
    </Layout>
  );
};

export default ProductManagementPage;
