using backend.Models;
using backend.QuanLy;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static backend.SingleClass.Enum;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class BaoCaoController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public BaoCaoController(MilkTeaDBContext context)
        {
            _context = context;
        }

        // 1️⃣ DOANH THU TỔNG (dùng class QuanLyDonHang)
        [HttpGet("DoanhThu")]
        public async Task<IActionResult> GetBaoCaoDoanhThu([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Lấy tất cả đơn hàng
            var donHangs = await _context.DonHang.ToListAsync();

            // Dùng QuanLyDonHang để tính tổng doanh thu
            var qlDonHang = new QuanLyDonHang(donHangs);
            var doanhThu = qlDonHang.BaoCaoDoanhThu(startDate, endDate); // :contentReference[oaicite:0]{index=0}

            return Ok(doanhThu);
        }

        // 2️⃣ DOANH THU CHI TIẾT THEO NGÀY (dùng cho biểu đồ)
        [HttpGet("DoanhThuChiTiet")]
        public async Task<IActionResult> GetDoanhThuChiTiet(
    [FromQuery] DateTime startDate,
    [FromQuery] DateTime endDate)
        {
            // Fix lệch giờ: convert về Date component
            startDate = startDate.Date;
            endDate = endDate.Date.AddDays(1).AddTicks(-1); // lấy hết ngày

            var donhang = await _context.DonHang
                .Where(d => d.ngayDat >= startDate && d.ngayDat <= endDate)
                .ToListAsync();

            var result = donhang
                .GroupBy(d => d.ngayDat.Date)
                .Select(g => new
                {
                    Ngay = g.Key,
                    DoanhThu = g.Sum(x => x.tinhTong),
                    SoDonHang = g.Count()
                })
                .OrderBy(x => x.Ngay)
                .ToList();

            return Ok(new
            {
                TongDoanhThu = result.Sum(x => x.DoanhThu),
                TongSoDonHang = result.Sum(x => x.SoDonHang),
                TrungBinhDon = result.Count == 0 ? 0 : result.Sum(x => x.DoanhThu) / result.Sum(x => x.SoDonHang),
                ChiTiet = result
            });
        }

        // 3️⃣ DOANH THU THEO THÁNG (năm bất kỳ)
        [HttpGet("DoanhThuTheoThang")]
        public async Task<IActionResult> GetDoanhThuTheoThang([FromQuery] int year)
        {
            try
            {
                var donhang = await _context.DonHang
                    .Where(d => d.ngayDat.Year == year)
                    .ToListAsync();

                var detail = donhang
                    .GroupBy(d => d.ngayDat.Month)
                    .Select(g => new
                    {
                        Thang = g.Key.ToString("00"),
                        DoanhThu = g.Sum(x => x.tinhTong),
                        SoDonHang = g.Count()
                    })
                    .OrderBy(x => x.Thang)
                    .ToList();

                var tongDoanhThu = detail.Sum(x => x.DoanhThu);
                var tongSoDon = detail.Sum(x => x.SoDonHang);

                return Ok(new
                {
                    Nam = year,
                    TongDoanhThu = tongDoanhThu,
                    TongSoDonHang = tongSoDon,
                    TrungBinhDon = tongSoDon == 0 ? 0 : tongDoanhThu / tongSoDon,
                    ChiTiet = detail
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi hệ thống: " + ex.Message);
            }
        }

        // 4️⃣ TOP SẢN PHẨM BÁN CHẠY – DÙNG QuanLySanPham
        [HttpGet("TopBanChay")]
        public async Task<IActionResult> GetSanPhamBanChay([FromQuery] int soLuongBanChay = 5)
        {
            try
            {
                // Lấy chi tiết đơn hàng & sản phẩm từ DB
                var ctdh = await _context.ChiTietDonHang.ToListAsync();  // :contentReference[oaicite:1]{index=1}
                var listSanPham = await _context.SanPham.ToListAsync();  // :contentReference[oaicite:2]{index=2}

                // Dùng QuanLySanPham để thống kê
                var qlBanChay = new QuanLySanPham(listSanPham, ctdh);
                var listSanPhamBanChay = qlBanChay.BaoCaoSanPhamBanChay(soLuongBanChay);  // :contentReference[oaicite:3]{index=3}

                // listSanPhamBanChay là List<ThongKeSanPhamDTO>:
                // { idSP, tenSP, TongSoLuong }

                return Ok(listSanPhamBanChay);
            }
            catch (Exception e)
            {
                return StatusCode(500, "Lỗi hệ thống: " + e.Message);
            }
        }

        // 5️⃣ TOP TỒN KHO – DÙNG QuanLyTonKho
        [HttpGet("TopTonKho")]
        public async Task<IActionResult> GetTopTonKho([FromQuery] int topTonKho, [FromQuery] LoaiTonKho loai)
        {
            try
            {
                // Lấy danh sách nguyên liệu từ DB
                var nguyenlieu = await _context.NguyenLieu.ToListAsync(); // :contentReference[oaicite:4]{index=4}

                // Dùng QuanLyTonKho để thống kê tồn kho
                var qlTonKho = new QuanLyTonKho(nguyenlieu);
                var listTopTonKho = qlTonKho.BaoCaoTonKho(topTonKho, loai);  // :contentReference[oaicite:5]{index=5}

                // listTopTonKho là List<TonKhoDTO>:
                // { idNL, nameNL, TongTonKho }

                return Ok(listTopTonKho);
            }
            catch (Exception e)
            {
                return StatusCode(500, "Lỗi hệ thống: " + e.Message);
            }
        }
    }
}
