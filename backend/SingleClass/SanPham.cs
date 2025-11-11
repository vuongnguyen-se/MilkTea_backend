using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static backend.SingleClass.Enum;

namespace backend.SingleClass
{
    [Table("sanpham")]
    public class SanPham
    {
        [Key]
        [Column("idSP")]
        public string? idSP { get; set; }

        [Column("tenSP")]
        public string? tenSP { get; set; }

        [Column("giaSP")]
        public decimal giaSP { get; set; }

        [Column("loaiSP")]
        public loaiSanPham loaiSP { get; set; }

        [Column("mota")]
        public string? mota { get; set; }

        [Column("tinhtrang")]
        public bool tinhtrang { get; set; }
    }
}
