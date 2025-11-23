import React from "react";
import { Table, Button, Tag } from "antd";

const PromotionTable = ({ data, loading, onEdit, onDelete }) => {
  const now = new Date();

  const getStatus = (record) => {
    const start = new Date(record.start);
    const end = new Date(record.end);

    if (now < start) return { label: "Sắp diễn ra", color: "blue" };
    if (now > end) return { label: "Đã kết thúc", color: "red" };
    return { label: "Đang diễn ra", color: "green" };
  };

  const columns = [
    { title: "Mã KM", dataIndex: "code", key: "code" },
    { title: "Tên khuyến mãi", dataIndex: "name", key: "name" },

    // ⭐ FIX: cột mã nhanh = TenKhuyenMai
    {
      title: "Mã nhanh",
      key: "shortcut",
      render: (_, r) => <b>{r.shortcut}</b>,
    },

    {
      title: "% Giảm",
      key: "percent",
      render: (_, r) => <b>{r.percent * 100}%</b>,
    },
    { title: "Ngày bắt đầu", dataIndex: "start" },
    { title: "Ngày kết thúc", dataIndex: "end" },

    {
      title: "Trạng thái",
      key: "status",
      render: (_, r) => {
        const s = getStatus(r);
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },

    {
      title: "Thao tác",
      key: "actions",
      render: (_, r) => (
        <>
          <Button type="link" onClick={() => onEdit(r)}>
            Sửa
          </Button>
          <Button danger type="link" onClick={() => onDelete(r.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
    />
  );
};

export default PromotionTable;
