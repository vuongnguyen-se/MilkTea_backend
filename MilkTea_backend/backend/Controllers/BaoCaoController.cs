using backend.Models;
using backend.QuanLy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet("DoanhThu")]
        public async Task<IActionResult> GetBaoCaoDoanhThu([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {   
            // collect data from donhang table in database.
            var donHangs = await _context.DonHang.ToListAsync();

            var qlDonHang = new QuanLyDonHang(donHangs);
            var doanhThu = qlDonHang.BaoCaoDoanhThu(startDate, endDate);
            return Ok(doanhThu);
        }

        [HttpGet("TopBanChay")]
        public async Task<IActionResult> GetSanPhamBanChay([FromQuery] int soLuongBanChay)
        {
            try
            {   // collect data from chitietdonhang
                var ctdh = await _context.ChiTietDonHang.ToListAsync(); 
                // collect data from sanpham
                var listSanPham = await _context.SanPham.ToListAsync();

                var qlBanChay = new QuanLySanPham(listSanPham, ctdh);
                var listSanPhamBanChay = qlBanChay.BaoCaoSanPhamBanChay(soLuongBanChay);
                return Ok(listSanPhamBanChay);
            }
            catch (Exception e)
            {
                return StatusCode(500, "Lỗi hệ thống: " + e.Message);
            }
        }

        [HttpGet("TopTonKho")]
        public async Task<IActionResult> GetTopTonKho([FromQuery] int topTonKho,[FromQuery] LoaiTonKho loai)
        {
            try
            {
                // collect data from nguyenlieu
                var nguyenlieu = await _context.NguyenLieu.ToListAsync();

                var qlTonKho = new QuanLyTonKho(nguyenlieu);
                var listTopTonKho = qlTonKho.BaoCaoTonKho(topTonKho, loai);
                return Ok(listTopTonKho);
            }
            catch (Exception e)
            {
                return StatusCode(500, "Lỗi hệ thống: " + e.Message);
            }
           
        }
    }
}
