using backend.SingleClass;

namespace backend.Models
{
    public class QuanLyDonHang
    {
        private readonly List<DonHang> _ListDonHang;

        public QuanLyDonHang(List<DonHang> ListDonHang)
        {
            _ListDonHang = ListDonHang;
        }

        public decimal BaoCaoDoanhThu(DateTime startDate, DateTime endDate)
        {
            var tongDoanhThu = _ListDonHang
                .Where(donhang => donhang.ngayDat >= startDate && donhang.ngayDat <= endDate)
                .Sum(donhang => donhang.tinhTong);

            return tongDoanhThu;
        }
    }
}
