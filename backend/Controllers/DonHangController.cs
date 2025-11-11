using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class DonHangController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public DonHangController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDonHang()
        {
            var allDonHang = await _context.DonHang
                .Include(d => d.KhachHang)
                .Include(d => d.NhanVien)
                .Include(d => d.KhuyenMai)
                .ToListAsync();

            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "get all DonHang thanh cong!",
                data = allDonHang
            });
        }

        [HttpGet("{idGet}")]
        public async Task<IActionResult> GetSpecificDonHang(string idGet)
        {
            var specificDonHang = await _context.DonHang
                .Include(d => d.KhachHang)
                .Include(d => d.NhanVien)
                .Include(d => d.KhuyenMai)
                .FirstOrDefaultAsync(d => d.idDH == idGet);
            if (specificDonHang == null)
            {
                return NotFound($"ID '{idGet}' is not found!");
            }

            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = $"DonHang voi ID: '{idGet}' tim thay thanh cong!",
                data = specificDonHang
            });
        }

        [HttpPost]
        public async Task<IActionResult> PostDonHang([FromBody] DonHang newDonHang)
        {
            try
            {
                if (newDonHang == null)
                {
                    return BadRequest("Don Hang moi la null!");
                }

                await _context.DonHang.AddAsync(newDonHang);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = $"Them DonHang, ID: '{newDonHang.idDH}' thanh cong",
                    data = newDonHang
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPost("multiple")]
        public async Task<IActionResult> PostNhieuDonHang([FromBody] List<DonHang> danhSachDonHang)
        {
            try
            {
                if (danhSachDonHang.IsNullOrEmpty())
                {
                    return BadRequest("danh sach Don Hang la null hoac empty!");
                }

                await _context.DonHang.AddRangeAsync(danhSachDonHang);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "danh sach Don Hang duoc them vao thanh cong!",
                    data = danhSachDonHang
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPut("{idUpdate}")]
        public async Task<IActionResult> UpdateDonHang(string idUpdate, [FromBody] DonHang updatedDonHang)
        {
            try
            {
                if (idUpdate != updatedDonHang.idDH)
                {
                    return BadRequest("the idUpdate is not consistent!");
                }

                // Find existing DonHang using the provided idUpdate.
                var existingDonHang = await _context.DonHang.FindAsync(idUpdate);
                if (existingDonHang == null)
                {
                    return NotFound($"ID: '{idUpdate}', DonHang is not found!");
                }

                // Update each attribute from updatedDonHang to existingDonHang.
                _context.Entry(existingDonHang).CurrentValues.SetValues(updatedDonHang);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = $"Update DonHang, ID '{idUpdate}' thanh cong!",
                    data = existingDonHang
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpDelete("{idDelete}")]
        public async Task<IActionResult> DeleteDonHang(string idDelete)
        {
            try
            {
                var existingDonHang = await _context.DonHang.FindAsync(idDelete);
                if (existingDonHang == null)
                {
                    return NotFound($"ID: '{idDelete}', Don Hang not found!");
                }

                _context.DonHang.Remove(existingDonHang);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = $"ID: '{idDelete}', DonHang da duoc xoa!",
                    idDelete
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
