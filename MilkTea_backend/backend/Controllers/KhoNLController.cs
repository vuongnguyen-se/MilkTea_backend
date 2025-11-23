using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class KhoNLController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public KhoNLController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNguyenLieu()
        {
            var data = await _context.NguyenLieu.ToListAsync();
            return Ok(new { message = "Lấy tất cả nguyên liệu trong kho thành công!", data });
        }
        
        [HttpGet("{idNL}")]
        public async Task<IActionResult> GetNguyenLieuById(string idNL)
        {
            var nl = await _context.NguyenLieu.FindAsync(idNL);
            if (nl == null)
                return NotFound($"Không tìm thấy nguyên liệu {idNL}");

            return Ok(nl);
        }


        [HttpPatch("{idNL}/nhap")]
        public async Task<IActionResult> NhapKho(string idNL, [FromBody] float soLuong)
        {
            var nl = await _context.NguyenLieu.FindAsync(idNL);
            if (nl == null) return NotFound($"Không tìm thấy nguyên liệu {idNL}");

            nl.soLuongTon += soLuong;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Nhập thêm {soLuong} {nl.donVi} {nl.tenNL} thành công!", data = nl });
        }

        [HttpPatch("{idNL}/xuat")]
        public async Task<IActionResult> XuatKho(string idNL, [FromBody] float soLuong)
        {
            var nl = await _context.NguyenLieu.FindAsync(idNL);
            if (nl == null) return NotFound($"Không tìm thấy nguyên liệu {idNL}");
            if (nl.soLuongTon < soLuong) return BadRequest("Không đủ số lượng tồn!");

            nl.soLuongTon -= soLuong;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Xuất {soLuong} {nl.donVi} {nl.tenNL} thành công!", data = nl });
        }
    }
}