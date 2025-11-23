using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("nhanvien")]
    public class NhanVien : TaiKhoan
    {
        [Column("chucVu")]
        public string? chucVu { get; set; }

        [Column("caLam")]
        public string? caLam { get; set; }

        [Column("soCa")]
        public int soCa { get; set; }

        [Column("phuCap")]
        public decimal phuCap { get; set; }

        [Column("tongLuong")]
        public decimal tongLuong { get; set; }
    }
}
