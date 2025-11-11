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
        public DbSet<KhachHang> KhachHang { get; set; }
        public DbSet<KhuyenMai> KhuyenMai { get; set; }
        public DbSet<NhanVien> NhanVien { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {   
            // matching SanPham properties to sanpham fields.
            modelBuilder.Entity<SanPham>().ToTable("sanpham");
                // casting conversion from string to enum 'loaiSanPham'.
            modelBuilder.Entity<SanPham>()
                .Property(p => p.loaiSP)
                .HasConversion(
                    conversion => conversion.ToString(),
                    conversion => (SingleClass.Enum.loaiSanPham)Enum.Parse(typeof(SingleClass.Enum.loaiSanPham),conversion)
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
        }
    }
}
