using backend.SingleClass;

namespace backend.QuanLy
{
    public class QuanLyBaoCao<signleClassT>
    {
        //public List<DonHang> _ListDonHang { get; set; }
        //public List<SanPham> _ListSanPham { get; set; }

        public IList<signleClassT> _listSingleClass { get; set; }

        public QuanLyBaoCao(List<signleClassT> listSingleClass)
        {
            _listSingleClass = listSingleClass;
        }

        //public decimal BaoCaoDoanhThu(DateTime startDate, DateTime endDate)
        //{   
        //    var tongDoanhThu = _listSingleClass
        //        .Where(donhang => donhang.ngayDat >= startDate && donhang.ngayDat <= endDate)
        //        .Sum(donhang => donhang.tinhTong);

        //    return tongDoanhThu;
        //}
    }
}
