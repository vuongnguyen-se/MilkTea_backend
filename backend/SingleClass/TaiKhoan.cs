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
        public string? dChi { get; set; }
        [Column("soDienThoai")]
        public string? sdt { get; set; }
        [Column("tenDangNhap")]
        public string? tenDN { get; set; }
        [Column("matKhau")] 
        public string? mKhau { get; set; }
        [Column("vaiTro")]
        public vaiTroTK vaiTro { get; set; }
        [Column("biKhoa")]
        public bool biKhoa { get; set; }
    }
}
