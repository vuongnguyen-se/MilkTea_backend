using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static backend.SingleClass.Enum;


namespace backend.SingleClass
{
    [Table("taikhoan")]
    public class TaiKhoan
    {
        [Key]
        [Column("idTK")]
        public string? idTK { get; set; }
        [Column("tenTk")]
        public string? tenTK { get; set; }
        [Column("diaChi")]
        public string? diaChi { get; set; }
        [Column("soDienThoai")]
        public string? soDienThoai { get; set; }
        [Column("tenDangNhap")]
        public string? tenDangNhap { get; set; }
        [Column("matKhau")]
        public string? matKhau { get; set; }
        [Column("vaiTro")]
        public vaiTroTK vaiTro { get; set; }
        [Column("biKhoa")]
        public trangThaiTK biKhoa { get; set; }
    }
}
