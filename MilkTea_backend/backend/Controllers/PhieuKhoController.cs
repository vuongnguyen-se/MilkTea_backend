using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static backend.SingleClass.Enum;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class PhieuKhoController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public PhieuKhoController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPhieu()
        {
            var data = await _context.PhieuKho
                .Include(p => p.NguyenLieu)
                .Include(p => p.NhaCungCap)
                .ToListAsync();
            return Ok(new { message = "Lấy danh sách phiếu kho thành công!", data });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhieuKhoById(string id)
        {
            var phieu = await _context.PhieuKho
                .Include(p => p.NguyenLieu)
                .Include(p => p.NhaCungCap)
                .FirstOrDefaultAsync(p => p.idPhieu == id);

            if (phieu == null)
                return NotFound($"Không tìm thấy phiếu kho {id}");

            return Ok(phieu);
        }

        [HttpPost]
        public async Task<IActionResult> TaoPhieu([FromBody] PhieuKho model)
        {
            if (model == null) return BadRequest("Phiếu không hợp lệ");

            model.idPhieu = Guid.NewGuid().ToString();
            model.ngay = DateTime.Now;

            // Cập nhật tồn kho
            var nl = await _context.NguyenLieu.FindAsync(model.idNL);
            if (nl == null) return NotFound($"Không tìm thấy nguyên liệu {model.idNL}");

            if (model.loaiPhieu == loaiPhieuKho.Nhap)
                nl.soLuongTon += model.soLuong;
            else if (model.loaiPhieu == loaiPhieuKho.Xuat)
            {
                if (nl.soLuongTon < model.soLuong)
                    return BadRequest("Không đủ hàng trong kho để xuất!");
                nl.soLuongTon -= model.soLuong;
            }

            await _context.PhieuKho.AddAsync(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Tạo phiếu {model.loaiPhieu} thành công và cập nhật tồn kho!",
                data = model
            });
        }
    }
}
