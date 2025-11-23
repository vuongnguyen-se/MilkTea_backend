using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
  public class NhapKhoRequest
  {
    public string? idNCC { get; set; }       // nhà cung cấp
    public string? ghiChu { get; set; }      // ghi chú chung

    public List<NhapKhoItem>? items { get; set; }
  }

  public class NhapKhoItem
  {
    public string? idNL { get; set; }        // nguyên liệu
    public int soLuong { get; set; }        // số lượng nhập
    public DateTime hanSuDung { get; set; }
  }
}
