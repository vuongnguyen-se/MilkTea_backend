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
        // Enum TaiKhoan
        public enum vaiTroTaiKhoan
        {
            KhachHang,
            NhanVien,
            QuanLy
        }
        // Enum KhachHang
        public enum loaiKhachHang
        {
            Dong,
            Bac,
            Vang,
            KimCuong
        }
        // Enum phuongThucThanhToan
        public enum phuongThucThanhToan
        {
            TienMat,
            NganHang,
            ViDienTu
        }
        // Enum loaiPhieuKho
        public enum loaiPhieuKho
        {
            Nhap,
            Xuat
        }
    }
}
