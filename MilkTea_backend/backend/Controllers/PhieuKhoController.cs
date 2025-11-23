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

        // =============================
        // MODEL REQUEST CHUẨN
        // =============================
        public class NhapKhoItem
        {
            public string idNL { get; set; }
            public float soLuong { get; set; }
            public DateTime? hanSuDung { get; set; }
        }

        public class NhapKhoRequest
        {
            public string? idNCC { get; set; }
            public string? ghiChu { get; set; }
            public List<NhapKhoItem> items { get; set; } = new();
        }

        public class XuatKhoRequest
        {
            public string idNL { get; set; }
            public float soLuong { get; set; }
            public string? ghiChu { get; set; }
        }


        // ==============================
        // GET ALL
        // ==============================
        [HttpGet]
        public async Task<IActionResult> GetAllPhieu()
        {
            var data = await _context.PhieuKho
                .Include(x => x.NguyenLieu)
                .Include(x => x.NhaCungCap)
                .OrderByDescending(x => x.idPhieu)
                .ToListAsync();

            return Ok(new { message = "Lấy danh sách phiếu kho thành công!", data });
        }

        // ==============================
        // GET BY ID
        // ==============================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhieuKhoById(string id)
        {
            var phieu = await _context.PhieuKho
                .Include(x => x.NguyenLieu)
                .Include(x => x.NhaCungCap)
                .FirstOrDefaultAsync(x => x.idPhieu == id);

            if (phieu == null)
                return NotFound($"Không tìm thấy phiếu {id}");

            return Ok(phieu);
        }


        // ==============================
        // SINH MÃ PKxxx
        // ==============================
        private async Task<string> GenerateNewPhieuId()
        {
            var last = await _context.PhieuKho
                .OrderByDescending(x => x.idPhieu)
                .Select(x => x.idPhieu)
                .FirstOrDefaultAsync();

            if (last == null) return "PK001";

            int num = int.Parse(last.Substring(2));
            return "PK" + (num + 1).ToString("D3");
        }


        // ==============================
        // NHẬP KHO (NHIỀU NGUYÊN LIỆU)
        // ==============================
        [HttpPost("Nhap")]
        public async Task<IActionResult> NhapKho([FromBody] NhapKhoRequest request)
        {
            if (request == null || request.items == null || !request.items.Any())
            {
                return BadRequest(new { message = "Dữ liệu nhập kho không hợp lệ" });
            }

            foreach (var item in request.items)
            {
                // 1. Check nguyên liệu
                var nl = await _context.NguyenLieu.FindAsync(item.idNL);
                if (nl == null)
                {
                    return NotFound(new { message = $"Không tìm thấy nguyên liệu {item.idNL}" });
                }

                // 2. Cập nhật tồn kho
                nl.soLuongTon += item.soLuong;

                // 3. Tạo phiếu nhập
                var phieu = new PhieuKho
                {
                    idPhieu = "PK" + DateTime.UtcNow.Ticks,
                    idNL = item.idNL,
                    idNCC = request.idNCC,
                    soLuong = item.soLuong,
                    ngay = DateTime.Now,
                    loaiPhieu = loaiPhieuKho.Nhap,
                    ghiChu = request.ghiChu ?? ""
                };

                _context.PhieuKho.Add(phieu);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Nhập kho thành công" });
        }



        // ==============================
        // XUẤT KHO
        // ==============================
        [HttpPost("Xuat")]
        public async Task<IActionResult> XuatKho([FromBody] XuatKhoRequest request)
        {
            var nl = await _context.NguyenLieu.FindAsync(request.idNL);
            if (nl == null) return NotFound("Không tìm thấy nguyên liệu!");

            if (nl.soLuongTon < request.soLuong)
                return BadRequest("Không đủ tồn kho!");

            var newId = await GenerateNewPhieuId();

            var phieu = new PhieuKho
            {
                idPhieu = newId,
                idNL = request.idNL,
                soLuong = request.soLuong,
                ngay = DateTime.Now,
                loaiPhieu = loaiPhieuKho.Xuat,
                ghiChu = request.ghiChu ?? "Xuất kho"
            };

            _context.PhieuKho.Add(phieu);

            nl.soLuongTon -= request.soLuong;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Xuất kho thành công!" });
        }
    }
}
