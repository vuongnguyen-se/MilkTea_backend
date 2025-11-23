using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
  [Route("shopAPI/[controller]")]
  [ApiController]
  public class KhuyenMaiController : ControllerBase
  {
    private readonly MilkTeaDBContext _context;

    public KhuyenMaiController(MilkTeaDBContext context)
    {
      _context = context;
    }

    // ========== GET ALL ==========
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var list = await _context.KhuyenMai.ToListAsync();
      return Ok(new
      {
        message = "Lấy danh sách khuyến mãi thành công",
        data = list
      });
    }

    // ========== GET BY ID ==========
    [HttpGet("{idKM}")]
    public async Task<IActionResult> GetById(string idKM)
    {
      var km = await _context.KhuyenMai.FindAsync(idKM);
      if (km == null)
        return NotFound(new { message = "Không tìm thấy khuyến mãi!" });

      return Ok(new { message = "Thành công", data = km });
    }

    // ========== THÊM ==========
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] KhuyenMai km)
    {
      if (km == null)
        return BadRequest(new { message = "Dữ liệu không hợp lệ" });

      if (await _context.KhuyenMai.AnyAsync(x => x.idKM == km.idKM))
        return Conflict(new { message = $"Mã KM '{km.idKM}' đã tồn tại" });

      _context.KhuyenMai.Add(km);
      await _context.SaveChangesAsync();

      return Ok(new
      {
        message = "Tạo khuyến mãi thành công",
        data = km
      });
    }

    // ========== UPDATE ==========
    [HttpPut("{idKM}")]
    public async Task<IActionResult> Update(string idKM, [FromBody] KhuyenMai kmUpdate)
    {
      var km = await _context.KhuyenMai.FindAsync(idKM);
      if (km == null)
        return NotFound(new { message = "Không tìm thấy khuyến mãi" });

      km.tenKM = kmUpdate.tenKM;
      km.tenKhuyenMai = kmUpdate.tenKhuyenMai;
      km.phanTramGiam = kmUpdate.phanTramGiam;
      km.ngayBatDau = kmUpdate.ngayBatDau;
      km.ngayKetThuc = kmUpdate.ngayKetThuc;

      await _context.SaveChangesAsync();

      return Ok(new
      {
        message = "Cập nhật thành công",
        data = km
      });
    }

    // ========== DELETE ==========
    [HttpDelete("{idKM}")]
    public async Task<IActionResult> Delete(string idKM)
    {
      var km = await _context.KhuyenMai.FindAsync(idKM);
      if (km == null)
        return NotFound(new { message = "Không tìm thấy khuyến mãi" });

      _context.KhuyenMai.Remove(km);
      await _context.SaveChangesAsync();

      return Ok(new { message = "Xóa thành công" });
    }

    // ========== CHECK VALID ==========
    [HttpGet("{idKM}/valid")]
    public async Task<IActionResult> CheckValid(string idKM)
    {
      var km = await _context.KhuyenMai.FindAsync(idKM);
      if (km == null)
        return NotFound();

      var now = DateTime.Now;
      bool isValid = now >= km.ngayBatDau && now <= km.ngayKetThuc;

      return Ok(new
      {
        idKM = km.idKM,
        valid = isValid
      });
    }

    // ========== GET ACTIVE PROMOTIONS ==========
    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
      var now = DateTime.Now;

      var activeList = await _context.KhuyenMai
          .Where(km => now >= km.ngayBatDau && now <= km.ngayKetThuc)
          .ToListAsync();

      return Ok(new
      {
        message = "Danh sách khuyến mãi đang áp dụng",
        data = activeList
      });
    }
    // ========== CHECK PROMOTION BY CODE ==========
    [HttpGet("Check")]
    public async Task<IActionResult> CheckPromotion([FromQuery] string code)
    {
      if (string.IsNullOrWhiteSpace(code))
        return BadRequest("Bạn chưa nhập mã!");

      code = code.Trim().ToUpper();

      var km = await _context.KhuyenMai
          .FirstOrDefaultAsync(k => k.tenKhuyenMai.ToUpper() == code);

      if (km == null)
        return NotFound(new { message = "Mã khuyến mãi không tồn tại!" });

      var now = DateTime.Now;

      if (now < km.ngayBatDau || now > km.ngayKetThuc)
        return BadRequest(new { message = "Mã khuyến mãi đã hết hạn!" });

      return Ok(new
      {
        message = "Áp dụng mã thành công",
        percent = km.phanTramGiam   // ví dụ 0.30 = 30%
      });
    }

  }
}
