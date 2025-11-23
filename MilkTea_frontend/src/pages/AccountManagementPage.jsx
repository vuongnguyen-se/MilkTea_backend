/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Button, Input, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons"; // để dành nếu sau này thêm TK

import AccountTable from "../components/Account/AccountTable.jsx";
import AccountEditModal from "../components/Account/AccountEditModal.jsx";

import "../styles/ProductManagementPage.css";

const { Content } = Layout;
const { Search } = Input;

const API_ACCOUNT = "http://localhost:5159/shopAPI/TaiKhoan";
const API_CUSTOMER = "http://localhost:5159/shopAPI/KhachHang";

// map vaiTro enum -> text hiển thị
const ROLE_LABEL = {
  0: "Khách hàng",
  1: "Nhân viên",
  2: "Quản lý",
};

// map loaiKhachHang enum -> text hiển thị
const CUSTOMER_TYPE_LABEL = {
  0: "Đồng",
  1: "Bạc",
  2: "Vàng",
  3: "Kim cương",
};

// ====== map từ API -> FE object ======
const mapFromApi = (tk, kh) => {
  const role = typeof tk.vaiTro === "number" ? tk.vaiTro : 0;
  const isCustomer = role === 0;

  return {
    id: tk.idTK,
    code: tk.idTK,
    fullName: tk.tenTK || "",
    address: tk.dChi || tk.diaChi || "",
    phone: tk.sdt || tk.soDienThoai || "",
    username: tk.tenDN || tk.tenDangNhap || "",
    password: tk.mKhau || tk.matKhau || "",
    role,                                // 0/1/2
    isActive: !tk.biKhoa,                // biKhoa = true => locked
    isCustomer,

    customerType: isCustomer && kh ? kh.loaiKH : null, // enum 0-3
    points: isCustomer && kh ? kh.diemTichLuy : 0,
  };
};

// ====== build payload TaiKhoan ======
const buildAccountPayload = (acc) => ({
  idTK: acc.code,
  tenTK: acc.fullName,
  dChi: acc.address || "",
  sdt: acc.phone || "",
  tenDN: acc.username,
  mKhau: acc.password,
  vaiTro: acc.role,
  biKhoa: !acc.isActive,
});

// ====== build payload KhachHang (kế thừa TaiKhoan + thêm 2 trường) ======
const buildCustomerPayload = (acc) => ({
  ...buildAccountPayload(acc),
  diemTichLuy: acc.points || 0,
  loaiKH: acc.customerType ?? 0,
});

const AccountManagementPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | 0 | 1 | 2

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editForm] = Form.useForm();

  const [loading, setLoading] = useState(false);

  // ====== Load danh sách tài khoản + khách hàng ======
  const loadAccounts = async () => {
    try {
      setLoading(true);

      const [tkRes, khRes] = await Promise.all([
        fetch(API_ACCOUNT),
        fetch(API_CUSTOMER),
      ]);

      if (!tkRes.ok) throw new Error("Không load được tài khoản");
      if (!khRes.ok) throw new Error("Không load được khách hàng");

      const [tkData, khData] = await Promise.all([
        tkRes.json(),
        khRes.json(),
      ]);

      // map KhachHang theo idTK
      const khMap = new Map();
      khData.forEach((kh) => {
        khMap.set(kh.idTK, kh);
      });

      const mapped = tkData.map((tk) =>
        mapFromApi(tk, khMap.get(tk.idTK))
      );

      setAccounts(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // ====== Search + filter ======
  const filteredAccounts = useMemo(() => {
    const kw = searchText.toLowerCase();

    return accounts.filter((acc) => {
      const matchSearch =
        acc.fullName.toLowerCase().includes(kw) ||
        acc.code.toLowerCase().includes(kw) ||
        (acc.phone || "").toLowerCase().includes(kw) ||
        (acc.username || "").toLowerCase().includes(kw);

      const matchRole =
        roleFilter === "all" || acc.role === Number(roleFilter);

      return matchSearch && matchRole;
    });
  }, [accounts, searchText, roleFilter]);

  // ====== Toggle khóa/mở TK ======
  const handleToggleStatus = async (id, isActive) => {
    try {
      const res = await fetch(`${API_ACCOUNT}/toggle-lock/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Toggle lock thất bại");

      // cập nhật local để đỡ phải reload
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id ? { ...acc, isActive } : acc
        )
      );
      message.success(isActive ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
    } catch (err) {
      console.error(err);
      message.error("Không thể đổi trạng thái tài khoản");
    }
  };

  // ====== Mở modal chỉnh sửa ======
  const openEditModal = (acc) => {
    setEditingAccount(acc);

    editForm.setFieldsValue({
      fullName: acc.fullName,
      phone: acc.phone,
      address: acc.address,
      username: acc.username,
      password: "",
      // role chỉ hiển thị ở modal, không cho đổi
      customerType: acc.customerType ?? 0,
      points: acc.points ?? 0,
    });

    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingAccount(null);
    editForm.resetFields();
  };

  // ====== Submit chỉnh sửa ======
  const handleSubmitEdit = async () => {
    try {
      if (!editingAccount) return;
      const values = await editForm.validateFields();

      const updated = {
        ...editingAccount,
        fullName: values.fullName,
        phone: values.phone,
        address: values.address || "",
        username: values.username,
        password: values.password || editingAccount.password,
        // role giữ nguyên, không chỉnh ở đây
        points:
          editingAccount.role === 0
            ? Number(values.points || 0)
            : editingAccount.points,
        customerType:
          editingAccount.role === 0
            ? Number(values.customerType ?? 0)
            : null,
      };

      // Khách hàng (vaiTro = 0) -> gọi KhachHangController
      if (updated.role === 0) {
        const payload = buildCustomerPayload(updated);

        const res = await fetch(
          `${API_CUSTOMER}/${updated.code}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Cập nhật khách hàng thất bại");
      } else {
        // Nhân viên / Quản lý -> chỉ gọi TaiKhoanController
        const payload = buildAccountPayload(updated);

        const res = await fetch(
          `${API_ACCOUNT}/${updated.code}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Cập nhật tài khoản thất bại");
      }

      // cập nhật local
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === updated.id ? updated : acc
        )
      );

      message.success("Cập nhật tài khoản thành công");
      closeEditModal();
    } catch (err) {
      if (err?.errorFields) return; // lỗi form
      console.error(err);
      message.error("Không thể lưu tài khoản");
    }
  };

  // ====== Xóa TK (nếu cần) ======
  const handleDeleteAccount = async (id) => {
    const target = accounts.find((a) => a.id === id);
    if (!target) return;

    try {
      const res = await fetch(`${API_ACCOUNT}/${target.code}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa tài khoản thất bại");

      setAccounts((prev) => prev.filter((a) => a.id !== id));
      message.success("Đã xóa tài khoản");
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa tài khoản");
    }
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">
        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Quản lý tài khoản</h2>
            {/* Nếu sau này cho phép thêm tài khoản:
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddAccount}
            >
              Thêm tài khoản
            </Button>
            */}
          </div>

          <div className="pm-func">
            <div className="pm-filters">
              <Search
                placeholder="Tìm kiếm theo tên, SĐT, username..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
              />

              <select
                className="pm-select" // tận dụng class select sẵn
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ minWidth: 160, padding: "4px 8px" }}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="0">Khách hàng</option>
                <option value="1">Nhân viên</option>
                <option value="2">Quản lý</option>
              </select>
            </div>
          </div>

          <AccountTable
            loading={loading}
            accounts={filteredAccounts}
            onToggleStatus={handleToggleStatus}
            onEdit={openEditModal}
            onDelete={handleDeleteAccount}
          />
        </div>

        <AccountEditModal
          visible={editModalVisible}
          account={editingAccount}
          form={editForm}
          onCancel={closeEditModal}
          onSubmit={handleSubmitEdit}
        />
      </Content>
    </Layout>
  );
};

export default AccountManagementPage;
