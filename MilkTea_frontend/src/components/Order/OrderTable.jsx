import React from "react";
import { Table, Space, Button, Tag, Tooltip } from "antd";
import {
  EyeOutlined,
  StepForwardOutlined,
  StopOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const formatCurrency = (v) =>
  (v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const STATUS_LABEL = {
  0: "Chờ xác nhận",
  1: "Đang chuẩn bị",
  2: "Hoàn thành",
  3: "Đã hủy",
};

const STATUS_COLOR = {
  0: "gold",
  1: "blue",
  2: "green",
  3: "red",
};

const PAYMENT_LABEL = {
  0: "Tiền mặt",
  1: "Ngân hàng",
  2: "Ví điện tử",
};

const OrderTable = ({
  orders,
  loading,
  onViewDetail,
  onNextStatus,
  onCancelOrder,
  onViewInvoice, // 👈 mới
}) => {
  const columns = [
    { title: "Mã đơn", dataIndex: "code", key: "code", width: 110 },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      ellipsis: true,
    },
    { title: "SĐT KH", dataIndex: "customerPhone", key: "customerPhone", width: 120 },
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
      width: 140,
      ellipsis: true,
    },
    { title: "Ngày đặt", dataIndex: "orderDate", key: "orderDate", width: 150 },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => (
        <Tag color={STATUS_COLOR[status] || "default"}>
          {STATUS_LABEL[status] || "Không rõ"}
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 140,
      render: (v) => PAYMENT_LABEL[v] || "Không rõ",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 140,
      render: (v) => formatCurrency(v),
    },
    {
      title: "Khuyến mãi",
      dataIndex: "promotionText",
      key: "promotionText",
      width: 160,
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 260,
      render: (_, record) => {
        const canNext =
          record.status === 0 || record.status === 1;
        const canCancel = record.status === 0;

        return (
          <Space>
            <Tooltip title="Xem chi tiết đơn">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(record)}
                style={{ color: "#16a34a" }}
              />
            </Tooltip>

            <Tooltip title="Chuyển trạng thái tiếp theo">
              <Button
                type="text"
                icon={<StepForwardOutlined />}
                disabled={!canNext}
                onClick={() => onNextStatus(record)}
              />
            </Tooltip>

            <Tooltip title="Hủy đơn">
              <Button
                type="text"
                icon={<StopOutlined />}
                danger
                disabled={!canCancel}
                onClick={() => onCancelOrder(record)}
              />
            </Tooltip>

            <Tooltip title="Xem hóa đơn để in">
              <Button
                type="text"
                icon={<FileTextOutlined />}
                onClick={() => onViewInvoice(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={orders}
      loading={loading}
      pagination={false}
      className="pm-table"
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default OrderTable;
