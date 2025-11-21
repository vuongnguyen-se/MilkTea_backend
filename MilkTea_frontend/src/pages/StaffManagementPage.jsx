import React, { useMemo, useState } from "react";
import { Layout, Button, Input, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Topbar from "../components/Topbar/Topbar.jsx";
import StaffTable from "../components/Staff/StaffTable.jsx";
import StaffSalaryModal from "../components/Staff/StaffSalaryModal.jsx";
import StaffEditModal from "../components/Staff/StaffEditModal.jsx";

import "../styles/ProductManagementPage.css"; // dùng lại layout

const { Content } = Layout;
const { Search } = Input;

// fake data mẫu
const initialStaff = [
  {
    id: 1,
    code: "NV001",
    fullName: "Nguyễn Văn A",
    role: "Quản lý",
    phone: "0901234567",
    shift: "Cả ngày",
    isWorking: true,
    baseSalary: 15000000,
    allowance: 2000000,
    username: "nguyenvana",
    address: "123 Nguyễn Huệ, Q1",
  },
  {
    id: 2,
    code: "NV002",
    fullName: "Trần Thị B",
    role: "Thu ngân",
    phone: "0902345678",
    shift: "Ca sáng",
    isWorking: true,
    baseSalary: 8000000,
    allowance: 1000000,
    username: "tranthib",
    address: "",
  },
  {
    id: 3,
    code: "NV003",
    fullName: "Lê Văn C",
    role: "Pha chế",
    phone: "0903456789",
    shift: "Ca tối",
    isWorking: true,
    baseSalary: 9000000,
    allowance: 500000,
    username: "levanc",
    address: "",
  },
  {
    id: 4,
    code: "NV004",
    fullName: "Phạm Thị D",
    role: "Phục vụ",
    phone: "0904567890",
    shift: "Ca sáng",
    isWorking: false,
    baseSalary: 7000000,
    allowance: 0,
    username: "phamthid",
    address: "",
  },
];

const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState(initialStaff);
  const [searchText, setSearchText] = useState("");

  const [salaryModalVisible, setSalaryModalVisible] = useState(false);
  const [salaryStaff, setSalaryStaff] = useState(null);
  const [salaryForm] = Form.useForm();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState("add"); // 'add' | 'edit'
  const [editForm] = Form.useForm();
  const [editingStaff, setEditingStaff] = useState(null);

  const filteredStaff = useMemo(() => {
    const keyword = searchText.toLowerCase();
    return staffList.filter(
      (s) =>
        s.fullName.toLowerCase().includes(keyword) ||
        s.code.toLowerCase().includes(keyword) ||
        s.phone.toLowerCase().includes(keyword)
    );
  }, [staffList, searchText]);

  // ====== Toggle trạng thái ======
  const handleToggleStatus = (id, value) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isWorking: value } : s
      )
    );
  };

  // ====== Lương & ca làm ======
  const handleViewSalary = (staff) => {
    setSalaryStaff(staff);
    salaryForm.setFieldsValue({
      baseSalary: staff.baseSalary || 0,
      allowance: staff.allowance || 0,
      totalSalary: (staff.baseSalary || 0) + (staff.allowance || 0),
      shift: staff.shift || "Ca sáng",
      isWorking: staff.isWorking,
    });
    setSalaryModalVisible(true);
  };

  const handleSubmitSalary = () => {
    salaryForm
      .validateFields()
      .then((values) => {
        setStaffList((prev) =>
          prev.map((s) =>
            s.id === salaryStaff.id
              ? {
                ...s,
                baseSalary: values.baseSalary,
                allowance: values.allowance,
                shift: values.shift,
                isWorking: values.isWorking,
              }
              : s
          )
        );
        setSalaryModalVisible(false);
        setSalaryStaff(null);
        message.success("Cập nhật lương & ca làm thành công");
      })
      .catch(() => { });
  };

  // ====== Thêm / sửa nhân viên ======
  const openAddStaff = () => {
    setEditMode("add");
    setEditingStaff(null);
    editForm.resetFields();
    editForm.setFieldsValue({
      shift: "Ca sáng",
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
      baseSalary: staff.baseSalary,
      allowance: staff.allowance,
      username: staff.username,
      password: "",
    });
    setEditModalVisible(true);
  };

  const handleSubmitEdit = () => {
    editForm
      .validateFields()
      .then((values) => {
        if (editMode === "add") {
          const nextIndex = staffList.length + 1;
          const newStaff = {
            id: Date.now(),
            code: `NV${String(nextIndex).padStart(3, "0")}`,
            isWorking: true,
            ...values,
          };
          setStaffList((prev) => [...prev, newStaff]);
          message.success("Thêm nhân viên mới thành công");
        } else if (editingStaff) {
          setStaffList((prev) =>
            prev.map((s) =>
              s.id === editingStaff.id ? { ...s, ...values } : s
            )
          );
          message.success("Cập nhật nhân viên thành công");
        }

        setEditModalVisible(false);
        setEditingStaff(null);
      })
      .catch(() => { });
  };

  // ====== Xóa nhân viên ======
  const handleDeleteStaff = (id) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    message.success("Đã xóa nhân viên");
  };

  return (
    <Layout className="pm-layout">
      <Content className="pm-content">
        <Topbar activeTab="staff" />

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
          </div>

          <StaffTable
            staffList={filteredStaff}
            onToggleStatus={handleToggleStatus}
            onViewSalary={handleViewSalary}
            onEditStaff={openEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        </div>

        {/* Modal lương & ca làm */}
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

        {/* Modal thêm / sửa nhân viên */}
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
