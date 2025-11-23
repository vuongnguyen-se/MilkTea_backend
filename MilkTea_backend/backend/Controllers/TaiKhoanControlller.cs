using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.SingleClass;
using Microsoft.IdentityModel.Tokens;
using static backend.SingleClass.Enum;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public TaiKhoanController(MilkTeaDBContext context)
        {
            _context = context;
        }

        // GET: shopAPI/TaiKhoan
        [HttpGet]
        public IActionResult GetAllTaiKhoan()
        {
            return Ok(_context.TaiKhoan.ToList());
        }

        // GET: shopAPI/TaiKhoan/KH001
        [HttpGet("by-id/{id}")]
        public IActionResult GetTaiKhoanById(string id)
        {
            var tk = _context.TaiKhoan.FirstOrDefault(x => x.idTK == id);
            if (tk == null)
                return NotFound($"ID '{id}' không tồn tại");

            return Ok(tk);
        }

        // POST: shopAPI/TaiKhoan
        [HttpPost]
        public IActionResult AddTaiKhoan([FromBody] TaiKhoan newTaiKhoan)
        {
            if (newTaiKhoan == null)
                return BadRequest("TaiKhoan is null");

            _context.TaiKhoan.Add(newTaiKhoan);
            _context.SaveChanges();

            return Ok(new { message = "Thêm tài khoản thành công", data = newTaiKhoan });
        }

        // POST: shopAPI/TaiKhoan/multiple
        [HttpPost("multiple")]
        public IActionResult AddNhieuTaiKhoan([FromBody] List<TaiKhoan> listTaiKhoans)
        {
            if (listTaiKhoans.IsNullOrEmpty())
                return BadRequest("Danh sách rỗng!");

            _context.TaiKhoan.AddRange(listTaiKhoans);
            _context.SaveChanges();

            return Ok(new { message = "Đã thêm danh sách", data = listTaiKhoans });
        }

        // PUT: shopAPI/TaiKhoan/KH001
        [HttpPut("{id}")]
        public IActionResult UpdateTaiKhoan(string id, [FromBody] TaiKhoan updatedTaiKhoan)
        {
            var existingTaiKhoan = _context.TaiKhoan.FirstOrDefault(x => x.idTK == id);
            if (existingTaiKhoan == null)
                return NotFound($"ID '{id}' không tồn tại!");

            existingTaiKhoan.tenTK = updatedTaiKhoan.tenTK;
            existingTaiKhoan.dChi = updatedTaiKhoan.dChi;
            existingTaiKhoan.sdt = updatedTaiKhoan.sdt;
            existingTaiKhoan.tenDN = updatedTaiKhoan.tenDN;
            existingTaiKhoan.mKhau = updatedTaiKhoan.mKhau;
            existingTaiKhoan.vaiTro = updatedTaiKhoan.vaiTro;
            existingTaiKhoan.biKhoa = updatedTaiKhoan.biKhoa;

            _context.SaveChanges();

            return Ok(new { message = "Cập nhật thành công!", data = existingTaiKhoan });
        }

        // DELETE: shopAPI/TaiKhoan/KH001
        [HttpDelete("{id}")]
        public IActionResult DeleteTaiKhoan(string id)
        {
            var existing = _context.TaiKhoan.FirstOrDefault(x => x.idTK == id);
            if (existing == null)
                return NotFound($"ID '{id}' không tồn tại!");

            _context.TaiKhoan.Remove(existing);
            _context.SaveChanges();

            return Ok(new { message = "Xóa thành công!", data = existing });
        }

        // PATCH: shopAPI/TaiKhoan/toggle-lock/KH001
        [HttpPatch("toggle-lock/{id}")]
        public async Task<IActionResult> ToggleLockAccount(string id)
        {
            var taiKhoan = await _context.TaiKhoan.FindAsync(id);
            if (taiKhoan == null)
                return NotFound(new { message = "Không tìm thấy tài khoản" });

            taiKhoan.biKhoa = !taiKhoan.biKhoa;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = taiKhoan.biKhoa ? "Tài khoản đã bị khóa" : "Tài khoản đã được mở khóa",
                trangThai = taiKhoan.biKhoa
            });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var tk = await _context.TaiKhoan
                .FirstOrDefaultAsync(t => t.tenDN == req.username
                                       && t.mKhau == req.password);

            if (tk == null)
                return BadRequest("Sai tên đăng nhập hoặc mật khẩu!");

            // Chặn khách hàng đăng nhập
            if (tk.vaiTro == vaiTroTaiKhoan.KhachHang)
                return BadRequest("Tài khoản khách hàng không được phép đăng nhập hệ thống!");

            // Kiểm tra tài khoản bị khoá
            if (tk.biKhoa)
                return BadRequest("Tài khoản đã bị khoá!");

            return Ok(new
            {
                id = tk.idTK,
                username = tk.tenTK,
                role = tk.vaiTro.ToString()
            });
        }

    }
}
