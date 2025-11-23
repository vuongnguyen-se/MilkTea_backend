/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Button, Input, Form, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import StaffTable from "../components/Staff/StaffTable.jsx";
import StaffSalaryModal from "../components/Staff/StaffSalaryModal.jsx";
import StaffEditModal from "../components/Staff/StaffEditModal.jsx";

import "../styles/ProductManagementPage.css";

const { Content } = Layout;
const { Search } = Input;

const API_BASE = "http://localhost:5159/shopAPI/NhanVien";
const PER_SHIFT_SALARY = 180000; // 1 ca = 180k

// ====== Helpers ======

// Tính tổng lương dựa trên số ca + phụ cấp + ca làm chính
const calcTotalSalary = (shiftsCount, allowance, shift) => {
  const rawShifts = Number(shiftsCount || 0);
  const phuCap = Number(allowance || 0);

  // Nếu ca chính là "Cả ngày" → mỗi ca trong input tương đương 3 ca thực tế
  const normalizedShifts =
    shift === "Cả ngày" ? rawShifts * 3 : rawShifts;

  return normalizedShifts * PER_SHIFT_SALARY + phuCap;
};

// Map API -> object FE dùng
const mapFromApi = (nv) => {
  const soCa = nv.soCa ?? 0;
  const allowance = Number(nv.phuCap || 0);

  const total =
    nv.tongLuong != null
      ? Number(nv.tongLuong)
      : calcTotalSalary(soCa, allowance, nv.caLam || "");

  return {
    id: nv.idTK,
    code: nv.idTK,
    fullName: nv.tenTK || "",
    role: nv.chucVu || "",
    phone: nv.sdt || nv.soDienThoai || "",
    shift: nv.caLam || "",
    shiftsCount: soCa,
    allowance,
    totalSalary: total,
    username: nv.tenDN || nv.tenDangNhap || "",
    password: nv.mKhau || nv.matKhau || "",
    address: nv.dChi || nv.diaChi || "",
    isWorking: !nv.biKhoa,
  };
};

// Map FE -> payload gửi API
const buildPayload = (staff) => {
  const total = calcTotalSalary(
    staff.shiftsCount,
    staff.allowance,
    staff.shift
  );

  // Lưu soCa ở DB là số ca đã chuẩn hoá (đã nhân 3 nếu "Cả ngày")
  const rawShifts = Number(staff.shiftsCount || 0);
  const normalizedShifts =
    staff.shift === "Cả ngày" ? rawShifts * 3 : rawShifts;

  return {
    idTK: staff.code,
    tenTK: staff.fullName,
    dChi: staff.address || "",
    sdt: staff.phone || "",
    tenDN: staff.username,
    mKhau: staff.password,
    vaiTro: 1, // 0: KH, 1: NV, 2: QL
    biKhoa: !staff.isWorking,

    chucVu: staff.role,
    caLam: staff.shift,
    soCa: normalizedShifts,
    phuCap: staff.allowance || 0,
    tongLuong: total,
  };
};

// Sinh mã NV: NV001, NV002, ...
const getNextStaffCode = (list) => {
  let maxNum = 0;
  list.forEach((s) => {
    const code = s.code || "";
    if (code.startsWith("NV")) {
      const num = parseInt(code.slice(2), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  const next = maxNum + 1;
  return `NV${String(next).padStart(3, "0")}`;
};

const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [salaryModalVisible, setSalaryModalVisible] = useState(false);
  const [salaryStaff, setSalaryStaff] = useState(null);
  const [salaryForm] = Form.useForm();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState("add"); // 'add' | 'edit'
  const [editForm] = Form.useForm();
  const [editingStaff, setEditingStaff] = useState(null);

  const [loading, setLoading] = useState(false);

  // ====== API: load list NV ======
  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Fetch nhân viên thất bại");
      const data = await res.json();
      setStaffList(data.map(mapFromApi));
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // ====== SEARCH ======
  const filteredStaff = useMemo(() => {
    const kw = searchText.toLowerCase();
    return staffList.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(kw) ||
        s.code.toLowerCase().includes(kw) ||
        (s.phone || "").toLowerCase().includes(kw);

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "working"
            ? s.isWorking === true
            : s.isWorking === false;

      return matchSearch && matchStatus;
    });
  }, [staffList, searchText, statusFilter]);

  // ====== Toggle trạng thái (khóa/mở) ======
  const handleToggleStatus = async (id, value) => {
    try {
      const res = await fetch(`${API_BASE}/toggle-lock/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Toggle lock thất bại");

      await loadStaff();
      message.success(value ? "Đã mở khóa nhân viên" : "Đã khóa nhân viên");
    } catch (err) {
      console.error(err);
      message.error("Không thể đổi trạng thái nhân viên");
    }
  };

  // ====== Lương & ca làm (SalaryModal) ======
  const handleViewSalary = (staff) => {
    setSalaryStaff(staff);

    salaryForm.setFieldsValue({
      shiftsCount: staff.shiftsCount || 0,
      allowance: staff.allowance || 0,
      totalSalary: staff.totalSalary || 0,
      shift: staff.shift || "Ca 1 (6h-12h)",
      isWorking: staff.isWorking,
    });

    setSalaryModalVisible(true);
  };

  const handleSubmitSalary = async () => {
    try {
      const values = await salaryForm.validateFields();

      const updatedStaff = {
        ...salaryStaff,
        shiftsCount: Number(values.shiftsCount || 0),
        allowance: Number(values.allowance || 0),
        shift: values.shift,
        isWorking: values.isWorking,
      };

      updatedStaff.totalSalary = calcTotalSalary(
        updatedStaff.shiftsCount,
        updatedStaff.allowance,
        updatedStaff.shift
      );

      const payload = buildPayload(updatedStaff);

      const res = await fetch(`${API_BASE}/${salaryStaff.code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update lương thất bại");

      message.success("Cập nhật lương & ca làm thành công");

      setSalaryModalVisible(false);
      setSalaryStaff(null);

      setStaffList((prev) =>
        prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
      );
    } catch (err) {
      if (err?.errorFields) return; // lỗi form
      console.error(err);
      message.error("Không thể cập nhật lương");
    }
  };

  // ====== Thêm / sửa nhân viên (EditModal) ======
  const openAddStaff = () => {
    setEditMode("add");
    setEditingStaff(null);
    editForm.resetFields();
    editForm.setFieldsValue({
      shift: "Ca 1 (6h-12h)",
      shiftsCount: 0,
      allowance: 200000,
    });
    setEditModalVisible(true);
  };

  const openEditStaff = (staff) => {
    setEditMode("edit");
    setEditingStaff(staff);
    editForm.setFieldsValue({
      fullName: staff.fullName,
      phone: staff.phone,
      address: staff.address,
      role: staff.role,
      shift: staff.shift,
      shiftsCount: staff.shiftsCount,
      allowance: staff.allowance,
      username: staff.username,
      password: "",
    });
    setEditModalVisible(true);
  };

  const handleSubmitEdit = async () => {
    try {
      const values = await editForm.validateFields();

      if (editMode === "add") {
        const newCode = getNextStaffCode(staffList);

        const newStaff = {
          id: newCode,
          code: newCode,
          fullName: values.fullName,
          role: values.role,
          phone: values.phone,
          address: values.address || "",
          shift: values.shift,
          shiftsCount: Number(values.shiftsCount || 0),
          allowance: Number(values.allowance || 0),
          totalSalary: 0, // tính ngay sau
          username: values.username,
          password: values.password,
          isWorking: true,
        };

        newStaff.totalSalary = calcTotalSalary(
          newStaff.shiftsCount,
          newStaff.allowance,
          newStaff.shift
        );

        const payload = buildPayload(newStaff);

        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Thêm nhân viên thất bại");

        const json = await res.json();
        const created = mapFromApi(json.data);

        // Ghi đè lại mấy field FE (phòng trường hợp API chưa trả đủ)
        created.shiftsCount = newStaff.shiftsCount;
        created.allowance = newStaff.allowance;
        created.totalSalary = newStaff.totalSalary;

        setStaffList((prev) => [...prev, created]);
        message.success("Thêm nhân viên mới thành công");
      } else if (editingStaff) {
        const updatedStaff = {
          ...editingStaff,
          fullName: values.fullName,
          phone: values.phone,
          address: values.address || "",
          role: values.role,
          shift: values.shift,
          shiftsCount: Number(values.shiftsCount || 0),
          allowance: Number(values.allowance || 0),
          username: values.username,
          password: values.password || editingStaff.password,
        };

        updatedStaff.totalSalary = calcTotalSalary(
          updatedStaff.shiftsCount,
          updatedStaff.allowance,
          updatedStaff.shift
        );

        const payload = buildPayload(updatedStaff);

        const res = await fetch(`${API_BASE}/${editingStaff.code}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Cập nhật nhân viên thất bại");

        setStaffList((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? updatedStaff : s))
        );
        message.success("Cập nhật nhân viên thành công");
      }

      setEditModalVisible(false);
      setEditingStaff(null);
    } catch (err) {
      if (err?.errorFields) return; // lỗi form
      console.error(err);
      message.error("Không thể lưu nhân viên");
    }
  };

  // ====== Xóa ======
  const handleDeleteStaff = async (id) => {
    const target = staffList.find((s) => s.id === id);
    if (!target) return;

    try {
      const res = await fetch(`${API_BASE}/${target.code}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa nhân viên thất bại");

      setStaffList((prev) => prev.filter((s) => s.id !== id));
      message.success("Đã xóa nhân viên");
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa nhân viên");
    }
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">
        <div className="pm-main-card">
          <div className="pm-main-header">
            <h2>Quản lý nhân viên</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddStaff}
            >
              Thêm nhân viên
            </Button>
          </div>

          <div className="pm-filters">
            <Search
              placeholder="Tìm kiếm nhân viên..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Select
              style={{ width: 180, marginLeft: 12 }}
              defaultValue="all"
              onChange={(v) => setStatusFilter(v)}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="working">Đang làm</Select.Option>
              <Select.Option value="quit">Nghỉ việc</Select.Option>
            </Select>
          </div>


          <StaffTable
            staffList={filteredStaff}
            onToggleStatus={handleToggleStatus}
            onViewSalary={handleViewSalary}
            onEditStaff={openEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        </div>

        <StaffSalaryModal
          visible={salaryModalVisible}
          staff={salaryStaff}
          form={salaryForm}
          onCancel={() => {
            setSalaryModalVisible(false);
            setSalaryStaff(null);
          }}
          onSubmit={handleSubmitSalary}
        />

        <StaffEditModal
          visible={editModalVisible}
          mode={editMode}
          form={editForm}
          onCancel={() => setEditModalVisible(false)}
          onSubmit={handleSubmitEdit}
        />
      </Content>
    </Layout>
  );
};

export default StaffManagementPage;
