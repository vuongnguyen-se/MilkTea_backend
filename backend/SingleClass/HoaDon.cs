using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static backend.SingleClass.Enum;

namespace backend.SingleClass
{
    [Table("hoadon")]
    public class HoaDon
    {
        [Key]
        [Column("maHD")]    
        public string? maHD { get; set; }
        [Column("idDonHang")]
        public string? idDonHang { get; set; }
        [Column("phuongThuc")]
        public phuongThucThanhToan phuongThuc { get; set; }
        [Column("soTien")]
        public decimal soTien { get; set; }
        [Column("ngay")]
        public DateTime ngay { get; set; }

    }
}
