using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("shopAPI/[controller]")]
    [ApiController]
    public class NhaCungCapController : ControllerBase
    {
        private readonly MilkTeaDBContext _context;

        public NhaCungCapController(MilkTeaDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.NhaCungCap.ToListAsync();
            return Ok(new { message = "Lấy danh sách nhà cung cấp thành công!", data });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var ncc = await _context.NhaCungCap.FindAsync(id);
            if (ncc == null) return NotFound($"Không tìm thấy nhà cung cấp {id}");
            return Ok(new { message = "Tìm thấy nhà cung cấp!", data = ncc });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NhaCungCap model)
        {
            if (model == null) return BadRequest("Dữ liệu không hợp lệ");
            model.idNCC = Guid.NewGuid().ToString();
            await _context.NhaCungCap.AddAsync(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm nhà cung cấp thành công!", data = model });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] NhaCungCap update)
        {
            var existing = await _context.NhaCungCap.FindAsync(id);
            if (existing == null) return NotFound($"Không tìm thấy NCC {id}");
            _context.Entry(existing).CurrentValues.SetValues(update);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật NCC thành công!", data = existing });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _context.NhaCungCap.FindAsync(id);
            if (existing == null) return NotFound($"Không tìm thấy NCC {id}");
            _context.NhaCungCap.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa nhà cung cấp thành công!", id });
        }
    }
}
