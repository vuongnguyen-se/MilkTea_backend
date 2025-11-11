using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.SingleClass;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class MilkTeaController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public MilkTeaController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSanPham()
        {
           var allSanPham = await _context.SanPham.ToListAsync();
           return Ok(allSanPham);
        }

        [HttpPost]
        public async Task<IActionResult> AddSanPham([FromBody]SanPham newSanPham)
        {
            try
            {   
                if (newSanPham == null)
                {
                    return BadRequest("SanPham is null");
                }

                await _context.SanPham.AddAsync(newSanPham);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Adding new San Pham succeeded",
                    data = newSanPham
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPost("multiple")]
        public async Task<IActionResult> AddNhieuSanPham([FromBody] List<SanPham> listSanPhams)
        {
            try
            {
                if (listSanPhams.IsNullOrEmpty())
                {
                    return BadRequest("Danh sach san pham null hoac empty!");
                }

                await _context.SanPham.AddRangeAsync(listSanPhams);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Danh sach san pham da duoc them vao",
                    data = listSanPhams
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPut("{idUpdate}")]
        public async Task<IActionResult> UpdateSanPham(string idUpdate,[FromBody] SanPham updatedSanPham)
        {
            var existingSanPham = await _context.SanPham.FirstOrDefaultAsync(eachSP => eachSP.idSP == idUpdate);
            if (existingSanPham == null)
            {
                return NotFound($"ID '{idUpdate}', San Pham khong ton tai!");
            }

            //existingSanPham.tenSP = updatedSanPham.tenSP;
            //existingSanPham.loaiSP = updatedSanPham.loaiSP;
            //existingSanPham.giaSP = updatedSanPham.giaSP;
            //existingSanPham.mota = updatedSanPham.mota;
            //existingSanPham.tinhtrang = updatedSanPham.tinhtrang;

            _context.Entry(existingSanPham).CurrentValues.SetValues(updatedSanPham);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"San Pham voi ID '{idUpdate}' da duoc cap nhat!",
                data = existingSanPham
            });
        }

        [HttpDelete("{idDelete}")]
        public async Task<IActionResult> DeleteSanPham(string idDelete)
        {
            var existingSP = await _context.SanPham.FirstOrDefaultAsync(sanpham => sanpham.idSP == idDelete);
            if (existingSP == null)
                return NotFound($"ID '{idDelete}', San Pham khong ton tai!");

            _context.SanPham.Remove(existingSP);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"ID {idDelete}, San Pham da duoc xoa!",
                idDelete
            });
        }
    }
}
