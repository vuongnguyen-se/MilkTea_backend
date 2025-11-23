import React from "react";
import { Table, Switch, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

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

const AccountTable = ({
  accounts,
  onToggleStatus,
  onEdit,
  onDelete,
  loading,
}) => {
  const columns = [
    {
      title: "Mã TK",
      dataIndex: "code",
      key: "code",
      width: 90,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 110,
      render: (role) => ROLE_LABEL[role] || "Không rõ",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "Loại KH",
      dataIndex: "customerType",
      key: "customerType",
      width: 120,
      render: (v, record) =>
        record.role === 0
          ? CUSTOMER_TYPE_LABEL[v ?? 0]
          : "-",
    },
    {
      title: "Điểm TL",
      dataIndex: "points",
      key: "points",
      width: 90,
      render: (v, record) =>
        record.role === 0 ? v || 0 : "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      render: (value, record) => (
        <Space>
          <Switch
            checked={value}
            onChange={(checked) => onToggleStatus(record.id, checked)}
          />
          <span>{value ? "Hoạt động" : "Bị khóa"}</span>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: "#f97316" }}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={accounts}
      loading={loading}
      pagination={false}
      className="pm-table"
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default AccountTable;
