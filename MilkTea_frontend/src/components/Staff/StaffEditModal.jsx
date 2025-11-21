import React from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

const ROLE_OPTIONS = ["Quản lý", "Thu ngân", "Pha chế", "Phục vụ"];
const SHIFT_OPTIONS = ["Ca sáng", "Ca tối", "Cả ngày"];

const StaffEditModal = ({
  visible,
  mode, // 'add' | 'edit'
  form,
  onCancel,
  onSubmit,
}) => {
  const isEdit = mode === "edit";

  return (
    <Modal
      open={visible}
      title={isEdit ? "Sửa thông tin Nhân viên" : "Thêm Nhân viên mới"}
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Lưu"
      cancelText="Hủy"
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <div className="pm-modal-grid">
          <Form.Item
            label="Họ Tên *"
            name="fullName"
            rules={[{ required: true, message: "Nhập họ tên" }]}
          >
            <Input placeholder="Nhập họ tên nhân viên" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại *"
            name="phone"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="Chức vụ"
            name="role"
            rules={[{ required: true, message: "Chọn chức vụ" }]}
          >
            <Select>
              {ROLE_OPTIONS.map((r) => (
                <Option key={r} value={r}>
                  {r}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ca làm"
            name="shift"
            rules={[{ required: true, message: "Chọn ca làm" }]}
          >
            <Select>
              {SHIFT_OPTIONS.map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Lương cơ bản (VND)"
            name="baseSalary"
            rules={[{ required: true, message: "Nhập lương cơ bản" }]}
          >
            <InputNumber
              min={0}
              step={100000}
              style={{ width: "100%" }}
              placeholder="Nhập lương cơ bản"
            />
          </Form.Item>

          <Form.Item
            label="Phụ cấp (VND)"
            name="allowance"
          >
            <InputNumber
              min={0}
              step={50000}
              style={{ width: "100%" }}
              placeholder="Nhập phụ cấp"
            />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập *"
            name="username"
            rules={[{ required: true, message: "Nhập tên đăng nhập" }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={!isEdit ? [{ required: true, message: "Nhập mật khẩu" }] : []}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default StaffEditModal;
