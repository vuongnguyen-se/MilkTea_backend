using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static backend.SingleClass.Enum;

namespace backend.SingleClass
{
    [Table("khachhang")]
    public class KhachHang: TaiKhoan
    {
        [Column("diemTichLuy")]
        public int diemTichLuy { get; set; }

        [Column("loaiKH")]
        public loaiKhachHang loaiKH { get; set; }
    }
}