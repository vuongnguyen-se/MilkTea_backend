import React from "react";
import { Table, Switch, Space, Button } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const formatCurrency = (v) =>
  (v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const StaffTable = ({
  staffList,
  onToggleStatus,
  onViewSalary,
  onEditStaff,
  onDeleteStaff,
}) => {
  const columns = [
    { title: "Mã NV", dataIndex: "code", key: "code", width: 90 },
    { title: "Họ Tên", dataIndex: "fullName", key: "fullName", ellipsis: true },
    { title: "Chức vụ", dataIndex: "role", key: "role", width: 120 },
    { title: "SĐT", dataIndex: "phone", key: "phone", width: 120 },
    { title: "Ca làm", dataIndex: "shift", key: "shift", width: 150 },
    {
      title: "Số ca / tháng",
      dataIndex: "shiftsCount",
      key: "shiftsCount",
      width: 120,
    },
    {
      title: "Phụ cấp",
      dataIndex: "allowance",
      key: "allowance",
      width: 120,
      render: (v) => formatCurrency(v),
    },
    {
      title: "Tổng lương",
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: 140,
      render: (v) => formatCurrency(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "isWorking",
      key: "isWorking",
      width: 150,
      render: (value, record) => (
        <Space>
          <Switch
            checked={value}
            onChange={(checked) => onToggleStatus(record.id, checked)}
          />
          <span>{value ? "Đang làm" : "Nghỉ việc"}</span>
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
            icon={<EyeOutlined />}
            style={{ color: "#16a34a" }}
            onClick={() => onViewSalary(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: "#f97316" }}
            onClick={() => onEditStaff(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDeleteStaff(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={staffList}
      pagination={false}
      className="pm-table"
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default StaffTable;
