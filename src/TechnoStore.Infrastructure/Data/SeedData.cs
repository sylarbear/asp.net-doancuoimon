using Microsoft.EntityFrameworkCore;
using TechnoStore.Domain.Entities;

namespace TechnoStore.Infrastructure.Data
{
    public static class SeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            // ===== USERS =====
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FullName = "Admin TechnoStore",
                    Email = "admin@technostore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Phone = "0901234567",
                    Address = "123 Nguyễn Huệ, Q.1, TP.HCM",
                    Role = "Admin",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    IsActive = true
                },
                new User
                {
                    Id = 2,
                    FullName = "Nguyễn Văn Khách",
                    Email = "customer@technostore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
                    Phone = "0912345678",
                    Address = "456 Lê Lợi, Q.3, TP.HCM",
                    Role = "Customer",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    IsActive = true
                }
            );

            // ===== CATEGORIES =====
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Smartphone", Description = "Điện thoại thông minh các hãng", IsActive = true },
                new Category { Id = 2, Name = "Laptop", Description = "Máy tính xách tay các hãng", IsActive = true }
            );

            // ===== PRODUCTS =====
            var products = new List<Product>();
            int productId = 1;

            // --- SMARTPHONES (CategoryId = 1) ---

            // Samsung
            products.Add(new Product { Id = productId++, Name = "Samsung Galaxy A16", Brand = "Samsung", Description = "Màn hình 6.7 inch Super AMOLED, RAM 8GB, ROM 128GB, Pin 5000mAh. Smartphone phân khúc giá rẻ với thiết kế hiện đại.", Price = 4490000m, StockQuantity = 50, ImageUrl = "/images/products/samsung-galaxy-a16.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Samsung Galaxy S24 FE", Brand = "Samsung", Description = "Màn hình 6.7 inch Dynamic AMOLED 2X, Exynos 2400e, RAM 8GB, ROM 256GB. Flagship phân khúc trung bình.", Price = 12990000m, StockQuantity = 30, ImageUrl = "/images/products/samsung-galaxy-s24-fe.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Samsung Galaxy S25 Ultra", Brand = "Samsung", Description = "Màn hình 6.9 inch Dynamic AMOLED 2X, Snapdragon 8 Elite, RAM 12GB, ROM 512GB, Camera 200MP. Flagship cao cấp nhất.", Price = 33990000m, StockQuantity = 20, ImageUrl = "/images/products/samsung-galaxy-s25-ultra.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            // Apple
            products.Add(new Product { Id = productId++, Name = "iPhone 15", Brand = "Apple", Description = "Màn hình 6.1 inch Super Retina XDR, Chip A16 Bionic, RAM 6GB, ROM 128GB. iPhone thế hệ mới với Dynamic Island.", Price = 15990000m, StockQuantity = 40, ImageUrl = "/images/products/iphone-15.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "iPhone 16", Brand = "Apple", Description = "Màn hình 6.1 inch Super Retina XDR, Chip A18, RAM 8GB, ROM 256GB. Hỗ trợ Apple Intelligence.", Price = 22490000m, StockQuantity = 35, ImageUrl = "/images/products/iphone-16.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "iPhone 16 Pro Max", Brand = "Apple", Description = "Màn hình 6.9 inch Super Retina XDR, Chip A18 Pro, RAM 8GB, ROM 512GB, Camera 48MP 5x Zoom. Flagship đỉnh cao.", Price = 34490000m, StockQuantity = 25, ImageUrl = "/images/products/iphone-16-pro-max.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            // Xiaomi
            products.Add(new Product { Id = productId++, Name = "Redmi Note 14", Brand = "Xiaomi", Description = "Màn hình 6.67 inch AMOLED 120Hz, Dimensity 7025 Ultra, RAM 8GB, ROM 128GB. Smartphone giá rẻ hiệu năng cao.", Price = 4990000m, StockQuantity = 60, ImageUrl = "/images/products/redmi-note-14.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Xiaomi 15", Brand = "Xiaomi", Description = "Màn hình 6.36 inch LTPO AMOLED, Snapdragon 8 Elite, RAM 12GB, ROM 256GB. Flagship nhỏ gọn mạnh mẽ.", Price = 12990000m, StockQuantity = 25, ImageUrl = "/images/products/xiaomi-15.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Xiaomi 15 Ultra", Brand = "Xiaomi", Description = "Màn hình 6.73 inch LTPO AMOLED, Snapdragon 8 Elite, RAM 16GB, ROM 512GB, Camera Leica 50MP. Ultra flagship.", Price = 22990000m, StockQuantity = 15, ImageUrl = "/images/products/xiaomi-15-ultra.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            // OPPO
            products.Add(new Product { Id = productId++, Name = "OPPO A3", Brand = "OPPO", Description = "Màn hình 6.67 inch HD+, Snapdragon 6s Gen 1, RAM 6GB, ROM 128GB. Smartphone giá rẻ pin trâu.", Price = 4290000m, StockQuantity = 55, ImageUrl = "/images/products/oppo-a3.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "OPPO Reno 13", Brand = "OPPO", Description = "Màn hình 6.59 inch AMOLED 120Hz, Dimensity 8350, RAM 12GB, ROM 256GB. Thiết kế thời trang, camera AI.", Price = 9990000m, StockQuantity = 30, ImageUrl = "/images/products/oppo-reno-13.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "OPPO Find X8", Brand = "OPPO", Description = "Màn hình 6.59 inch LTPO AMOLED, Dimensity 9400, RAM 16GB, ROM 512GB, Camera Hasselblad. Flagship photography.", Price = 19990000m, StockQuantity = 20, ImageUrl = "/images/products/oppo-find-x8.jpg", CategoryId = 1, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            // --- LAPTOPS (CategoryId = 2) ---

            // ASUS
            products.Add(new Product { Id = productId++, Name = "ASUS VivoBook 15", Brand = "ASUS", Description = "Màn hình 15.6 inch FHD, Intel Core i5-1235U, RAM 8GB, SSD 512GB. Laptop văn phòng mỏng nhẹ.", Price = 11990000m, StockQuantity = 25, ImageUrl = "/images/products/asus-vivobook-15.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "ASUS TUF Gaming F15", Brand = "ASUS", Description = "Màn hình 15.6 inch FHD 144Hz, Intel Core i7-12700H, RTX 4060, RAM 16GB, SSD 512GB. Laptop gaming bền bỉ.", Price = 21990000m, StockQuantity = 20, ImageUrl = "/images/products/asus-tuf-gaming-f15.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "ASUS ROG Strix G16", Brand = "ASUS", Description = "Màn hình 16 inch QHD 240Hz, Intel Core i9-14900HX, RTX 4070, RAM 32GB, SSD 1TB. Gaming laptop cao cấp.", Price = 39990000m, StockQuantity = 10, ImageUrl = "/images/products/asus-rog-strix-g16.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            // Dell
            products.Add(new Product { Id = productId++, Name = "Dell Inspiron 15", Brand = "Dell", Description = "Màn hình 15.6 inch FHD, Intel Core i5-1335U, RAM 8GB, SSD 256GB. Laptop phổ thông đáng tin cậy.", Price = 12990000m, StockQuantity = 30, ImageUrl = "/images/products/dell-inspiron-15.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Dell Latitude 5540", Brand = "Dell", Description = "Màn hình 15.6 inch FHD, Intel Core i7-1365U, RAM 16GB, SSD 512GB. Laptop doanh nhân bảo mật cao.", Price = 24990000m, StockQuantity = 15, ImageUrl = "/images/products/dell-latitude-5540.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Dell XPS 16", Brand = "Dell", Description = "Màn hình 16 inch OLED 3.2K, Intel Core Ultra 9, RTX 4070, RAM 32GB, SSD 1TB. Ultrabook cao cấp nhất.", Price = 44990000m, StockQuantity = 8, ImageUrl = "/images/products/dell-xps-16.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            // Lenovo
            products.Add(new Product { Id = productId++, Name = "Lenovo IdeaPad 3", Brand = "Lenovo", Description = "Màn hình 15.6 inch FHD, AMD Ryzen 5 7520U, RAM 8GB, SSD 256GB. Laptop sinh viên giá tốt.", Price = 9990000m, StockQuantity = 35, ImageUrl = "/images/products/lenovo-ideapad-3.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Lenovo ThinkPad E16", Brand = "Lenovo", Description = "Màn hình 16 inch WUXGA, Intel Core i7-1360P, RAM 16GB, SSD 512GB. Laptop doanh nhân bàn phím tốt nhất.", Price = 19990000m, StockQuantity = 18, ImageUrl = "/images/products/lenovo-thinkpad-e16.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "Lenovo Legion Pro 5", Brand = "Lenovo", Description = "Màn hình 16 inch WQXGA 240Hz, AMD Ryzen 9 7945HX, RTX 4070, RAM 32GB, SSD 1TB. Gaming laptop hiệu năng quái vật.", Price = 41990000m, StockQuantity = 10, ImageUrl = "/images/products/lenovo-legion-pro-5.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            // HP
            products.Add(new Product { Id = productId++, Name = "HP 15", Brand = "HP", Description = "Màn hình 15.6 inch FHD, Intel Core i3-1215U, RAM 8GB, SSD 256GB. Laptop cơ bản cho học tập và văn phòng.", Price = 10990000m, StockQuantity = 40, ImageUrl = "/images/products/hp-15.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "HP Pavilion 15", Brand = "HP", Description = "Màn hình 15.6 inch FHD IPS, Intel Core i7-1355U, RAM 16GB, SSD 512GB. Laptop đa năng thiết kế đẹp.", Price = 17990000m, StockQuantity = 22, ImageUrl = "/images/products/hp-pavilion-15.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
            products.Add(new Product { Id = productId++, Name = "HP Omen 16", Brand = "HP", Description = "Màn hình 16.1 inch QHD 165Hz, Intel Core i9-13900HX, RTX 4080, RAM 32GB, SSD 1TB. Gaming laptop siêu mạnh.", Price = 37990000m, StockQuantity = 12, ImageUrl = "/images/products/hp-omen-16.jpg", CategoryId = 2, IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });

            modelBuilder.Entity<Product>().HasData(products);
        }

        public static void Initialize(TechnoStoreDbContext context)
        {
            // Only seed if database is empty
            if (context.Users.Any()) return;

            context.Users.AddRange(
                new User
                {
                    FullName = "Admin TechnoStore",
                    Email = "admin@technostore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Phone = "0901234567",
                    Address = "123 Nguyen Hue, Q.1, TP.HCM",
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    FullName = "Nguyen Van Khach",
                    Email = "customer@technostore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
                    Phone = "0912345678",
                    Address = "456 Le Loi, Q.3, TP.HCM",
                    Role = "Customer",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                }
            );

            context.Categories.AddRange(
                new Category { Name = "Smartphone", Description = "Dien thoai thong minh cac hang", IsActive = true },
                new Category { Name = "Laptop", Description = "May tinh xach tay cac hang", IsActive = true }
            );
            context.SaveChanges();

            var cat1 = context.Categories.First(c => c.Name == "Smartphone").Id;
            var cat2 = context.Categories.First(c => c.Name == "Laptop").Id;
            var now = DateTime.UtcNow;

            context.Products.AddRange(
                new Product { Name = "Samsung Galaxy A16", Brand = "Samsung", Description = "Man hinh 6.7 inch Super AMOLED, RAM 8GB, ROM 128GB", Price = 4490000m, StockQuantity = 50, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Samsung Galaxy S24 FE", Brand = "Samsung", Description = "Man hinh 6.7 inch Dynamic AMOLED 2X, RAM 8GB, ROM 256GB", Price = 12990000m, StockQuantity = 30, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Samsung Galaxy S25 Ultra", Brand = "Samsung", Description = "Snapdragon 8 Elite, RAM 12GB, ROM 512GB, Camera 200MP", Price = 33990000m, StockQuantity = 20, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "iPhone 15", Brand = "Apple", Description = "Chip A16 Bionic, RAM 6GB, ROM 128GB, Dynamic Island", Price = 15990000m, StockQuantity = 40, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "iPhone 16", Brand = "Apple", Description = "Chip A18, RAM 8GB, ROM 256GB, Apple Intelligence", Price = 22490000m, StockQuantity = 35, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "iPhone 16 Pro Max", Brand = "Apple", Description = "Chip A18 Pro, ROM 512GB, Camera 48MP 5x Zoom", Price = 34490000m, StockQuantity = 25, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Redmi Note 14", Brand = "Xiaomi", Description = "AMOLED 120Hz, Dimensity 7025 Ultra, RAM 8GB", Price = 4990000m, StockQuantity = 60, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Xiaomi 15", Brand = "Xiaomi", Description = "Snapdragon 8 Elite, RAM 12GB, ROM 256GB", Price = 12990000m, StockQuantity = 25, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Xiaomi 15 Ultra", Brand = "Xiaomi", Description = "Snapdragon 8 Elite, RAM 16GB, Camera Leica 50MP", Price = 22990000m, StockQuantity = 15, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "OPPO A3", Brand = "OPPO", Description = "Snapdragon 6s Gen 1, RAM 6GB, ROM 128GB", Price = 4290000m, StockQuantity = 55, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "OPPO Reno 13", Brand = "OPPO", Description = "Dimensity 8350, RAM 12GB, ROM 256GB, Camera AI", Price = 9990000m, StockQuantity = 30, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "OPPO Find X8", Brand = "OPPO", Description = "Dimensity 9400, RAM 16GB, Camera Hasselblad", Price = 19990000m, StockQuantity = 20, CategoryId = cat1, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "ASUS VivoBook 15", Brand = "ASUS", Description = "Intel Core i5-1235U, RAM 8GB, SSD 512GB", Price = 11990000m, StockQuantity = 25, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "ASUS TUF Gaming F15", Brand = "ASUS", Description = "i7-12700H, RTX 4060, RAM 16GB, SSD 512GB", Price = 21990000m, StockQuantity = 20, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "ASUS ROG Strix G16", Brand = "ASUS", Description = "i9-14900HX, RTX 4070, RAM 32GB, SSD 1TB", Price = 39990000m, StockQuantity = 10, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Dell Inspiron 15", Brand = "Dell", Description = "Intel Core i5-1335U, RAM 8GB, SSD 256GB", Price = 12990000m, StockQuantity = 30, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Dell Latitude 5540", Brand = "Dell", Description = "i7-1365U, RAM 16GB, SSD 512GB, bao mat cao", Price = 24990000m, StockQuantity = 15, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Dell XPS 16", Brand = "Dell", Description = "Core Ultra 9, RTX 4070, OLED 3.2K, RAM 32GB", Price = 44990000m, StockQuantity = 8, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Lenovo IdeaPad 3", Brand = "Lenovo", Description = "Ryzen 5 7520U, RAM 8GB, SSD 256GB", Price = 9990000m, StockQuantity = 35, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Lenovo ThinkPad E16", Brand = "Lenovo", Description = "i7-1360P, RAM 16GB, SSD 512GB", Price = 19990000m, StockQuantity = 18, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "Lenovo Legion Pro 5", Brand = "Lenovo", Description = "Ryzen 9 7945HX, RTX 4070, RAM 32GB", Price = 41990000m, StockQuantity = 10, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "HP 15", Brand = "HP", Description = "Intel Core i3-1215U, RAM 8GB, SSD 256GB", Price = 10990000m, StockQuantity = 40, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "HP Pavilion 15", Brand = "HP", Description = "i7-1355U, RAM 16GB, SSD 512GB, thiet ke dep", Price = 17990000m, StockQuantity = 22, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new Product { Name = "HP Omen 16", Brand = "HP", Description = "i9-13900HX, RTX 4080, QHD 165Hz, RAM 32GB", Price = 37990000m, StockQuantity = 12, CategoryId = cat2, IsActive = true, CreatedAt = now, UpdatedAt = now }
            );
            context.SaveChanges();
        }
    }
}
