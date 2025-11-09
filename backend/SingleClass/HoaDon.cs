using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("hoadon")]
    public class HoaDon
    {
        [Key]
        [Column("maDH")]    
        public string? maDH { get; set; }
        [Column("idDonHang")]
        public string? idDonHang { get; set; }
        [Column("phuongThuc")]
        public string? phuongThuc { get; set; }
        [Column("soTien")]
        public decimal soTien { get; set; }
        [Column("ngay")]
        public DateTime ngay { get; set; }

    }
}
