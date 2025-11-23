using backend.SingleClass;

namespace backend.QuanLy
{
    public class TonKhoDTO
    {
        public string? idNL { get; set; }
        public string? nameNL { get; set; }
        public float TongTonKho { get; set; }

    }
    public enum LoaiTonKho
    {
        TopTonKhoNhieu,
        TopTonKhoIt
    }
    public class QuanLyTonKho
    {
        private readonly List<NguyenLieu> _listNguyenLieu;

        public QuanLyTonKho(List<NguyenLieu> listNguyenLieu)
        {
            _listNguyenLieu = listNguyenLieu;
        }

        public List<TonKhoDTO> BaoCaoTonKho(int topTonKho, LoaiTonKho loai)
        {
            // Retrieve soLuongTon values from NguyenLieu list.
            var tonKhoQuery = _listNguyenLieu
                .GroupBy(nl => nl.idNL)
                .Select(nl => new
                {
                    idNL = nl.Key,
                    TongSoTon = nl.Sum(x => x.soLuongTon)
                });

            if (loai == LoaiTonKho.TopTonKhoNhieu)
            {
                tonKhoQuery = tonKhoQuery
                    .OrderByDescending(x => x.TongSoTon)
                    .Take(topTonKho);

            }
            else
            {
                tonKhoQuery = tonKhoQuery
                    .OrderBy(x => x.TongSoTon)
                    .Take(topTonKho);

            }

            // Join with nguyenlieu table to retrieve nguyenlieu name.
            var result = tonKhoQuery
                .Join(_listNguyenLieu,
                    tonkho => tonkho.idNL,
                    nguyenlieu => nguyenlieu.idNL,
                    (tonkho, nguyenlieu) => new TonKhoDTO
                    {
                        idNL = nguyenlieu.idNL,
                        nameNL = nguyenlieu.tenNL,
                        TongTonKho = tonkho.TongSoTon
                    })
                .ToList();

            return result;
        }
    }
}
