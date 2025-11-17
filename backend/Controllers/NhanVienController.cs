using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.SingleClass;

namespace backend.Controllers
{
    [Route("Nhan-Vien/[controller]")]
    [ApiController]
    public class NhanVienController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public NhanVienController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllNhanVien()
        {
            var list = _context.NhanVien.ToList();
            return Ok(list);
        }

        [HttpPost]
        public IActionResult AddNhanVien([FromBody] NhanVien nv)
        {
            if (nv == null) return BadRequest("Nhân viên rỗng");

            _context.NhanVien.Add(nv); // EF tự insert vào TaiKhoan + NhanVien
            _context.SaveChanges();

            return Ok(new { message = "Thêm nhân viên thành công!", data = nv });
        }

        [HttpPost("multiple")]
        public IActionResult AddNhieuNhanVien([FromBody] List<NhanVien> listNhanViens)
        {
            if (listNhanViens == null || !listNhanViens.Any())
                return BadRequest("Danh sách nhân viên rỗng");

            _context.NhanVien.AddRange(listNhanViens);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Danh sách nhân viên đã được thêm",
                data = listNhanViens
            });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateNhanVien(string id, [FromBody] NhanVien updated)
        {
            var existing = _context.NhanVien.FirstOrDefault(x => x.idTK == id);
            if (existing == null) return NotFound($"Không tìm thấy nhân viên ID: {id}");

            existing.tenTK = updated.tenTK;
            existing.dChi = updated.dChi;
            existing.sdt = updated.sdt;
            existing.tenDN = updated.tenDN;
            existing.mKhau = updated.mKhau;
            existing.vaiTro = updated.vaiTro;
            existing.biKhoa = updated.biKhoa;

            existing.chucVu = updated.chucVu;
            existing.caLam = updated.caLam;
            existing.luong = updated.luong;

            _context.SaveChanges();

            return Ok(new { message = "Cập nhật nhân viên thành công!", data = existing });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNhanVien(string id)
        {
            var existing = _context.NhanVien.FirstOrDefault(x => x.idTK == id);
            if (existing == null) return NotFound($"Không tìm thấy nhân viên ID: {id}");

            _context.NhanVien.Remove(existing);
            _context.SaveChanges();

            return Ok(new { message = "Xóa nhân viên thành công!", id });
        }

        [HttpPatch("toggle-lock/{id}")]
        public async Task<IActionResult> ToggleLockNhanVien(string id)
        {
            var nv = await _context.NhanVien.FindAsync(id);
            if (nv == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            nv.biKhoa = !nv.biKhoa;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = nv.biKhoa ? "Nhân viên đã bị khóa" : "Nhân viên đã mở khóa",
                trangThai = nv.biKhoa
            });
        }
    }
}
