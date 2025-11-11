using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("khuyenmai")]
    public class KhuyenMai
    {
        [Key]
        [Column("idKM")]
        public string? idKH { get; set; }

        [Column("tenKM")]
        public string? tenKH { get; set; }

        [Column("phanTramGiam")]
        public decimal phanTramGiam { get; set; }

        [Column("ngayBatDau")]
        public DateTime ngayBatDau { get; set; }

        [Column("ngayKetThuc")]
        public DateTime ngayKetThuc { get; set; }
    }
}
