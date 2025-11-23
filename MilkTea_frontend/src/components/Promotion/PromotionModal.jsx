import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const PromotionModal = ({ visible, editing, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        code: editing.code,
        name: editing.name,
        shortcut: editing.shortcut,
        percent: editing.percent,
        dates: 
          [dayjs(editing.start), 
          dayjs(editing.end)]
      });
    } else {
      form.resetFields();
    }
  }, [editing]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const [start, end] = values.dates;
      onSubmit({
        code: values.code,
        name: values.name,
        shortcut: values.shortcut,
        percent: values.percent,
        start: start.toISOString(),
        end: end.toISOString(),
      });
    });
  };

  return (
    <Modal
      title={editing ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Mã khuyến mãi"
          rules={[{ required: true, message: "Nhập mã KM" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên khuyến mãi"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="shortcut"
          label="Mã nhập nhanh"
          rules={[{ required: true }]}
        >
          <Input placeholder="VD: GIANGSINH, BLACKFRIDAY…" />
        </Form.Item>

        <Form.Item
          name="percent"
          label="Phần trăm giảm"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={1} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="dates"
          label="Thời gian áp dụng"
          rules={[{ required: true }]}
        >
          <RangePicker showTime style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PromotionModal;
