using backend.SingleClass;
using Microsoft.EntityFrameworkCore;
using Enum = System.Enum;

namespace backend.Models
{
    public class SanPhamDBContext : DbContext
    {
        public SanPhamDBContext(DbContextOptions<SanPhamDBContext> options) : base(options)
        {
            
        }

        public DbSet<SanPham> SanPham { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SanPham>().ToTable("sanpham");

            modelBuilder.Entity<SanPham>()
                .Property(p => p.loaiSP)
                .HasConversion(
                    conversion => conversion.ToString(),
                    // casting conversion from string to enum 'loaiSanPham'.
                    conversion => (SingleClass.Enum.loaiSanPham)Enum.Parse(typeof(SingleClass.Enum.loaiSanPham),conversion)
                    );
            // No boolean in Mysql, casting to tinyint
            modelBuilder.Entity<SanPham>()
                .Property(p => p.tinhtrang)
                .HasColumnType("tinyint(1)");
        }
    }
}
