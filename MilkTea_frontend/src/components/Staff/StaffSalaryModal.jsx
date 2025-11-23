import React from "react";
import { Modal, Form, Input, InputNumber, Select, Switch } from "antd";

const { Option } = Select;

const SHIFT_OPTIONS = [
  "Ca 1 (6h-12h)",
  "Ca 2 (12h-18h)",
  "Ca 3 (16h-22h)",
  "Cả ngày",
];

const PER_SHIFT_SALARY = 180000;

const StaffSalaryModal = ({
  visible,
  staff,
  form,
  onCancel,
  onSubmit,
}) => {
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
          let soCa = Number(all.shiftsCount || 0);
          const allowance = Number(all.allowance || 0);

          // Nếu chọn "Cả ngày" → số ca tính lương = số ca * 3
          const shift = all.shift || staff?.shift || "";
          const normalizedShifts =
            shift === "Cả ngày" ? soCa * 3 : soCa;

          const total = normalizedShifts * PER_SHIFT_SALARY + allowance;

          form.setFieldsValue({
            totalSalary: total,
          });
        }}
      >
        <Form.Item label="Họ tên">
          <Input value={staff?.fullName} disabled />
        </Form.Item>

        <Form.Item label="Chức vụ">
          <Input value={staff?.role} disabled />
        </Form.Item>

        <Form.Item
          label="Số ca làm trong tháng"
          name="shiftsCount"
          rules={[{ required: true, message: "Nhập số ca làm" }]}
        >
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Lương mỗi ca 6 tiếng(VND)">
          <Input value={PER_SHIFT_SALARY.toLocaleString()} disabled />
        </Form.Item>

        <Form.Item
          label="Phụ cấp (VND/tháng)"
          name="allowance"
          rules={[{ required: true, message: "Nhập phụ cấp" }]}
        >
          <InputNumber min={0} step={50000} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Tổng lương (VND)" name="totalSalary">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Ca làm chính"
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
