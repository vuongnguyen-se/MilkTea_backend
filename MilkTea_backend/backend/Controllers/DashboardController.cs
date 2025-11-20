using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.SingleClass;
using static backend.SingleClass.Enum;

namespace backend.Controllers
{
  [Route("shopAPI/[controller]")]
  [ApiController]
  public class DashboardController : ControllerBase
  {
    private readonly MilkTeaDBContext _context;

    public DashboardController(MilkTeaDBContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
      var today = DateTime.Today;
      var tomorrow = today.AddDays(1);

      // ================================
      // 1️⃣ Load Data
      // ================================
      var donHang = await _context.DonHang.ToListAsync();
      var sanPham = await _context.SanPham.ToListAsync();
      var nhanVien = await _context.NhanVien.ToListAsync();
      var nguyenLieu = await _context.NguyenLieu.ToListAsync();

      var phieuKho = await _context.PhieuKho
          .Include(p => p.NguyenLieu)
          .Include(p => p.NhaCungCap)
          .ToListAsync();

      // ================================
      // 2️⃣ Dashboard Stats
      // ================================
      double doanhThuHomNay = donHang
          .Where(d => d.ngayDat >= today && d.ngayDat < tomorrow)
          .Sum(d => (double?)d.tinhTong) ?? 0;

      int donHangHomNay = donHang
          .Count(d => d.ngayDat >= today && d.ngayDat < tomorrow);

      double doanhThuThang = donHang
          .Where(d => d.ngayDat.Month == today.Month && d.ngayDat.Year == today.Year)
          .Sum(d => (double?)d.tinhTong) ?? 0;

      int tongSanPham = sanPham.Count;
      int sanPhamDangBan = sanPham.Count(x => x.tinhtrang == true);
      int sanPhamNgungBan = sanPham.Count(x => x.tinhtrang == false);

      int canhBaoTonKho = nguyenLieu.Where(n => n.soLuongTon < 5).Count();

      // ================================
      // 3️⃣ Recent Activities (combine)
      // ================================
      var listRecent = new List<object>();

      // Đơn hàng gần đây
      listRecent.AddRange(
          donHang
          .OrderByDescending(x => x.ngayDat)
          .Take(5)
          .Select(x => new
          {
            time = x.ngayDat.ToString("HH:mm"),
            date = x.ngayDat,
            text = $"Đơn hàng {x.idDH} - {x.trangThai}",
            tag = "Đơn hàng",
            color = "blue"
          })
      );

      // Phiếu kho (Nhập / Xuất)
      listRecent.AddRange(
          phieuKho
          .OrderByDescending(x => x.ngay)
          .Take(5)
          .Select(p => new
          {
            time = p.ngay.ToString("HH:mm"),
            date = p.ngay,
            text = $"{(p.loaiPhieu == loaiPhieuKho.Nhap ? "Nhập" : "Xuất")} {p.soLuong} {p.NguyenLieu?.donVi} - {p.NguyenLieu?.tenNL}",
            tag = p.loaiPhieu == loaiPhieuKho.Nhap ? "Nhập kho" : "Xuất kho",
            color = p.loaiPhieu == loaiPhieuKho.Nhap ? "green" : "red"
          })
      );

      var recentActivities = listRecent
          .OrderByDescending(x => x.GetType().GetProperty("date")!.GetValue(x))
          .Take(10)
          .ToList();

      // ================================
      // 4️⃣ Return JSON
      // ================================
      return Ok(new
      {
        todayRevenue = doanhThuHomNay,
        todayOrders = donHangHomNay,
        staffCount = nhanVien.Count,

        monthlyRevenue = doanhThuThang,

        totalProducts = tongSanPham,
        sellingProducts = sanPhamDangBan,
        stoppedProducts = sanPhamNgungBan,

        lowStock = canhBaoTonKho,

        recentActivities = recentActivities
      });
    }
  }
}
