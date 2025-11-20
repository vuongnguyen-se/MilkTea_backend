using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.SingleClass;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public SanPhamController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllSanPham()
        {
           var allSanPham =  _context.SanPham.ToList();
           return Ok(allSanPham);
        }

        [HttpGet("{id}")]
        public IActionResult GetSanPhamById(string id)
        {
            var sp = _context.SanPham.FirstOrDefault(x => x.idSP == id);
            if (sp == null)
                return NotFound($"Không tìm thấy sản phẩm {id}");

            return Ok(sp);
        }


        [HttpPost]
        public IActionResult AddSanPham([FromBody]SanPham newSanPham)
        {
            try
            {
                if (newSanPham == null)
                {
                    return BadRequest("SanPham is null");
                }

                _context.SanPham.Add(newSanPham);
                _context.SaveChanges();
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
        public IActionResult AddNhieuSanPham([FromBody] List<SanPham> listSanPhams)
        {
            try
            {
                if (listSanPhams.IsNullOrEmpty())
                {
                    return BadRequest("Danh sach san pham null hoac empty!");
                }

                _context.SanPham.AddRange(listSanPhams);
                _context.SaveChanges();

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

        [HttpPut("{id}")]
        public IActionResult UpdateSanPham(string idUpdate,[FromBody] SanPham updatedSanPham)
        {
            var existingSanPham = _context.SanPham.FirstOrDefault(eachSP => eachSP.idSP == idUpdate);
            if (existingSanPham == null)
            {
                return NotFound($"ID '{idUpdate}', San Pham khong ton tai!");
            }

            existingSanPham.tenSP = updatedSanPham.tenSP;
            existingSanPham.loaiSP = updatedSanPham.loaiSP;
            existingSanPham.giaSP = updatedSanPham.giaSP;
            existingSanPham.mota = updatedSanPham.mota;
            existingSanPham.tinhtrang = updatedSanPham.tinhtrang;

            _context.SaveChanges();

            return Ok(new
            {
                message = $"San Pham voi ID '{idUpdate}' da duoc cap nhat!",
                data = existingSanPham
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSanPham(string idDelete)
        {
            var existingSP = _context.SanPham.FirstOrDefault(sanpham => sanpham.idSP == idDelete);
            if (existingSP == null)
                return NotFound($"ID '{idDelete}', San Pham khong ton tai!");

            _context.SanPham.Remove(existingSP);
            _context.SaveChanges();

            return Ok(new
            {
                message = $"ID {idDelete}, San Pham da duoc xoa!",
                data = existingSP
            });
        }
    }
}
