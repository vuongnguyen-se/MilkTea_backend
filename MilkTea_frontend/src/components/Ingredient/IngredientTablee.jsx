import React from "react";
import { Table, Switch, Space, Button, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/ProductManagementPage.css";

const IngredientTablee = ({
  ingredients,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const columns = [
    {
      title: "Mã NL",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 150,
    },
    {
      title: "Số lượng tồn",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      render: (value) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{value}</span>
          {value === 0 && (
            <Tag color="red" style={{ marginLeft: 4 }}>
              Hết hàng
            </Tag>
          )}
          {value > 0 && value < 5 && (
            <Tag color="orange" style={{ marginLeft: 4 }}>
              Sắp hết
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 140,
      render: (_, record) => {
        const checked = record.quantity > 0 && record.isActive;
        const disabled = record.quantity === 0;

        return (
          <Space>
            <Switch
              checked={checked}
              disabled={disabled}
              onChange={(val) => onToggleActive(record.id, val)}
            />
            <span>{checked ? "Còn" : "Hết"}</span>
          </Space>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Xóa nguyên liệu?"
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
      dataSource={ingredients}
      rowKey="id"
      pagination={false}
      className="pm-table"
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default IngredientTablee;
