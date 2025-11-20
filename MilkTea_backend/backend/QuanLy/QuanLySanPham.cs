using backend.SingleClass;

namespace backend.Models
{
    public class ThongKeSanPhamDTO
    {
        public string? idSP { get; set; }
        public string? tenSP { get; set; }
        public int TongSoLuong { get; set; }
    }

    public class QuanLySanPham
    {
        private readonly List<SanPham> _ListSanPham;
        private readonly List<ChiTietDonHang> _ListCTDH;

        public QuanLySanPham(List<SanPham> ListSanPham)
        {
            _ListSanPham = ListSanPham;
            _ListCTDH = new List<ChiTietDonHang>();
        }

        public QuanLySanPham(List<SanPham> ListSanPham, List<ChiTietDonHang> ListCTDH)
        {
            _ListSanPham = ListSanPham;
            _ListCTDH = ListCTDH;
        }

        public List<ThongKeSanPhamDTO> BaoCaoSanPhamBanChay(int soLuongBanChay)
        {   
            // retrieve the top SanPhamBanChay by given number soLuongBanChay.
            var sanPhamBanChayQuery = _ListCTDH
                .GroupBy(ctdh => ctdh.idSP)
                .Select(ctdh => new
                {
                    idSP = ctdh.Key,
                    TongSoLuong = ctdh.Sum(x => x.soLuong)
                })
                .OrderByDescending(x => x.TongSoLuong)
                .Take(soLuongBanChay)
                .ToList();

            // join with SanPham table to collect SanPham's name.
            var thongtinSanPhamBanChay = sanPhamBanChayQuery
                .Join(_ListSanPham,
                    spBanChay => spBanChay.idSP,
                    sp => sp.idSP,
                    (spBanChay, sp) => new ThongKeSanPhamDTO
                    {
                        idSP = sp.idSP,
                        tenSP = sp.tenSP,
                        TongSoLuong = spBanChay.TongSoLuong
                    })
                .ToList();

            return thongtinSanPhamBanChay;
        }

    }
}
