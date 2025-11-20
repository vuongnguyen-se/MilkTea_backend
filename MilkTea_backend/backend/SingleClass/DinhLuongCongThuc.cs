using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("dinhluongcongthuc")]
    public class DinhLuongCongThuc
    {
        [Column("idSP")]
        public string? idSP { get; set; }
        [Column("idNL")]
        public string? idNL { get; set; }
        [Column("soLuongTieuHao")]
        public decimal soLuongTieuHao { get; set; }
        [Column("donVi")]
        public string? donVi { get; set; }
    }
}
