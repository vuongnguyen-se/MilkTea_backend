using backend.Models;
using backend.SingleClass;
using Microsoft.EntityFrameworkCore;
using Enum = System.Enum;

namespace backend.Models
{
    public class MilkTeaDBContext : DbContext
    {
        public MilkTeaDBContext(DbContextOptions<MilkTeaDBContext> options) : base(options)
        {

        }
        public DbSet<SanPham> SanPham { get; set; }
        public DbSet<DonHang> DonHang { get; set; }
        public DbSet<TaiKhoan> TaiKhoan { get; set; }
        public DbSet<NhanVien> NhanVien { get; set; }
        public DbSet<KhachHang> KhachHang { get; set; }
        public DbSet<KhuyenMai> KhuyenMai { get; set; }
        public DbSet<HoaDon> HoaDon { get; set; }
        public DbSet<NhaCungCap> NhaCungCap { get; set; }
        public DbSet<NguyenLieu> NguyenLieu { get; set; }
        public DbSet<PhieuKho> PhieuKho { get; set; }
        public DbSet<ChiTietDonHang> ChiTietDonHang { get; set; }
        public DbSet<CungCapNguyenLieu> CungCapNguyenLieu { get; set; }
        public DbSet<DinhLuongCongThuc> DinhLuongCongThuc { get; set; }


        // config for mysql data type.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // matching SanPham properties to sanpham fields.
            modelBuilder.Entity<SanPham>().ToTable("sanpham");
            // casting conversion from string to enum 'loaiSanPham'.
            modelBuilder.Entity<SanPham>()
                .Property(p => p.loaiSP)
                .HasConversion(
                    conversion => conversion.ToString(),
                    conversion => (SingleClass.Enum.loaiSanPham)Enum.Parse(typeof(SingleClass.Enum.loaiSanPham), conversion)
                    );
            // No boolean in Mysql, casting to tinyint
            modelBuilder.Entity<SanPham>()
                .Property(p => p.tinhtrang)
                .HasColumnType("tinyint(1)");

            // matching DonHang properties to donhang fields.
            modelBuilder.Entity<DonHang>().ToTable("donhang");
            modelBuilder.Entity<DonHang>()
                .Property(p => p.trangThai)
                .HasConversion(
                    c => c.ToString(),
                    c => (SingleClass.Enum.trangThaiDonHang)Enum.Parse(typeof(SingleClass.Enum.trangThaiDonHang), c));
            //.HasColumnType("varchar(50)");
            modelBuilder.Entity<DonHang>()
                .Property(p => p.phuongThuc)
                .HasConversion(
                    c => c.ToString(),
                    c => (SingleClass.Enum.phuongThucThanhToan)Enum.Parse(typeof(SingleClass.Enum.phuongThucThanhToan), c));

            // matching KhachHang properties to khachhang fields.
            modelBuilder.Entity<KhachHang>().ToTable("khachhang");
            modelBuilder.Entity<KhachHang>()
                .Property(p => p.loaiKH)
                .HasConversion(
                    c => c.ToString(),
                    c => (SingleClass.Enum.loaiKhachHang)Enum.Parse(typeof(SingleClass.Enum.loaiKhachHang), c)
                    );

            // matching TaiKhoan properties to taikhoan fields.
            modelBuilder.Entity<TaiKhoan>().ToTable("taikhoan");
            modelBuilder.Entity<TaiKhoan>()
                .Property(p => p.vaiTro)
                .HasConversion(
                    c => c.ToString(),
                    c => (SingleClass.Enum.vaiTroTaiKhoan)Enum.Parse(typeof(SingleClass.Enum.vaiTroTaiKhoan), c)
                );
            modelBuilder.Entity<TaiKhoan>()
                .Property(p => p.biKhoa)
                .HasColumnType("tinyint(1)");

            // matching HoaDon properties to hoadon fields.
            modelBuilder.Entity<HoaDon>().ToTable("hoadon");
            modelBuilder.Entity<HoaDon>()
                .Property(p => p.phuongThuc)
                .HasConversion(
                    c => c.ToString(),
                    c => (SingleClass.Enum.phuongThucThanhToan)Enum.Parse(typeof(SingleClass.Enum.phuongThucThanhToan), c)
                );

            // matching PhieuKho properties to phieukho fields.
            modelBuilder.Entity<PhieuKho>().ToTable("phieukho");
            modelBuilder.Entity<PhieuKho>()
                .Property(p => p.loaiPhieu)
                .HasConversion(
                    c => c.ToString(),
                    c => (SingleClass.Enum.loaiPhieuKho)Enum.Parse(typeof(SingleClass.Enum.loaiPhieuKho), c)
                );

            // matching ChiTietDonHang properties to chitietdonhang fields.
            modelBuilder.Entity<ChiTietDonHang>().ToTable("chitietdonhang");
            modelBuilder.Entity<ChiTietDonHang>()
                .Property(p => p.size)
                .HasConversion(
                    c => c.ToString(),
                    c => (SingleClass.Enum.sizeChiTietDonHang)Enum.Parse(typeof(SingleClass.Enum.sizeChiTietDonHang), c)
                );
            modelBuilder.Entity<CungCapNguyenLieu>().HasNoKey();
            modelBuilder.Entity<DinhLuongCongThuc>().ToTable("dinhluongcongthuc");
            modelBuilder.Entity<DinhLuongCongThuc>().HasNoKey();
        }
    }
}
