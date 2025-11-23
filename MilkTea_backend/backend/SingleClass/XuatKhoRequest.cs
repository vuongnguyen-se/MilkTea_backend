using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
  public class XuatKhoRequest
  {
    public string? idNL { get; set; }        // nguyên liệu
    public int soLuong { get; set; }        // số lượng xuất
    public string? ghiChu { get; set; }      // ghi chú
  }
}
