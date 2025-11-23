using System.ComponentModel.DataAnnotations.Schema;

namespace backend.SingleClass
{
    public class CungCapNguyenLieu
    {
        public string? idNCC { get; set; }
        public string? idNL { get; set; }
        public NguyenLieu NguyenLieu { get; set; }

    }

}
