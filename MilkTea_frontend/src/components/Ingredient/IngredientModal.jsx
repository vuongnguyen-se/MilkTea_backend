import React from "react";
import { Modal, Form, Input, DatePicker, InputNumber, Switch } from "antd";
import dayjs from "dayjs";
import "../../styles/ProductManagementPage.css";

const IngredientModal = ({
  visible,
  form,
  editingIngredient,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      open={visible}
      title={
        editingIngredient ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"
      }
      onCancel={onCancel}
      onOk={onSubmit}
      okText={editingIngredient ? "Lưu" : "Thêm mới"}
      cancelText="Hủy"
      width={620}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã nguyên liệu"
          name="code"
          rules={[{ required: true, message: "Nhập mã nguyên liệu" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên nguyên liệu"
          name="name"
          rules={[{ required: true, message: "Nhập tên nguyên liệu" }]}
        >
          <Input placeholder="Trân Châu Đen..." />
        </Form.Item>

        <Form.Item
          label="Hạn sử dụng"
          name="expiryDate"
          rules={[{ required: true, message: "Chọn hạn sử dụng" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            placeholder="Chọn ngày"
          />
        </Form.Item>

        <Form.Item
          label="Số lượng tồn"
          name="quantity"
          rules={[{ required: true, message: "Nhập số lượng tồn" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={1}
            placeholder="0"
          />
        </Form.Item>

        <Form.Item label="URL hình ảnh" name="imageUrl">
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item
          label="Còn hàng"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IngredientModal;
