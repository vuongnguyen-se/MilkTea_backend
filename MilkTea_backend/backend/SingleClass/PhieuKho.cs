using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static backend.SingleClass.Enum;

namespace backend.SingleClass
{
    [Table("phieukho")]
    public class PhieuKho
    {
        [Key]
        [Column("idPhieu")]
        public string? idPhieu { get; set; }

        [Column("idNL")]
        public string? idNL { get; set; }

        [Column("idNCC")]
        public string? idNCC { get; set; }

        [Column("soLuong")]
        public float soLuong { get; set; }

        [Column("ngay")]
        public DateTime ngay { get; set; }

        [Column("loaiPhieu")]
        public loaiPhieuKho loaiPhieu { get; set; }

        [Column("ghiChu")]
        public string? ghiChu { get; set; }

        // Navigation properties
        [ForeignKey("idNL")]
        public NguyenLieu? NguyenLieu { get; set; }

        [ForeignKey("idNCC")]
        public NhaCungCap? NhaCungCap { get; set; }
    }
}