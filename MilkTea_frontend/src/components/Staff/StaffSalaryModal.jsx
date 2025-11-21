import React from "react";
import { Modal, Form, Input, InputNumber, Select, Switch } from "antd";

const { Option } = Select;

const SHIFT_OPTIONS = ["Ca sáng", "Ca tối", "Cả ngày"];

const StaffSalaryModal = ({
  visible,
  staff,
  form,
  onCancel,
  onSubmit,
}) => {
  const isEdit = !!staff;

  return (
    <Modal
      open={visible}
      title="Chi tiết Lương và Ca làm"
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Cập nhật"
      cancelText="Hủy"
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changed, all) => {
          const base = Number(all.baseSalary || 0);
          const allowance = Number(all.allowance || 0);
          const total = base + allowance;
          form.setFieldsValue({ totalSalary: total });
        }}
      >
        <Form.Item label="Họ Tên nhân viên">
          <Input value={staff?.fullName} disabled />
        </Form.Item>

        <Form.Item label="Chức vụ">
          <Input value={staff?.role} disabled />
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
          />
        </Form.Item>

        <Form.Item
          label="Phụ cấp (VND)"
          name="allowance"
          rules={[{ required: true, message: "Nhập phụ cấp" }]}
        >
          <InputNumber
            min={0}
            step={50000}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Tổng lương (VND)" name="totalSalary">
          <Input disabled />
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
          label="Trạng thái làm việc"
          name="isWorking"
          valuePropName="checked"
        >
          <Switch checkedChildren="Đang làm" unCheckedChildren="Nghỉ việc" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffSalaryModal;
