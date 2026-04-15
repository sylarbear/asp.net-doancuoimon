using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Infrastructure.Data
{
    public class TechnoStoreDbContext : DbContext, IAppDbContext
    {
        public TechnoStoreDbContext(DbContextOptions<TechnoStoreDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<LoyaltyPoint> LoyaltyPoints => Set<LoyaltyPoint>();
        public DbSet<Voucher> Vouchers => Set<Voucher>();
        public DbSet<VoucherUsage> VoucherUsages => Set<VoucherUsage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasOne(p => p.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ProductImage
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasOne(pi => pi.Product)
                    .WithMany(p => p.ProductImages)
                    .HasForeignKey(pi => pi.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // CartItem
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasOne(ci => ci.User)
                    .WithMany(u => u.CartItems)
                    .HasForeignKey(ci => ci.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ci => ci.Product)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(ci => ci.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasIndex(o => o.OrderCode).IsUnique();

                entity.HasOne(o => o.User)
                    .WithMany(u => u.Orders)
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(o => o.Status)
                    .HasConversion<string>()
                    .HasMaxLength(20);

                entity.Property(o => o.PaymentMethod)
                    .HasConversion<string>()
                    .HasMaxLength(20);

                entity.Property(o => o.PaymentStatus)
                    .HasConversion<string>()
                    .HasMaxLength(20);
            });

            // OrderDetail
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasOne(od => od.Order)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(od => od.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(od => od.Product)
                    .WithMany(p => p.OrderDetails)
                    .HasForeignKey(od => od.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Review
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasOne(r => r.Product)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(r => r.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // One review per user per product
                entity.HasIndex(r => new { r.UserId, r.ProductId }).IsUnique();
            });

            // LoyaltyPoint
            modelBuilder.Entity<LoyaltyPoint>(entity =>
            {
                entity.HasOne(lp => lp.User)
                    .WithMany(u => u.LoyaltyPoints)
                    .HasForeignKey(lp => lp.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(lp => lp.Order)
                    .WithMany()
                    .HasForeignKey(lp => lp.OrderId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Voucher
            modelBuilder.Entity<Voucher>(entity =>
            {
                entity.HasIndex(v => v.Code).IsUnique();
            });

            // VoucherUsage
            modelBuilder.Entity<VoucherUsage>(entity =>
            {
                entity.HasOne(vu => vu.Voucher)
                    .WithMany(v => v.VoucherUsages)
                    .HasForeignKey(vu => vu.VoucherId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(vu => vu.User)
                    .WithMany(u => u.VoucherUsages)
                    .HasForeignKey(vu => vu.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(vu => vu.Order)
                    .WithMany()
                    .HasForeignKey(vu => vu.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                // One voucher per user per order
                entity.HasIndex(vu => new { vu.UserId, vu.OrderId }).IsUnique();
            });

            // Seed Data
            SeedData.Seed(modelBuilder);
        }
    }
}

