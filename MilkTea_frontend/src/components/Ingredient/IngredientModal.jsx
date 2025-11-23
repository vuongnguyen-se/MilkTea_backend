// src/components/Ingredient/IngredientModal.jsx
import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import "../../styles/ProductManagementPage.css";

const { Option } = Select;

const IngredientModal = ({
  visible,
  form,
  ingredient,
  mode, // "nhap" | "xuat"
  suppliers = [],
  onCancel,
  onSubmit,
}) => {
  if (!ingredient) return null;

  const title =
    mode === "nhap" ? "Nhập kho nguyên liệu" : "Xuất kho nguyên liệu";

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      onOk={onSubmit}
      okText={mode === "nhap" ? "Nhập kho" : "Xuất kho"}
      cancelText="Hủy"
      width={520}
      destroyOnHidden
    >
      {/* Info nguyên liệu */}
      <div style={{ marginBottom: 12 }}>
        <div>
          <strong>Mã NL:</strong> {ingredient.code}
        </div>
        <div>
          <strong>Tên NL:</strong> {ingredient.name}
        </div>
        <div>
          <strong>Đơn vị:</strong> {ingredient.unit || "-"}
        </div>
        <div>
          <strong>Hạn sử dụng:</strong> {ingredient.expiryDate || "-"}
        </div>
        <div>
          <strong>Tồn hiện tại:</strong> {ingredient.quantity}
        </div>
      </div>

      <Form form={form} layout="vertical">
        {/* Chỉ NHẬP mới cần chọn NCC */}
        {mode === "nhap" && (
          <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
          >
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label={mode === "nhap" ? "Số lượng nhập" : "Số lượng xuất"}
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="VD: 10"
          />
        </Form.Item>

        {/* Xuất: theo bạn chọn B (chỉ cần số lượng) → ẩn ghi chú */}
        {mode === "nhap" && (
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea
              rows={3}
              placeholder="VD: Nhập lô mới từ NCC001..."
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default IngredientModal;
