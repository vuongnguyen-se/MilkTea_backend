using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
  [Route("shopAPI/[controller]")]
  [ApiController]
  public class ChiTietDonHangController : ControllerBase
  {
    private readonly MilkTeaDBContext _context;

    public ChiTietDonHangController(MilkTeaDBContext context)
    {
      _context = context;
    }

    // GET: shopAPI/ChiTietDonHang/DH001
    [HttpGet("{idDonHang}")]
    public async Task<IActionResult> GetByDonHang(string idDonHang)
    {
      var list = await _context.ChiTietDonHang
    .Include(ct => ct.SanPham)
    .Where(ct => ct.idDH == idDonHang)
    .ToListAsync();

      if (list == null || !list.Any())
        return NotFound($"Không tìm thấy chi tiết đơn hàng {idDonHang}");

      return Ok(new
      {
        message = $"Lấy chi tiết đơn hàng {idDonHang} thành công!",
        data = list
      });
    }
  }
}
