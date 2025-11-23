import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const { Option } = Select;

const ROLE_LABEL = {
  0: "Khách hàng",
  1: "Nhân viên",
  2: "Quản lý",
};

const CUSTOMER_TYPE_LABEL = {
  0: "Đồng",
  1: "Bạc",
  2: "Vàng",
  3: "Kim cương",
};

const AccountEditModal = ({ visible, account, form, onCancel, onSubmit }) => {
  const isCustomer = account?.role === 0;

  return (
    <Modal
      open={visible}
      title="Chỉnh sửa tài khoản"
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Lưu"
      cancelText="Hủy"
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="pm-modal-grid">
        <Form.Item
          label="Họ tên *"
          name="fullName"
          rules={[{ required: true, message: "Nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên" />
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

        <Form.Item label="Vai trò">
          <Input
            disabled
            value={account ? ROLE_LABEL[account.role] : ""}
          />
        </Form.Item>

        {isCustomer && (
          <>
            <Form.Item
              label="Loại khách hàng"
              name="customerType"
              rules={[{ required: true, message: "Chọn loại khách hàng" }]}
            >
              <Select>
                {Object.entries(CUSTOMER_TYPE_LABEL).map(([value, label]) => (
                  <Option key={value} value={Number(value)}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Điểm tích lũy"
              name="points"
              rules={[{ required: true, message: "Nhập điểm tích lũy" }]}
            >
              <InputNumber
                min={0}
                step={10}
                style={{ width: "100%" }}
                placeholder="VD: 100"
              />
            </Form.Item>
          </>
        )}

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
          tooltip="Để trống nếu không muốn đổi mật khẩu"
        >
          <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn đổi)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccountEditModal;
