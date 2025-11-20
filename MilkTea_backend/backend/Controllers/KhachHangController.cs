using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.SingleClass;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class KhachHangController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public KhachHangController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllKhachHang()
        {
            var list = _context.KhachHang.ToList();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public IActionResult GetKhachHangById(string id)
        {
            var kh = _context.KhachHang.FirstOrDefault(x => x.idTK == id);
            if (kh == null)
                return NotFound($"Không tìm thấy khách hàng ID: {id}");

            return Ok(kh);
        }


        [HttpPost]
        public IActionResult AddKhachHnang([FromBody] KhachHang kh)
        {
            if (kh == null) return BadRequest("Khách hàng rỗng");

            _context.KhachHang.Add(kh); // EF tự insert vào TaiKhoan + KhachHang
            _context.SaveChanges();

            return Ok(new { message = "Thêm khách hàng thành công!", data = kh });
        }

        [HttpPost("multiple")]
        public IActionResult AddNhieuKhachHang([FromBody] List<KhachHang> listKhachHangs)
        {
            try
            {
                if (listKhachHangs.IsNullOrEmpty())
                {
                    return BadRequest("Danh sach Khach Hang null hoac empty!");
                }

                _context.TaiKhoan.AddRange(listKhachHangs);
                _context.SaveChanges();

                return Ok(new
                {
                    message = "Danh sach Khach Hang da duoc them vao",
                    data = listKhachHangs
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        // Cập nhật khách hàng
        [HttpPut("{id}")]
        public IActionResult UpdateKhachHang(string id, [FromBody] KhachHang updated)
        {
            var existing = _context.KhachHang.FirstOrDefault(x => x.idTK == id);
            if (existing == null) return NotFound($"Không tìm thấy khách hàng ID: {id}");

            existing.tenTK = updated.tenTK;
            existing.dChi = updated.dChi;
            existing.sdt = updated.sdt;
            existing.tenDN = updated.tenDN;
            existing.mKhau = updated.mKhau;
            existing.vaiTro = updated.vaiTro;
            existing.biKhoa = updated.biKhoa;

            existing.diemTichLuy = updated.diemTichLuy;
            existing.loaiKH = updated.loaiKH;

            _context.SaveChanges();

            return Ok(new { message = "Cập nhật khách hàng thành công!", data = existing });
        }

        // Xóa khách hàng
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var existing = _context.KhachHang.FirstOrDefault(x => x.idTK == id);
            if (existing == null) return NotFound($"Không tìm thấy khách hàng ID: {id}");

            _context.KhachHang.Remove(existing);
            _context.SaveChanges();

            return Ok(new { message = "Xóa khách hàng thành công!", id });
        }

        // Toggle khóa / mở khóa
        [HttpPatch("toggle-lock/{id}")]
        public async Task<IActionResult> ToggleLockKhachHang(string id)
        {
            var kh = await _context.KhachHang.FindAsync(id);
            if (kh == null) return NotFound(new { message = "Không tìm thấy khách hàng" });

            kh.biKhoa = !kh.biKhoa;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = kh.biKhoa ? "Khách hàng đã bị khóa" : "Khách hàng đã mở khóa",
                trangThai = kh.biKhoa
            });
        }
    }
}
