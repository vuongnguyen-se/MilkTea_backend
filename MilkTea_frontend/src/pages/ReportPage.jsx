/* eslint-disable */
import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Statistic,
  Table,
  Empty,
  Spin,
  Tag,
  Select,
  message,
} from "antd";
import {
  LineChartOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import "../styles/ReportPage.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

// 👉 Base URL backend – chỉnh port nếu khác
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5159/shopAPI";
const BAOCAO_API = `${API_BASE}/BaoCao`;

// format tiền
const formatCurrency = (value) =>
  ((value || 0) ?? 0).toLocaleString("vi-VN") + "đ";

const ReportPage = () => {
  // mode: null | 'revenue' | 'inventory'
  const [mode, setMode] = useState(null);

  // Kiểu xem: theo ngày / theo tháng
  const [revenueView, setRevenueView] = useState("day"); // 'day' | 'month'

  const [range, setRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);
  const [year, setYear] = useState(dayjs().year());

  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);

  const [revSummary, setRevSummary] = useState(null);
  const [revDetail, setRevDetail] = useState([]); // chart data

  const [topProducts, setTopProducts] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);

  // ================== CALL API ==================

  const fetchTopProducts = async () => {
    const resTop = await fetch(
      `${BAOCAO_API}/TopBanChay?soLuongBanChay=5`
    );
    if (!resTop.ok) throw new Error("Không lấy được Top bán chạy");

    const data = await resTop.json();

    // BE trả: { idSP, tenSP, TongSoLuong }
    const mapped = (data || []).map((item, idx) => ({
      key: item.idSP || idx,
      code: item.idSP,
      name: item.tenSP,
      quantity: item.TongSoLuong ?? 0,
    }));

    setTopProducts(mapped);
  };

  const fetchRevenueByDay = async () => {
    const [start, end] = range;
    if (!start || !end) {
      message.warning("Vui lòng chọn khoảng thời gian");
      return;
    }

    const startStr = start.format("YYYY-MM-DD");
    const endStr = end.format("YYYY-MM-DD");

    try {
      setMode("revenue");
      setLoadingRevenue(true);

      const res = await fetch(
        `${BAOCAO_API}/DoanhThuChiTiet?startDate=${startStr}&endDate=${endStr}`
      );
      if (!res.ok) throw new Error("Không tải được báo cáo doanh thu theo ngày");

      const data = await res.json();

      setRevSummary({
        totalRevenue: data.TongDoanhThu ?? 0,
        totalOrders: data.TongSoDonHang ?? 0,
        avgOrder: data.TrungBinhDon ?? 0,
      });

      // ChiTiet: { Ngay, DoanhThu, SoDonHang }
      const mapped = (data.ChiTiet || []).map((item) => ({
        label: item.Ngay,
        revenue: item.DoanhThu ?? 0,
        orders: item.SoDonHang ?? 0,
      }));

      setRevDetail(mapped);

      await fetchTopProducts();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Lỗi khi tải báo cáo doanh thu");
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchRevenueByMonth = async () => {
    if (!year) {
      message.warning("Vui lòng chọn năm");
      return;
    }

    try {
      setMode("revenue");
      setLoadingRevenue(true);

      const res = await fetch(
        `${BAOCAO_API}/DoanhThuTheoThang?year=${year}`
      );
      if (!res.ok) throw new Error("Không tải được báo cáo doanh thu theo tháng");

      const data = await res.json();

      setRevSummary({
        totalRevenue: data.TongDoanhThu ?? 0,
        totalOrders: data.TongSoDonHang ?? 0,
        avgOrder: data.TrungBinhDon ?? 0,
      });

      // ChiTiet: { Thang, DoanhThu, SoDonHang }
      const mapped = (data.ChiTiet || []).map((item) => ({
        label: "Tháng " + (item.Thang || ""),
        revenue: item.DoanhThu ?? 0,
        orders: item.SoDonHang ?? 0,
      }));

      setRevDetail(mapped);

      await fetchTopProducts();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Lỗi khi tải báo cáo doanh thu theo tháng");
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchInventory = async () => {
    try {
      setMode("inventory");
      setLoadingInventory(true);

      // Lấy top nguyên liệu tồn ít (loai = TopTonKhoIt)
      const top = 100;
      const loai = 1; // 0 = nhiều, 1 = ít (theo enum LoaiTonKho)

      const res = await fetch(
        `${BAOCAO_API}/TopTonKho?topTonKho=${top}&loai=${loai}`
      );
      if (!res.ok) throw new Error("Không lấy được báo cáo tồn kho");

      const data = await res.json();

      // BE trả: { idNL, nameNL, TongTonKho }
      const mapped = (data || []).map((item, idx) => {
        const stock = item.TongTonKho ?? 0;

        let status = "Bình thường";
        if (stock === 0) status = "Hết hàng";
        else if (stock <= 10) status = "Sắp hết";

        return {
          key: item.idNL || idx,
          code: item.idNL,
          name: item.nameNL,
          stock,
          statusText: status,
        };
      });

      setInventoryList(mapped);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Lỗi khi tải báo cáo tồn kho");
    } finally {
      setLoadingInventory(false);
    }
  };

  // ================== HANDLER ==================

  const handleViewRevenue = () => {
    if (revenueView === "day") fetchRevenueByDay();
    else fetchRevenueByMonth();
  };

  const handleViewInventory = () => {
    fetchInventory();
  };

  // ================== COLUMNS ==================

  const topProductColumns = [
    {
      title: "Mã SP",
      dataIndex: "code",
      width: 100,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Số lượng bán",
      dataIndex: "quantity",
      width: 130,
    },
  ];

  const inventoryColumns = [
    {
      title: "Mã NL",
      dataIndex: "code",
      width: 100,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusText",
      width: 130,
      render: (text) => {
        let color = "default";
        if (text === "Hết hàng") color = "red";
        else if (text === "Sắp hết") color = "orange";
        else if (text === "Bình thường") color = "green";
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // ================== SUMMARY ==================

  const inventorySummary = useMemo(() => {
    if (!inventoryList.length) return null;

    const total = inventoryList.length;
    const nearlyOut = inventoryList.filter(
      (x) => x.statusText === "Sắp hết"
    ).length;
    const outOfStock = inventoryList.filter(
      (x) => x.statusText === "Hết hàng"
    ).length;

    return { total, nearlyOut, outOfStock };
  }, [inventoryList]);

  // ================== RENDER ==================

  const renderRevenueSection = () => {
    const isEmpty =
      !revSummary &&
      !loadingRevenue &&
      (!revDetail || revDetail.length === 0);

    if (isEmpty) {
      return (
        <div className="report-empty-wrapper">
          <Empty description="Chưa có dữ liệu báo cáo doanh thu" />
        </div>
      );
    }

    return (
      <Spin spinning={loadingRevenue}>
        {revSummary && (
          <Row gutter={16} className="report-summary-row">
            <Col xs={24} md={8}>
              <Card className="report-summary-card">
                <Statistic
                  title="Tổng doanh thu"
                  value={revSummary.totalRevenue}
                  formatter={formatCurrency}
                />
                <div className="report-summary-sub">
                  {revenueView === "day" && range[0] && range[1]
                    ? `${range[0].format("DD/MM/YYYY")} - ${range[1].format(
                      "DD/MM/YYYY"
                    )}`
                    : `Năm ${year}`}
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="report-summary-card">
                <Statistic
                  title="Tổng đơn hàng"
                  value={revSummary.totalOrders}
                />
                <div className="report-summary-sub">
                  Số đơn trong khoảng đã chọn
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="report-summary-card">
                <Statistic
                  title="Giá trị TB/đơn"
                  value={revSummary.avgOrder}
                  formatter={formatCurrency}
                />
                <div className="report-summary-sub">
                  Doanh thu trung bình / đơn
                </div>
              </Card>
            </Col>
          </Row>
        )}

        <Card
          className="report-chart-card"
          title={
            revenueView === "day"
              ? "Biểu đồ doanh thu theo ngày"
              : "Biểu đồ doanh thu theo tháng"
          }
        >
          <div className="report-chart-subtitle">
            Doanh thu và số đơn hàng trong khoảng thời gian đã chọn
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={revDetail}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) =>
                    (v / 1_000_000).toFixed(0) + "tr"
                  }
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Doanh thu") return formatCurrency(value);
                    return value;
                  }}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Doanh thu"
                  barSize={22}
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="Đơn hàng"
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          className="report-table-card"
          title="Top sản phẩm bán chạy"
        >
          <div className="report-chart-subtitle">
            Top 5 sản phẩm có số lượng bán cao nhất
          </div>
          <Table
            dataSource={topProducts}
            columns={topProductColumns}
            pagination={false}
          />
        </Card>
      </Spin>
    );
  };

  const renderInventorySection = () => {
    const isEmpty =
      !inventoryList.length && !loadingInventory && !inventorySummary;

    if (isEmpty) {
      return (
        <div className="report-empty-wrapper">
          <Empty description="Chưa có dữ liệu tồn kho" />
        </div>
      );
    }

    return (
      <Spin spinning={loadingInventory}>
        {inventorySummary && (
          <Row gutter={16} className="report-summary-row">
            <Col xs={24} md={8}>
              <Card className="report-summary-card">
                <Statistic
                  title="Tổng nguyên liệu"
                  value={inventorySummary.total}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="report-summary-card">
                <Statistic
                  title="Sắp hết hàng"
                  value={inventorySummary.nearlyOut}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="report-summary-card">
                <Statistic
                  title="Hết hàng"
                  value={inventorySummary.outOfStock}
                />
              </Card>
            </Col>
          </Row>
        )}

        <Card
          className="report-table-card"
          title="Báo cáo tồn kho chi tiết"
        >
          <div className="report-chart-subtitle">
            Tình trạng tồn kho của các nguyên liệu
          </div>
          <Table
            dataSource={inventoryList}
            columns={inventoryColumns}
            pagination={false}
          />
        </Card>
      </Spin>
    );
  };

  const renderBody = () => {
    if (mode === "revenue") return renderRevenueSection();
    if (mode === "inventory") return renderInventorySection();

    return (
      <div className="report-empty-wrapper">
        <Empty description="Chọn loại báo cáo để xem chi tiết" />
      </div>
    );
  };

  // ================== MAIN ==================

  return (
    <div className="report-page">
      <Card className="report-container">
        <h2 className="report-title">Báo cáo</h2>

        <div className="report-filters">
          <div className="report-filter-block">
            <span className="report-label">Kiểu xem doanh thu</span>
            <Select
              value={revenueView}
              onChange={setRevenueView}
              style={{ width: 200 }}
            >
              <Option value="day">Theo ngày</Option>
              <Option value="month">Theo tháng (theo năm)</Option>
            </Select>
          </div>

          {revenueView === "day" ? (
            <div className="report-filter-block">
              <span className="report-label">Khoảng thời gian</span>
              <RangePicker
                value={range}
                onChange={(val) => setRange(val)}
                format="DD/MM/YYYY"
              />
            </div>
          ) : (
            <div className="report-filter-block">
              <span className="report-label">Năm</span>
              <DatePicker
                picker="year"
                value={dayjs(`${year}-01-01`)}
                onChange={(val) => setYear(val?.year() || dayjs().year())}
                format="YYYY"
              />
            </div>
          )}

          <div className="report-actions">
            <Button
              type={mode === "revenue" ? "primary" : "default"}
              icon={<LineChartOutlined />}
              onClick={handleViewRevenue}
            >
              Xem báo cáo doanh thu
            </Button>

            <Button
              type={mode === "inventory" ? "primary" : "default"}
              icon={<DatabaseOutlined />}
              onClick={handleViewInventory}
            >
              Xem báo cáo tồn kho
            </Button>
          </div>
        </div>

        <div className="report-body">{renderBody()}</div>
      </Card>
    </div>
  );
};

export default ReportPage;
