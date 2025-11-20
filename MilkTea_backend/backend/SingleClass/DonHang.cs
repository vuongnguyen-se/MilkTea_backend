using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static backend.SingleClass.Enum;

namespace backend.SingleClass
{
    [Table("donhang")]
    public class DonHang
    {
        [Key]
        [Column("idDH")]
        public string? idDH { get; set; }

        // foreign key KhachHang
        [Column("idKH")]
        public string? idKH { get; set; }
        [ForeignKey("idKH")]
        public KhachHang? KhachHang { get; set; }

        // foreign key NhanVien
        [Column("idNV")]
        public string? idNV { get; set; }
        [ForeignKey("idNV")]
        public NhanVien? NhanVien { get; set; }

        // foreign key KhuyenMai
        [Column("idKM")]
        public string? idKM { get; set; }
        [ForeignKey("idKM")]
        public KhuyenMai? KhuyenMai { get; set; }

        // Other DonHang's properties.
        [Column("ngayDat")]
        public DateTime ngayDat { get; set; }

        [Column("trangThai")]
        public trangThaiDonHang trangThai { get; set; }

        [Column("phuongThuc")]
        public phuongThucThanhToan phuongThuc { get; set; }

        [Column("tongTien")]
        public decimal tinhTong { get; set; }

        [Column("ghiChu")]
        public string? ghiChu { get; set; }

    }
}