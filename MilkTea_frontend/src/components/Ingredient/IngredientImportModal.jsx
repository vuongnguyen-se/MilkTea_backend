// src/components/Ingredient/IngredientImportModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Select,
  Table,
  InputNumber,
  DatePicker,
  Input,
  message,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const IngredientImportModal = ({
  visible,
  onClose,
  suppliers = [],
  fetchSupplierIngredients, // function(idNCC) → list nguyên liệu NCC cung cấp
  onSubmitImport, // callback nhận { idNCC, ghiChu, items }
}) => {
  const [form] = Form.useForm();
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [rows, setRows] = useState([]);

  // Reset khi đóng/mở
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setRows([]);
    }
  }, [visible, form]);

  // Khi chọn NCC → load nguyên liệu mà NCC đó cung cấp
  const handleSelectSupplier = async (idNCC) => {
    try {
      setLoadingIngredients(true);
      const items = await fetchSupplierIngredients(idNCC);

      setRows(
        items.map((nl) => ({
          idNL: nl.idNL,
          name: nl.tenNL,
          unit: nl.donVi,
          expiry: null,
          qty: null,
        }))
      );
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách nguyên liệu từ nhà cung cấp");
    } finally {
      setLoadingIngredients(false);
    }
  };

  const updateRow = (idNL, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.idNL === idNL ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const idNCC = values.supplier;
      const note = values.note || "";

      const validRows = rows.filter((r) => r.qty > 0 && r.expiry);

      if (validRows.length === 0) {
        return message.warning("Vui lòng nhập ít nhất 1 nguyên liệu!");
      }

      await onSubmitImport({
        idNCC,
        ghiChu: note,
        items: validRows.map((r) => ({
          idNL: r.idNL,
          soLuong: r.qty,
          hanSuDung: r.expiry.toISOString(),
        })),
      });

      onClose();
    } catch (err) {
      if (err?.errorFields) return;
      console.error(err);
      message.error("Không thể nhập kho");
    }
  };

  const columns = [
    {
      title: "Nguyên liệu",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      width: 80,
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiry",
      width: 180,
      render: (_, record) => (
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Chọn ngày"
          format="DD/MM/YYYY"
          value={record.expiry}
          onChange={(val) => updateRow(record.idNL, "expiry", val)}
        />
      ),
    },
    {
      title: "Số lượng nhập",
      dataIndex: "qty",
      width: 140,
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          style={{ width: "100%" }}
          onChange={(val) => updateRow(record.idNL, "qty", val)}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Nhập kho nguyên liệu từ nhà cung cấp"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Nhập kho"
      width={820}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="supplier"
          label="Nhà cung cấp"
          rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
        >
          <Select
            placeholder="Chọn nhà cung cấp"
            onChange={handleSelectSupplier}
          >
            {suppliers.map((ncc) => (
              <Option key={ncc.id} value={ncc.id}>
                {ncc.name} ({ncc.id})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Ghi chú (tuỳ chọn)">
          <Input.TextArea
            rows={2}
            placeholder="Ví dụ: Nhập bổ sung cho tuần này..."
          />
        </Form.Item>
      </Form>

      <Table
        style={{ marginTop: 8 }}
        dataSource={rows}
        loading={loadingIngredients}
        columns={columns}
        rowKey="idNL"
        size="small"
        pagination={false}
        bordered
      />
    </Modal>
  );
};

export default IngredientImportModal;
