using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("nhanvien")]
    public class NhanVien
    {
        [Key]
        [Column("idTK")]
        public string? idTK { get; set; }

        [Column("chucVu")]
        public string? chucVu { get; set; }

        [Column("caLam")]
        public string? caLam { get; set; }

        [Column("luong")]
        public decimal luong { get; set; }
    }
}
