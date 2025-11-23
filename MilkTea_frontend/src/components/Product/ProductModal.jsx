// src/components/Product/ProductModal.jsx
import React from "react";
import { Modal, Form, Input, Select, InputNumber, Switch } from "antd";
import "../../styles/ProductManagementPage.css";

const { Option } = Select;

const ProductModal = ({
  visible,
  form,
  editingProduct,
  onCancel,
  onSubmit,
  onCategoryChange, // ✅ thêm prop
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      okText={editingProduct ? "Lưu" : "Thêm mới"}
      cancelText="Hủy"
      title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      width={620}
      destroyOnHidden
    >
      <Form layout="vertical" form={form}>
        <div className="pm-modal-grid">
          <Form.Item
            label="Mã sản phẩm"
            name="code"
            rules={[{ required: true, message: "Mã sản phẩm là bắt buộc" }]}
          >
            <Input placeholder="Sẽ tự sinh theo loại sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Loại sản phẩm"
            name="category"
            rules={[{ required: true, message: "Chọn loại sản phẩm" }]}
          >
            <Select
              onChange={(value) => {
                if (onCategoryChange) onCategoryChange(value);
              }}
            >
              <Option value="ThucUong">Thức uống</Option>
              <Option value="Topping">Topping</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá (VND)"
          name="price"
          rules={[{ required: true, message: "Nhập giá" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={1000}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            parser={(v) => v.replace(/\./g, "")}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="URL hình ảnh" name="imageUrl">
          <Input />
        </Form.Item>

        <Form.Item label="Còn bán" name="inStock" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
