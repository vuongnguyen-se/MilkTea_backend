using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("nguyenlieu")]
    public class NguyenLieu
    {
        [Key]
        [Column("idNL")]
        public string? idNL { get; set; }
        [Column("tenNL")]
        public string? tenNL { get; set; }
        [Column("soLuongTon")]
        public float soLuongTon { get; set; }
        [Column("donVi")]
        public string? donVi { get; set; }
        [Column("hanSuDung")]
        public DateTime hanSuDung { get; set; }
    }
}
