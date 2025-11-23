// src/components/Ingredient/IngredientTablee.jsx
import React from "react";
import { Table, Tag } from "antd";

const IngredientTablee = ({ ingredients = [] }) => {
  const columns = [
    { title: "Mã NL", dataIndex: "idNL", width: 120 },
    { title: "Tên nguyên liệu", dataIndex: "tenNL", width: 250 },

    {
      title: "Số lượng tồn",
      dataIndex: "soLuongTon",
      width: 120,
      render: (value) => {
        let tag = null;

        if (value < 10) {
          tag = <Tag color="red" style={{ marginLeft: 6 }}>Sắp hết</Tag>;
        } else if (value > 50) {
          tag = <Tag color="gold" style={{ marginLeft: 6 }}>Tồn nhiều</Tag>;
        }

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{value}</span>
            {tag}
          </div>
        );
      },
    },

    { title: "Đơn vị", dataIndex: "donVi", width: 80 },
  ];

  return (
    <Table
      columns={columns}
      dataSource={ingredients}
      rowKey="idNL"
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default IngredientTablee;
