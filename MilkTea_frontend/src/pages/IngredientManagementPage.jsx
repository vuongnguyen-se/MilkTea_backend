import React, { useMemo, useState } from "react";
import { Layout, Button, Input, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import Topbar from "../components/Topbar/Topbar.jsx";
import IngredientModal from "../components/Ingredient/IngredientModal.jsx";
import IngredientTablee from "../components/Ingredient/IngredientTablee.jsx";

import "../styles/ProductManagementPage.css"; // dùng chung style

const { Content } = Layout;
const { Search } = Input;

// fake data ban đầu
const initialIngredients = [
  {
    id: 1,
    code: "TS001",
    name: "Trân Châu Đen",
    expiryDate: "18/02/2024",
    quantity: 150,
    isActive: true,
    imageUrl: "",
  },
  {
    id: 2,
    code: "TS002",
    name: "Bột Kem Béo",
    expiryDate: "18/02/2024",
    quantity: 3, // sẽ hiện tag "Sắp hết"
    isActive: true,
    imageUrl: "",
  },
  {
    id: 3,
    code: "TS003",
    name: "Bột Matcha Cao Cấp",
    expiryDate: "18/02/2024",
    quantity: 0, // sẽ hiện "Hết hàng" và tắt switch
    isActive: false,
    imageUrl: "",
  },
];

const IngredientManagementPage = () => {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [form] = Form.useForm();

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const keyword = searchText.toLowerCase();
      return (
        ing.name.toLowerCase().includes(keyword) ||
        ing.code.toLowerCase().includes(keyword)
      );
    });
  }, [ingredients, searchText]);

  const openAddModal = () => {
    form.resetFields();
    form.setFieldsValue({
      code: Date.now().toString(),
      name: "",
      expiryDate: null,
      quantity: 0,
      imageUrl: "",
      isActive: true,
    });
    setEditingIngredient(null);
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingIngredient(record);
    form.setFieldsValue({
      ...record,
      expiryDate: record.expiryDate
        ? dayjs(record.expiryDate, "DD/MM/YYYY")
        : null,
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingIngredient(null);
    form.resetFields();
  };

  const submitModal = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          ...values,
          expiryDate: values.expiryDate
            ? values.expiryDate.format("DD/MM/YYYY")
            : "",
        };

        if (editingIngredient) {
          setIngredients((prev) =>
            prev.map((ing) =>
              ing.id === editingIngredient.id ? { ...ing, ...payload } : ing
            )
          );
        } else {
          setIngredients((prev) => [
            ...prev,
            { id: Date.now(), ...payload },
          ]);
        }

        closeModal();
      })
      .catch(() => { });
  };

  const deleteIngredient = (id) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const toggleActive = (id, value) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? { ...ing, isActive: value && ing.quantity > 0 }
          : ing
      )
    );
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">
        {/* Topbar dùng chung */}
        <Topbar activeTab="ingredient" />

        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Quản lý kho nguyên liệu</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Thêm nguyên liệu
            </Button>
          </div>

          {/* Tìm kiếm */}
          <div className="pm-filters">
            <Search
              placeholder="Tìm kiếm nguyên liệu..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Bảng nguyên liệu */}
          <IngredientTablee
            ingredients={filteredIngredients}
            onEdit={openEditModal}
            onDelete={deleteIngredient}
            onToggleActive={toggleActive}
          />
        </div>

        {/* Modal thêm / sửa nguyên liệu */}
        <IngredientModal
          visible={modalVisible}
          form={form}
          editingIngredient={editingIngredient}
          onCancel={closeModal}
          onSubmit={submitModal}
        />
      </Content>
    </Layout>
  );
};

export default IngredientManagementPage;
