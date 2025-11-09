using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    [Table("cungcap_nguyenlieu")]
    public class CungCapNguyenLieu
    {
        [Column("idNCC")]
        public string? idNCC { get; set; }
        [Column("idNL")]
        public string? idNL { get; set; }
    }
}
