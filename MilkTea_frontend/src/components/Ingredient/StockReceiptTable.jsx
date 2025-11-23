// src/components/Ingredient/StockReceiptTable.jsx
import React from "react";
import { Table, Tag } from "antd";

const StockReceiptTable = ({ receipts = [], loading }) => {
  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "code",
      width: 120,
    },
    {
      title: "Nguyên liệu",
      dataIndex: "ingredientName",
      width: 250,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 100,
      render: (v) => <b>{v}</b>,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      width: 250,
      render: (v) => v || <i style={{ color: "#888" }}>— Xuất kho —</i>,
    },
    {
      title: "Loại phiếu",
      dataIndex: "type",
      width: 120,
      render: (t) =>
        t === "nhap" ? (
          <Tag color="green">Nhập kho</Tag>
        ) : (
          <Tag color="red">Xuất kho</Tag>
        ),
    },
    {
      title: "Ngày",
      dataIndex: "dateText",
      width: 180,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 250,
      render: (v) => v || <i style={{ color: "#999" }}>Không</i>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={receipts}
      loading={loading}
      pagination={{ pageSize: 15 }}
      rowKey="id"
      bordered
    />
  );
};

export default StockReceiptTable;
