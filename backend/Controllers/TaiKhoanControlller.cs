using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.SingleClass;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("TaiKhoan/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public TaiKhoanController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllTaiKhoan()
        {
            var allTaiKhoan = _context.TaiKhoan.ToList();
            return Ok(allTaiKhoan);
        }

        [HttpPost]
        public IActionResult AddTaiKhoan([FromBody] TaiKhoan newTaiKhoan)
        {
            try
            {
                if (newTaiKhoan == null)
                {
                    return BadRequest("TaiKhoan is null");
                }

                _context.TaiKhoan.Add(newTaiKhoan);
                _context.SaveChanges();
                return Ok(new
                {
                    message = "Adding new Tai Khoan succeeded",
                    data = newTaiKhoan
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPost("multiple")]
        public IActionResult AddNhieuTaiKhoan([FromBody] List<TaiKhoan> listTaiKhoans)
        {
            try
            {
                if (listTaiKhoans.IsNullOrEmpty())
                {
                    return BadRequest("Danh sach tai khoan null hoac empty!");
                }

                _context.TaiKhoan.AddRange(listTaiKhoans);
                _context.SaveChanges();

                return Ok(new
                {
                    message = "Danh sach tai khoan da duoc them vao",
                    data = listTaiKhoans
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTaiKhoan(string idUpdate, [FromBody] TaiKhoan updatedTaiKhoan)
        {
            var existingTaiKhoan = _context.TaiKhoan.FirstOrDefault(eachSP => eachSP.idTK == idUpdate);
            if (existingTaiKhoan == null)
            {
                return NotFound($"ID '{idUpdate}', tai khoan khong ton tai!");
            }

            existingTaiKhoan.tenTK = updatedTaiKhoan.tenTK;
            existingTaiKhoan.dChi = updatedTaiKhoan.dChi;
            existingTaiKhoan.sdt = updatedTaiKhoan.sdt;
            existingTaiKhoan.tenDN = updatedTaiKhoan.tenDN;
            existingTaiKhoan.mKhau = updatedTaiKhoan.mKhau;
            existingTaiKhoan.vaiTro = updatedTaiKhoan.vaiTro;
            existingTaiKhoan.biKhoa = updatedTaiKhoan.biKhoa;

            _context.SaveChanges();

            return Ok(new
            {
                message = $"tai khoan voi ID '{idUpdate}' da duoc cap nhat!",
                data = existingTaiKhoan
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTaiKhoan(string idDelete)
        {
            var existingSP = _context.TaiKhoan.FirstOrDefault(TaiKhoan => TaiKhoan.idTK == idDelete);
            if (existingSP == null)
                return NotFound($"ID '{idDelete}', tai khoan khong ton tai!");

            _context.TaiKhoan.Remove(existingSP);
            _context.SaveChanges();

            return Ok(new
            {
                message = $"ID {idDelete}, tai khoan da duoc xoa!",
                data = existingSP
            });
        }

        [HttpPatch("toggle-lock/{id}")]
        public async Task<IActionResult> ToggleLockAccount(String idToggleLock)
        {
            var taiKhoan = await _context.TaiKhoan.FindAsync(idToggleLock);
            if (taiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản" });
            }

            // Đảo trạng thái khóa / mở khóa
            taiKhoan.biKhoa = !taiKhoan.biKhoa;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = taiKhoan.biKhoa ? "Tài khoản đã bị khóa" : "Tài khoản đã được mở khóa",
                trangThai = taiKhoan.biKhoa
            });
        }

    }
}
