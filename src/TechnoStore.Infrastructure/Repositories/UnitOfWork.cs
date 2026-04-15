using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;
using TechnoStore.Infrastructure.Data;

namespace TechnoStore.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly TechnoStoreDbContext _context;

        public UnitOfWork(TechnoStoreDbContext context)
        {
            _context = context;
            Users = new GenericRepository<User>(context);
            Categories = new GenericRepository<Category>(context);
            Products = new GenericRepository<Product>(context);
            ProductImages = new GenericRepository<ProductImage>(context);
            CartItems = new GenericRepository<CartItem>(context);
            Orders = new GenericRepository<Order>(context);
            OrderDetails = new GenericRepository<OrderDetail>(context);
            Reviews = new GenericRepository<Review>(context);
            LoyaltyPoints = new GenericRepository<LoyaltyPoint>(context);
            Vouchers = new GenericRepository<Voucher>(context);
            VoucherUsages = new GenericRepository<VoucherUsage>(context);
        }

        public IGenericRepository<User> Users { get; }
        public IGenericRepository<Category> Categories { get; }
        public IGenericRepository<Product> Products { get; }
        public IGenericRepository<ProductImage> ProductImages { get; }
        public IGenericRepository<CartItem> CartItems { get; }
        public IGenericRepository<Order> Orders { get; }
        public IGenericRepository<OrderDetail> OrderDetails { get; }
        public IGenericRepository<Review> Reviews { get; }
        public IGenericRepository<LoyaltyPoint> LoyaltyPoints { get; }
        public IGenericRepository<Voucher> Vouchers { get; }
        public IGenericRepository<VoucherUsage> VoucherUsages { get; }

        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();

        public void Dispose()
            => _context.Dispose();
    }
}

