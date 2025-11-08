namespace backend.Models
{
    public interface IQuanLy<T> where T : class
    {
        void Them(T obj);
        void Sua(int id, T obj);
        void Xoa(int id);
        T TimKiem(int id);
    }
}
