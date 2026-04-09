using TechnoStore.Domain.Entities;

namespace TechnoStore.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<User> Users { get; }
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<Product> Products { get; }
        IGenericRepository<ProductImage> ProductImages { get; }
        IGenericRepository<CartItem> CartItems { get; }
        IGenericRepository<Order> Orders { get; }
        IGenericRepository<OrderDetail> OrderDetails { get; }
        Task<int> SaveChangesAsync();
    }
}
