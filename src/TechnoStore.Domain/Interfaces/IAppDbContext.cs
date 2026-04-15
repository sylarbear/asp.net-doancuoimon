using Microsoft.EntityFrameworkCore;
using TechnoStore.Domain.Entities;

namespace TechnoStore.Domain.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Category> Categories { get; }
        DbSet<Product> Products { get; }
        DbSet<CartItem> CartItems { get; }
        DbSet<Order> Orders { get; }
        DbSet<OrderDetail> OrderDetails { get; }
        DbSet<Review> Reviews { get; }
        DbSet<LoyaltyPoint> LoyaltyPoints { get; }
        DbSet<Voucher> Vouchers { get; }
        DbSet<VoucherUsage> VoucherUsages { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
