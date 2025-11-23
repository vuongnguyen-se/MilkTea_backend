// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const API_LOGIN = "http://localhost:5159/shopAPI/TaiKhoan/login";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      message.warning("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        // BE trả string thuần: "Sai tên đăng nhập..." / "Tài khoản đã bị khoá..."
        const errText = await res.text();
        message.error(errText || "Đăng nhập thất bại");
        return;
      }

      const data = await res.json();
      // { id, username, role }

      // Lưu thông tin user
      localStorage.setItem("user", JSON.stringify(data));

      message.success("Đăng nhập thành công!");

      // Điều hướng theo vai trò
      if (data.role === "QuanLy") {
        navigate("/dashboard", { replace: true });
      } else if (data.role === "NhanVien") {
        // Nhân viên vẫn xem dashboard / màn hình bán hàng
        navigate("/dashboard", { replace: true });
      } else {
        // Dự phòng – nếu lỡ BE trả role lạ thì quay về login
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      message.error("Không thể kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          {/* Nếu bạn có logo riêng thì thay src lại */}
          <div className="login-logo-circle">☕</div>
        </div>

        <h1 className="login-title">Trà Sữa Bí Bo</h1>
        <p className="login-subtitle">Đăng nhập để tiếp tục</p>

        <div className="login-field">
          <label>Tên đăng nhập</label>
          <Input
            size="large"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="login-hint">
          </div>
        </div>

        <div className="login-field">
          <label>Mật khẩu</label>
          <Input.Password
            size="large"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="login-hint">
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          block
          className="login-button"
          loading={loading}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>

        <div className="login-forgot">Quên mật khẩu?</div>
      </div>
    </div>
  );
};

export default LoginPage;
