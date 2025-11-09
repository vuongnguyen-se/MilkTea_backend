using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("ChiTietDonHang")]
    public class ChiTietDonHang
    {
        [Key]
        [Column("idChiTiet")]
        public int idChiTiet { get; set; }

        [Column("idDonHang")]
        public string idDH { get; set; } = null!;

        [Column("idSP")]
        public string idSP { get; set; } = null!;

        [Column("SoLuong")]
        public int soLuong { get; set; }

        [Column("donGia")]
        public decimal donGia { get; set; }

        [Column("size")]
        public string? size { get; set; }

        [Column("duong")]
        public int duong { get; set; }

        [Column("da")]
        public int da { get; set; }
    }
}
