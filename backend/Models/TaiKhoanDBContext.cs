using backend.Models;
using backend.SingleClass;
using Microsoft.EntityFrameworkCore;
using Enum = System.Enum;

namespace backend.Models
{
    public class TaiKhoanDBContext : DbContext
    {
        public TaiKhoanDBContext(DbContextOptions<TaiKhoanDBContext> options) : base(options)
        {

        }

        public DbSet<TaiKhoan> TaiKhoan { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaiKhoan>().ToTable("taikhoan");

            modelBuilder.Entity<TaiKhoan>()
                .Property(p => p.vaiTro)
                .HasConversion(
                    conversion => conversion.ToString(),
                    // casting conversion from string to enum 'loaiTaiKhoan'.
                    conversion => (SingleClass.Enum.vaiTroTK)Enum.Parse(typeof(SingleClass.Enum.vaiTroTK), conversion)
                );

            // No boolean in Mysql, casting to tinyint
            modelBuilder.Entity<TaiKhoan>()
                .Property(p => p.biKhoa)
                .HasColumnType("tinyint(1)");
        }
    }
}