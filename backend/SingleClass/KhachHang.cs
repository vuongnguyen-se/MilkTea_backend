using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("khachhang")]
    public class KhachHang: TaiKhoan
    {
        [Column("diemTichLuy")]
        public int DiemTichLuy { get; set; }

        [Column("loaiKH")]
        public string? loaiKH { get; set; }
    }
}
