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
                .OrderByDescending(p => p.idPhieu)
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
        private async Task<string> GenerateNewPhieuId()
        {
            // Lấy phiếu mới nhất theo ID (PKxxx)
            var lastPhieu = await _context.PhieuKho
                .OrderByDescending(p => p.idPhieu)
                .FirstOrDefaultAsync();

            if (lastPhieu == null)
                return "PK001";

            string? lastId = lastPhieu.idPhieu; // ví dụ PK015
            int num = int.Parse(lastId.Substring(2)); // lấy số: 15
            num++;

            return "PK" + num.ToString("D3"); // thành PK016
        }

        [HttpPost("Nhap")]
        public async Task<IActionResult> NhapKho([FromBody] NhapKhoRequest request)
        {
            if (request.items == null || !request.items.Any())
                return BadRequest(new { message = "Danh sách nguyên liệu nhập không được rỗng" });

            foreach (var item in request.items)
            {
                var nl = await _context.NguyenLieu.FindAsync(item.idNL);
                if (nl == null) continue;

                var newId = await GenerateNewPhieuId();

                var phieu = new PhieuKho
                {
                    idPhieu = newId,
                    idNL = item.idNL,
                    idNCC = request.idNCC,
                    soLuong = item.soLuong,
                    ngay = DateTime.Now,
                    loaiPhieu = loaiPhieuKho.Nhap,
                    ghiChu = request.ghiChu,
                };

                _context.PhieuKho.Add(phieu);

                // Cập nhật kho
                nl.soLuongTon += item.soLuong;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Nhập kho thành công" });
        }


        [HttpPost("Xuat")]
        public async Task<IActionResult> XuatKho([FromBody] XuatKhoRequest request)
        {
            var nl = await _context.NguyenLieu.FindAsync(request.idNL);
            if (nl == null) return NotFound(new { message = "Không tìm thấy nguyên liệu" });

            if (nl.soLuongTon < request.soLuong)
                return BadRequest(new { message = "Không đủ tồn kho" });

            var phieu = new PhieuKho
            {
                idPhieu = "PK" + DateTime.Now.Ticks,
                idNL = request.idNL,
                idNCC = null,
                soLuong = request.soLuong,
                ngay = DateTime.Now,
                loaiPhieu = loaiPhieuKho.Xuat,    // BE tự set
                ghiChu = request.ghiChu
            };

            _context.PhieuKho.Add(phieu);

            // Trừ kho
            nl.soLuongTon -= request.soLuong;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Xuất kho thành công" });
        }


    }
}
