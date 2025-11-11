namespace backend.SingleClass
{
    public class Enum
    {
        // Enum DonHang
        public enum trangThaiDonHang
        {
            ChoXacNhan,
            DangChuanBi,
            HoanThanh,
            DaHuy
        }

        // Enum SanPham
        public enum loaiSanPham
        {
            Topping, 
            ThucUong
        }

        // Enum KhachHang
        public enum loaiKhachHang
        {
            Dong,
            Bac, 
            Vang, 
            KimCuong
        }

        // Enum TaiKhoan
        public enum vaiTroTaiKhoan
        {
            QuanLy,
            NhanVien,
            KhachHang
        }
    }
}
