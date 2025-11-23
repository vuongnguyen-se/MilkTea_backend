using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
  [Route("shopAPI/[controller]")]
  [ApiController]
  public class CungCapNguyenLieuController : ControllerBase
  {
    private readonly MilkTeaDBContext _context;

    public CungCapNguyenLieuController(MilkTeaDBContext context)
    {
      _context = context;
    }

    // GET: shopAPI/CungCapNguyenLieu/NCC001
    [HttpGet("{idNCC}")]
    public async Task<IActionResult> GetNguyenLieuByNCC(string idNCC)
    {
      var result = await (
          from c in _context.CungCapNguyenLieu
          join nl in _context.NguyenLieu
              on c.idNL equals nl.idNL
          where c.idNCC == idNCC
          select new
          {
            idNCC = c.idNCC,
            idNL = nl.idNL,
            tenNL = nl.tenNL,
            donVi = nl.donVi
          }
      ).ToListAsync();

      return Ok(new
      {
        message = "Lấy danh sách nguyên liệu NCC cung cấp thành công!",
        data = result
      });
    }
  }
}
