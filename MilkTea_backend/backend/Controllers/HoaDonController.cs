using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static backend.SingleClass.Enum;
using Enum = System.Enum;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class HoaDonController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public HoaDonController(MilkTeaDBContext context)
        {
            _context = context;
        }

        // GET: Lấy tất cả hóa đơn
        [HttpGet]
        public async Task<IActionResult> GetAllHoaDon()
        {
            var allHoaDon = await _context.HoaDon.ToListAsync();
            return Ok(new
            {
                message = "Lấy tất cả hóa đơn thành công!",
                data = allHoaDon
            });
        }

        // GET: Lấy hóa đơn theo ID đơn hàng
        [HttpGet("{idDonHang}")]
        public async Task<IActionResult> GetHoaDonByDonHang(string idDonHang)
        {
            var hoaDon = await _context.HoaDon.FirstOrDefaultAsync(h => h.idDonHang == idDonHang);
            if (hoaDon == null)
                return NotFound($"Hóa đơn của đơn hàng {idDonHang} không tồn tại!");

            return Ok(new
            {
                message = $"Tìm thấy hóa đơn cho đơn hàng {idDonHang}",
                data = hoaDon
            });
        }

        // POST: Tạo hóa đơn từ đơn hàng hoàn thành
        [HttpPost("{idDonHang}")]
        public async Task<IActionResult> CreateHoaDonFromDonHang(string idDonHang)
        {
            var donHang = await _context.DonHang.FindAsync(idDonHang);
            if (donHang == null)
                return NotFound($"Đơn hàng {idDonHang} không tồn tại!");

            if (donHang.trangThai != SingleClass.Enum.trangThaiDonHang.HoanThanh)
                return BadRequest("Chỉ có thể tạo hóa đơn từ đơn hàng đã hoàn thành!");

            // Kiểm tra đã có hóa đơn chưa
            var existingHoaDon = await _context.HoaDon.FirstOrDefaultAsync(h => h.idDonHang == idDonHang);
            if (existingHoaDon != null)
                return BadRequest("Hóa đơn cho đơn hàng này đã tồn tại!");

            var hoaDon = new HoaDon
            {
                maHD = Guid.NewGuid().ToString(),
                idDonHang = idDonHang,
                phuongThuc = donHang.phuongThuc,
                soTien = donHang.tinhTong,
                ngay = DateTime.Now
            };

            await _context.HoaDon.AddAsync(hoaDon);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Tạo hóa đơn thành công!",
                data = hoaDon
            });
        }

        [HttpPatch("{maDH}/phuongthuc")]
        public async Task<IActionResult> UpdatePhuongThucThanhToan(string maDH, [FromBody] string phuongThucMoi)
        {
            var hoaDon = await _context.HoaDon.FindAsync(maDH);
            if (hoaDon == null)
                return NotFound($"Hóa đơn {maDH} không tồn tại!");

            // Convert string sang enum, hỗ trợ tiếng Việt frontend gửi
            phuongThucMoi = phuongThucMoi.Replace(" ", "").ToLower();

            hoaDon.phuongThuc = phuongThucMoi switch
            {
                "tienmat" => phuongThucThanhToan.TienMat,
                "chuyenkhoan" => phuongThucThanhToan.NganHang,
                "vidientu" => phuongThucThanhToan.ViDienTu,
                _ => throw new Exception("Phương thức thanh toán không hợp lệ")
            };

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật phương thức thanh toán thành công!",
                data = hoaDon
            });
        }

    }
}
