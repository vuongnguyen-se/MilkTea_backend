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

    // ==========================================
    // DTO
    // ==========================================
    public class CheckoutTopping
    {
      public string? id { get; set; }
      public string? name { get; set; }
      public decimal price { get; set; }
    }

    public class CheckoutItem
    {
      public string id { get; set; } = null!;
      public string productId { get; set; } = null!;
      public string name { get; set; } = null!;
      public string size { get; set; } = "M";
      public int sugar { get; set; } = 100;
      public int ice { get; set; } = 100;
      public int quantity { get; set; } = 1;
      public decimal price { get; set; }
      public List<CheckoutTopping> toppings { get; set; } = new();
    }

    public class CheckoutRequest
    {
      public List<CheckoutItem> items { get; set; } = new();
      public string? customerPhone { get; set; }
      public string? promotionCode { get; set; }
      public string paymentMethod { get; set; } = "cash";
      public bool issuingInvoice { get; set; } = true;
      public string? staffId { get; set; }
    }

    // ==========================================
    // CHECKOUT
    // ==========================================
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

      // ===== 2. Tính tiền =====
      decimal subtotal = req.items.Sum(i => i.price * i.quantity);
      decimal tax = 0;
      decimal totalBeforeDiscount = subtotal;

      // ===== 3. Khuyến mãi =====
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
          return BadRequest("Mã khuyến mãi đã hết hạn!");

        discount = totalBeforeDiscount * km.phanTramGiam;
        idKM = km.idKM;
      }
      else if (khach != null)
      {
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

      // ==========================================
      // 🔥 4. KIỂM TRA TỒN KHO TRƯỚC KHI TẠO ĐƠN
      // ==========================================
      foreach (var item in req.items)
      {
        var congThuc = await _context.DinhLuongCongThuc
            .Where(x => x.idSP == item.productId)
            .ToListAsync();

        foreach (var ct in congThuc)
        {
          float required = ct.soLuongTieuHao * item.quantity;

          var nl = await _context.NguyenLieu.FindAsync(ct.idNL);
          if (nl == null)
            return BadRequest($"Không tìm thấy nguyên liệu {ct.idNL}");

          if (nl.soLuongTon < required)
          {
            return BadRequest(
              $"Nguyên liệu '{nl.tenNL}' không đủ! Còn {nl.soLuongTon} {nl.donVi}, " +
              $"cần {required} {nl.donVi} để pha {item.quantity} ly."
            );
          }
        }
      }

      // ==========================================
      // 5. Tạo đơn hàng
      // ==========================================
      string newIdDH = await GenerateNewDonHangId();

      var donHang = new DonHang
      {
        idDH = newIdDH,
        idKH = idKH,
        idNV = req.staffId ?? "NV001",
        idKM = idKM,
        ngayDat = DateTime.Now,
        trangThai = trangThaiDonHang.ChoXacNhan,
        phuongThuc = MapPayment(req.paymentMethod),
        tinhTong = total,
        ghiChu = null
      };

      _context.DonHang.Add(donHang);
      await _context.SaveChangesAsync();

      // ==========================================
      // 6. ChiTietDonHang (nước + topping)
      // ==========================================
      foreach (var item in req.items)
      {
        if (string.IsNullOrWhiteSpace(item.productId))
          continue;

        decimal toppingTotal = item.toppings?.Sum(t => t.price) ?? 0m;
        decimal drinkUnitPrice = item.price - toppingTotal;

        // size enum
        var sizeEnum = sizeChiTietDonHang.M;
        var s = item.size?.Trim().ToUpper();
        if (s == "S") sizeEnum = sizeChiTietDonHang.S;
        if (s == "L") sizeEnum = sizeChiTietDonHang.L;

        // nước
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

        // topping
        if (item.toppings != null)
        {
          foreach (var tp in item.toppings)
          {
            var toppingSP = await _context.SanPham.FindAsync(tp.id);
            if (toppingSP == null) continue;

            var t = new ChiTietDonHang
            {
              idDH = newIdDH,
              idSP = toppingSP.idSP,
              soLuong = item.quantity,
              donGia = toppingSP.giaSP,
              size = sizeChiTietDonHang.M,
              duong = 0,
              da = 0
            };

            _context.ChiTietDonHang.Add(t);
          }
        }
      }

      await _context.SaveChangesAsync();

      // ==========================================
      // 7. Tạo hóa đơn
      // ==========================================
      var hoaDon = new HoaDon
      {
        maHD = Guid.NewGuid().ToString(),
        idDonHang = newIdDH,
        phuongThuc = donHang.phuongThuc,
        soTien = total,
        ngay = DateTime.Now
      };

      _context.HoaDon.Add(hoaDon);
      await _context.SaveChangesAsync();

      // ==========================================
      // 8. TRỪ KHO + Phiếu xuất đúng số lượng float
      // ==========================================
      await ConsumeIngredientsAndCreatePhieuXuat(newIdDH);

      // ==========================================
      // 9. Trả về FE
      // ==========================================
      return Ok(new
      {
        idDH = newIdDH,
        subtotal,
        tax,
        discount,
        total
      });
    }

    // ==================================================================
    // HELPER: Sinh mã đơn
    // ==================================================================
    private async Task<string> GenerateNewDonHangId()
    {
      var last = await _context.DonHang
          .OrderByDescending(d => d.idDH)
          .Select(d => d.idDH)
          .FirstOrDefaultAsync();

      if (string.IsNullOrEmpty(last))
        return "DH001";

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

    // ==================================================================
    // TRỪ KHO + PHIẾU XUẤT (DÙNG FLOAT)
    // ==================================================================
    private async Task ConsumeIngredientsAndCreatePhieuXuat(string idDH)
    {
      var details = await _context.ChiTietDonHang
          .Where(c => c.idDH == idDH)
          .ToListAsync();

      if (!details.Any()) return;

      var usage = new Dictionary<string, float>();

      foreach (var ct in details)
      {
        var dinhLuongs = await _context.DinhLuongCongThuc
            .Where(d => d.idSP == ct.idSP)
            .ToListAsync();

        foreach (var dl in dinhLuongs)
        {
          float amount = dl.soLuongTieuHao * ct.soLuong;

          if (!usage.ContainsKey(dl.idNL!))
            usage[dl.idNL!] = 0;

          usage[dl.idNL!] += amount;
        }
      }

      foreach (var pair in usage)
      {
        string idNL = pair.Key;
        float used = pair.Value;

        var nl = await _context.NguyenLieu.FindAsync(idNL);
        if (nl == null) continue;

        nl.soLuongTon -= used;
        if (nl.soLuongTon < 0) nl.soLuongTon = 0;

        var phieu = new PhieuKho
        {
          idPhieu = "PK" + DateTime.Now.Ticks,
          idNL = idNL,
          idNCC = null,
          soLuong = used,       // float, chuẩn
          ngay = DateTime.Now,
          loaiPhieu = loaiPhieuKho.Xuat,
          ghiChu = $"Xuất NL pha ĐH {idDH}"
        };

        _context.PhieuKho.Add(phieu);
      }

      await _context.SaveChangesAsync();
    }
  }
}
