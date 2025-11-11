using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("taikhoan")]
    public class TaiKhoan
    {
        [Key]
        [Column("idTK")]
        public string? idTK { get; set; }

        [Column("tenTK")]
        public string? tenTK { get; set; }

        [Column("diaChi")]
        public string? diaChi { get; set; }

        [Column("soDienThoai")]
        public string? soDienThoai { get; set; }

        [Column("tenDangNhap")]
        public string? tenDangNhap { get; set; }

        [Column("vaiTro")]
        public Enum.vaiTroTaiKhoan vaiTro { get; set; }

        [Column("biKhoa")]
        public bool biKhoa { get; set; }
    }
}
