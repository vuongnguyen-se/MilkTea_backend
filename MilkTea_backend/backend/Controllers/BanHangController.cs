using backend.Models;
using backend.SingleClass;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static backend.SingleClass.Enum;

namespace backend.Controllers
{
  [Route("shopAPI/[controller]")]
  [ApiController]
  public class BanHangController : ControllerBase
  {
    private readonly MilkTeaDBContext _context;

    public BanHangController(MilkTeaDBContext context)
    {
      _context = context;
    }

    // ====== DTO nhận từ FE ======
    public class CheckoutTopping
    {
      public string? id { get; set; }       // id FE, không dùng nhiều bên BE
      public string? name { get; set; }
      public decimal price { get; set; }
    }

    public class CheckoutItem
    {
      public string id { get; set; } = null!;         // id tạm FE
      public string productId { get; set; } = null!;  // idSP: TS001, TP002...
      public string name { get; set; } = null!;
      public string size { get; set; } = "M";         // 'S' | 'M' | 'L'
      public int sugar { get; set; } = 100;
      public int ice { get; set; } = 100;
      public int quantity { get; set; } = 1;
      public decimal price { get; set; }              // giá 1 ly (đã gồm topping)
      public List<CheckoutTopping> toppings { get; set; } = new();
    }

    public class CheckoutRequest
    {
      public List<CheckoutItem> items { get; set; } = new();
      public string? customerPhone { get; set; }
      public string? promotionCode { get; set; }
      public string paymentMethod { get; set; } = "cash";  // cash | bank | ewallet
      public bool issuingInvoice { get; set; } = true;
      public string? staffId { get; set; }  // tạm: bạn có thể truyền idNV từ FE sau
    }

    [HttpPost("Checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
    {
      if (req.items == null || !req.items.Any())
        return BadRequest("Giỏ hàng rỗng!");

      // ===== 1. Xử lý khách hàng theo SĐT =====
      string? idKH = null;
      KhachHang? khach = null;

      if (!string.IsNullOrWhiteSpace(req.customerPhone))
      {
        var phone = req.customerPhone.Trim();

        var tk = await _context.TaiKhoan
            .FirstOrDefaultAsync(t =>
                t.sdt == phone &&
                t.vaiTro == vaiTroTaiKhoan.KhachHang &&
                !t.biKhoa);

        if (tk == null)
          return BadRequest("SĐT không tồn tại hoặc không phải khách hàng!");

        idKH = tk.idTK;
        khach = await _context.KhachHang.FindAsync(tk.idTK);
      }

      // ===== 2. Tính tiền giỏ hàng =====
      decimal subtotal = req.items.Sum(i => i.price * i.quantity);
      decimal tax = 0;
      decimal totalBeforeDiscount = subtotal;

      // ===== 3. Áp khuyến mãi =====
      decimal discount = 0m;
      string? idKM = null;

      if (!string.IsNullOrWhiteSpace(req.promotionCode))
      {
        var code = req.promotionCode.Trim().ToUpper();

        var km = await _context.KhuyenMai
            .FirstOrDefaultAsync(k => k.tenKhuyenMai == code);

        if (km == null)
          return BadRequest("Mã khuyến mãi không tồn tại!");

        var now = DateTime.Now;
        if (now < km.ngayBatDau || now > km.ngayKetThuc)
          return BadRequest("Mã khuyến mãi đã hết hiệu lực!");

        // phanTramGiam trong DB đang là 0.20, 0.15, ...
        discount = totalBeforeDiscount * km.phanTramGiam;
        idKM = km.idKM;
      }
      else if (khach != null)
      {
        // Không nhập mã thì giảm theo hạng (Đồng 2k, Bạc 3k, Vàng 4k, KimCương 6k)
        discount = khach.loaiKH switch
        {
          loaiKhachHang.Dong => 2000m,
          loaiKhachHang.Bac => 3000m,
          loaiKhachHang.Vang => 4000m,
          loaiKhachHang.KimCuong => 6000m,
          _ => 0m
        };
      }

      decimal total = totalBeforeDiscount - discount;
      if (total < 0) total = 0;

      // ===== 4. Sinh mã đơn DHxxx =====
      string newIdDH = await GenerateNewDonHangId();

      // ===== 5. Tạo DonHang =====
      var donHang = new DonHang
      {
        idDH = newIdDH,
        idKH = idKH,                               // null = khách lẻ
        idNV = req.staffId ?? "NV001",             // tạm cứng, sau này bạn sửa
        idKM = idKM,
        ngayDat = DateTime.Now,
        trangThai = trangThaiDonHang.DangChuanBi,    // thanh toán xong -> hoàn thành
        phuongThuc = MapPayment(req.paymentMethod),
        tinhTong = total,
        ghiChu = null
      };

      _context.DonHang.Add(donHang);
      await _context.SaveChangesAsync();

      // ===== 6. Lưu ChiTietDonHang (mỗi món 1 dòng) =====
      // 6. Lưu chi tiết đơn: nước + topping (mỗi cái 1 dòng)
      // ===== 6. Lưu ChiTietDonHang: nước + topping (mỗi thứ 1 dòng) =====
      foreach (var item in req.items)
      {
        if (string.IsNullOrWhiteSpace(item.productId))
          continue;

        // Giá nước = giá item - tổng tiền topping
        decimal toppingTotal = item.toppings?.Sum(t => t.price) ?? 0m;
        decimal drinkUnitPrice = item.price - toppingTotal;

        // Xử lý size
        var sizeEnum = sizeChiTietDonHang.M;
        var s = item.size?.Trim().ToUpper();
        if (s == "S") sizeEnum = sizeChiTietDonHang.S;
        if (s == "L") sizeEnum = sizeChiTietDonHang.L;

        // ---------- dòng NƯỚC ----------
        var drink = new ChiTietDonHang
        {
          idDH = newIdDH,
          idSP = item.productId,
          soLuong = item.quantity,
          donGia = drinkUnitPrice,
          size = sizeEnum,
          duong = item.sugar,
          da = item.ice
        };
        _context.ChiTietDonHang.Add(drink);

        // ---------- dòng TOPPING ----------
        if (item.toppings != null)
        {
          foreach (var tp in item.toppings)
          {
            // tp.id = idSP thật vì FE lấy từ bảng SanPham
            var toppingSP = await _context.SanPham.FindAsync(tp.id);
            if (toppingSP == null) continue;

            var t = new ChiTietDonHang
            {
              idDH = newIdDH,
              idSP = toppingSP.idSP,     // mã TP00x trong DB
              soLuong = item.quantity,   // topping đi theo nước
              donGia = toppingSP.giaSP,  // dùng giá trong DB

              // Topping không có size/đường/đá → phải gán giá trị hợp lệ
              size = sizeChiTietDonHang.M,
              duong = 0,
              da = 0
            };

            _context.ChiTietDonHang.Add(t);
          }
        }
      }

      await _context.SaveChangesAsync();

      // ===== 7. Tạo Hóa đơn ngay khi thanh toán =====
      var hoaDon = new HoaDon
      {
        maHD = Guid.NewGuid().ToString(),   // giống HoaDonController đang làm :contentReference[oaicite:8]{index=8}
        idDonHang = newIdDH,
        phuongThuc = donHang.phuongThuc,
        soTien = total,
        ngay = DateTime.Now
      };

      _context.HoaDon.Add(hoaDon);
      await _context.SaveChangesAsync();

      // ===== 8. Trừ kho theo định lượng + tạo phiếu xuất =====
      await ConsumeIngredientsAndCreatePhieuXuat(newIdDH);

      // ===== 9. Trả kết quả cho FE =====
      return Ok(new
      {
        idDH = newIdDH,
        subtotal,
        tax,
        discount,
        total
      });
    }

    // ========== HELPER ==========

    private async Task<string> GenerateNewDonHangId()
    {
      var last = await _context.DonHang
          .OrderByDescending(d => d.idDH)
          .Select(d => d.idDH)
          .FirstOrDefaultAsync();

      if (string.IsNullOrEmpty(last))
        return "DH001";

      // format: DHxxx
      var numPart = int.Parse(last.Substring(2));
      return "DH" + (numPart + 1).ToString("D3");
    }

    private phuongThucThanhToan MapPayment(string method)
    {
      return method switch
      {
        "bank" => phuongThucThanhToan.NganHang,
        "ewallet" => phuongThucThanhToan.ViDienTu,
        _ => phuongThucThanhToan.TienMat
      };
    }

    /// <summary>
    /// Dùng bảng dinhluongcongthuc để trừ KhoNL + tạo phiếu kho loại Xuất
    /// </summary>
    private async Task ConsumeIngredientsAndCreatePhieuXuat(string idDH)
    {
      // 1. Lấy toàn bộ chi tiết đơn
      var details = await _context.ChiTietDonHang
          .Where(c => c.idDH == idDH)
          .ToListAsync();

      if (!details.Any()) return;

      // 2. Gom tổng tiêu hao theo idNL (float)
      var usage = new Dictionary<string, float>();

      foreach (var ct in details)
      {
        var dinhLuongs = await _context.Set<DinhLuongCongThuc>()
            .Where(d => d.idSP == ct.idSP)
            .ToListAsync();

        foreach (var dl in dinhLuongs)
        {
          float amount = dl.soLuongTieuHao * ct.soLuong; // float * int

          if (!usage.ContainsKey(dl.idNL!))
            usage[dl.idNL!] = 0f;

          usage[dl.idNL!] += amount;
        }
      }

      if (!usage.Any()) return;

      // 3. Với mỗi nguyên liệu: TRỪ KHO + tạo phiếu XUẤT
      foreach (var pair in usage)
      {
        string idNL = pair.Key;
        float soLuongTieuHao = pair.Value;  // float

        var nl = await _context.NguyenLieu.FindAsync(idNL);
        if (nl == null) continue;

        // Trừ tồn kho (float → float)
        nl.soLuongTon -= soLuongTieuHao;
        if (nl.soLuongTon < 0) nl.soLuongTon = 0;

        // Phiếu kho yêu cầu số lượng int → làm tròn lên
        int soLuongPhieu = (int)Math.Ceiling(soLuongTieuHao);

        var phieu = new PhieuKho
        {
          idPhieu = "PK" + DateTime.Now.Ticks,
          idNL = idNL,
          idNCC = null,
          soLuong = soLuongPhieu,
          ngay = DateTime.Now,
          loaiPhieu = loaiPhieuKho.Xuat,
          ghiChu = $"Xuất NL pha món ĐH {idDH}"
        };

        _context.PhieuKho.Add(phieu);
      }

      await _context.SaveChangesAsync();
    }
  }
}
