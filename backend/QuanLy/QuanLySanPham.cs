using backend.SingleClass;

namespace backend.Models
{
    public class QuanLySanPham : IQuanLy<SanPham>
    {
        public List<SanPham> _ListSanPham { get; set; }

        public QuanLySanPham(List<SanPham> ListSanPham)
        {
            _ListSanPham = ListSanPham;
        }

        public void Them(SanPham newProduct)
        {
            _ListSanPham.Add(newProduct);
        }

        public void Sua(int idSanPham, SanPham product)
        {

        }

        public void Xoa(int idSanPham)
        {

        }

        public SanPham TimKiem(int idSanPham)
        {
            return new SanPham();
        }
    }
}
