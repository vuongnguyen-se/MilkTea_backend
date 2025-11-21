import React from "react";
import { Modal, Form, Input, Select, InputNumber, Switch } from "antd";
import "../../styles/ProductManagementPage.css";

const { Option } = Select;

const ProductModal = ({ visible, form, editingProduct, onCancel, onSubmit }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      okText={editingProduct ? "Lưu" : "Thêm mới"}
      cancelText="Hủy"
      title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      width={620}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <div className="pm-modal-grid">
          <Form.Item
            label="Mã sản phẩm"
            name="code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Loại sản phẩm"
            name="category"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="drink">Thức uống</Option>
              <Option value="topping">Topping</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá (VND)"
          name="price"
          rules={[{ required: true }]}
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

        <Form.Item label="Còn hàng" name="inStock" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
