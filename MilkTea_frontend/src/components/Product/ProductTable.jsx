// src/components/Product/ProductTable.jsx
import React from "react";
import { Table, Tag, Switch, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatCurrency } from "../utils/formatCurrency.jsx";
import "../../styles/ProductManagementPage.css";

const ProductTable = ({ products, onEdit, onDelete, onToggleActive, loading }) => {
  const columns = [
    {
      title: "Mã SP",
      dataIndex: "code",
      width: 100,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 140,
      render: (v) => (
        <Tag color="black">
          {v === "ThucUong" ? "Thức uống" : "Topping"}
        </Tag>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 120,
      render: (v) => formatCurrency(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 140,
      render: (value, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => onToggleActive(record.id, checked)}
          checkedChildren="Bán"
          unCheckedChildren="Ngưng"
          style={{
            backgroundColor: record.isActive ? "#52c41a" : "#ff4d4f",
          }}
        />
      ),
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Xóa sản phẩm?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      pagination={false}
      className="pm-table"
      loading={loading}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default ProductTable;
