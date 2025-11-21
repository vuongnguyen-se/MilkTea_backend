import React from "react";
import { Table, Switch, Space, Button } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const StaffTable = ({
  staffList,
  onToggleStatus,
  onViewSalary,
  onEditStaff,
  onDeleteStaff,
}) => {
  const columns = [
    {
      title: "Mã NV",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Họ Tên",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      width: 140,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: "Ca làm",
      dataIndex: "shift",
      key: "shift",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "isWorking",
      key: "isWorking",
      width: 140,
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
