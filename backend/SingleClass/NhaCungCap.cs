using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("nhacungcap")]
    public class NhaCungCap
    {
        [Key]
        [Column("idNCC")]
        public string? idNCC { get; set; }
        [Column("tenNCC")]
        public string? tenNCC { get; set; }
        [Column("soDienThoai")]
        public string? soDienThoai { get; set; }
        [Column("diaChi")]
        public string? diaChi { get; set; }
        [Column("email")]
        public string? email { get; set; }

    }
}
