using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TechnoStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ShippingAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ReceiverName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ReceiverPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductImages_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    SubTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, "Điện thoại thông minh các hãng", true, "Smartphone" },
                    { 2, "Máy tính xách tay các hãng", true, "Laptop" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Phone", "Role" },
                values: new object[,]
                {
                    { 1, "123 Nguyễn Huệ, Q.1, TP.HCM", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@technostore.com", "Admin TechnoStore", true, "$2a$11$9VpEYrG4lC7PFv5zW.2Ppeq6KpNu0U845V3y8pkQ56LSvNPDMJ7RK", "0901234567", "Admin" },
                    { 2, "456 Lê Lợi, Q.3, TP.HCM", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "customer@technostore.com", "Nguyễn Văn Khách", true, "$2a$11$Y5xsnkdo3Dms5zZcj9z1XeqUSw.qf.yQsY.h.eguIs3Ax4ojQvcVG", "0912345678", "Customer" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "CreatedAt", "Description", "ImageUrl", "IsActive", "Name", "Price", "StockQuantity", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Samsung", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.7 inch Super AMOLED, RAM 8GB, ROM 128GB, Pin 5000mAh. Smartphone phân khúc giá rẻ với thiết kế hiện đại.", "/images/products/samsung-galaxy-a16.jpg", true, "Samsung Galaxy A16", 4490000m, 50, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, "Samsung", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.7 inch Dynamic AMOLED 2X, Exynos 2400e, RAM 8GB, ROM 256GB. Flagship phân khúc trung bình.", "/images/products/samsung-galaxy-s24-fe.jpg", true, "Samsung Galaxy S24 FE", 12990000m, 30, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, "Samsung", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.9 inch Dynamic AMOLED 2X, Snapdragon 8 Elite, RAM 12GB, ROM 512GB, Camera 200MP. Flagship cao cấp nhất.", "/images/products/samsung-galaxy-s25-ultra.jpg", true, "Samsung Galaxy S25 Ultra", 33990000m, 20, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, "Apple", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.1 inch Super Retina XDR, Chip A16 Bionic, RAM 6GB, ROM 128GB. iPhone thế hệ mới với Dynamic Island.", "/images/products/iphone-15.jpg", true, "iPhone 15", 15990000m, 40, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, "Apple", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.1 inch Super Retina XDR, Chip A18, RAM 8GB, ROM 256GB. Hỗ trợ Apple Intelligence.", "/images/products/iphone-16.jpg", true, "iPhone 16", 22490000m, 35, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, "Apple", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.9 inch Super Retina XDR, Chip A18 Pro, RAM 8GB, ROM 512GB, Camera 48MP 5x Zoom. Flagship đỉnh cao.", "/images/products/iphone-16-pro-max.jpg", true, "iPhone 16 Pro Max", 34490000m, 25, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, "Xiaomi", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.67 inch AMOLED 120Hz, Dimensity 7025 Ultra, RAM 8GB, ROM 128GB. Smartphone giá rẻ hiệu năng cao.", "/images/products/redmi-note-14.jpg", true, "Redmi Note 14", 4990000m, 60, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, "Xiaomi", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.36 inch LTPO AMOLED, Snapdragon 8 Elite, RAM 12GB, ROM 256GB. Flagship nhỏ gọn mạnh mẽ.", "/images/products/xiaomi-15.jpg", true, "Xiaomi 15", 12990000m, 25, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, "Xiaomi", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.73 inch LTPO AMOLED, Snapdragon 8 Elite, RAM 16GB, ROM 512GB, Camera Leica 50MP. Ultra flagship.", "/images/products/xiaomi-15-ultra.jpg", true, "Xiaomi 15 Ultra", 22990000m, 15, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, "OPPO", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.67 inch HD+, Snapdragon 6s Gen 1, RAM 6GB, ROM 128GB. Smartphone giá rẻ pin trâu.", "/images/products/oppo-a3.jpg", true, "OPPO A3", 4290000m, 55, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, "OPPO", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.59 inch AMOLED 120Hz, Dimensity 8350, RAM 12GB, ROM 256GB. Thiết kế thời trang, camera AI.", "/images/products/oppo-reno-13.jpg", true, "OPPO Reno 13", 9990000m, 30, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, "OPPO", 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 6.59 inch LTPO AMOLED, Dimensity 9400, RAM 16GB, ROM 512GB, Camera Hasselblad. Flagship photography.", "/images/products/oppo-find-x8.jpg", true, "OPPO Find X8", 19990000m, 20, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 13, "ASUS", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 15.6 inch FHD, Intel Core i5-1235U, RAM 8GB, SSD 512GB. Laptop văn phòng mỏng nhẹ.", "/images/products/asus-vivobook-15.jpg", true, "ASUS VivoBook 15", 11990000m, 25, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 14, "ASUS", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 15.6 inch FHD 144Hz, Intel Core i7-12700H, RTX 4060, RAM 16GB, SSD 512GB. Laptop gaming bền bỉ.", "/images/products/asus-tuf-gaming-f15.jpg", true, "ASUS TUF Gaming F15", 21990000m, 20, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 15, "ASUS", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 16 inch QHD 240Hz, Intel Core i9-14900HX, RTX 4070, RAM 32GB, SSD 1TB. Gaming laptop cao cấp.", "/images/products/asus-rog-strix-g16.jpg", true, "ASUS ROG Strix G16", 39990000m, 10, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 16, "Dell", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 15.6 inch FHD, Intel Core i5-1335U, RAM 8GB, SSD 256GB. Laptop phổ thông đáng tin cậy.", "/images/products/dell-inspiron-15.jpg", true, "Dell Inspiron 15", 12990000m, 30, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 17, "Dell", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 15.6 inch FHD, Intel Core i7-1365U, RAM 16GB, SSD 512GB. Laptop doanh nhân bảo mật cao.", "/images/products/dell-latitude-5540.jpg", true, "Dell Latitude 5540", 24990000m, 15, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 18, "Dell", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 16 inch OLED 3.2K, Intel Core Ultra 9, RTX 4070, RAM 32GB, SSD 1TB. Ultrabook cao cấp nhất.", "/images/products/dell-xps-16.jpg", true, "Dell XPS 16", 44990000m, 8, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 19, "Lenovo", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 15.6 inch FHD, AMD Ryzen 5 7520U, RAM 8GB, SSD 256GB. Laptop sinh viên giá tốt.", "/images/products/lenovo-ideapad-3.jpg", true, "Lenovo IdeaPad 3", 9990000m, 35, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 20, "Lenovo", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 16 inch WUXGA, Intel Core i7-1360P, RAM 16GB, SSD 512GB. Laptop doanh nhân bàn phím tốt nhất.", "/images/products/lenovo-thinkpad-e16.jpg", true, "Lenovo ThinkPad E16", 19990000m, 18, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 21, "Lenovo", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 16 inch WQXGA 240Hz, AMD Ryzen 9 7945HX, RTX 4070, RAM 32GB, SSD 1TB. Gaming laptop hiệu năng quái vật.", "/images/products/lenovo-legion-pro-5.jpg", true, "Lenovo Legion Pro 5", 41990000m, 10, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 22, "HP", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 15.6 inch FHD, Intel Core i3-1215U, RAM 8GB, SSD 256GB. Laptop cơ bản cho học tập và văn phòng.", "/images/products/hp-15.jpg", true, "HP 15", 10990000m, 40, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 23, "HP", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 15.6 inch FHD IPS, Intel Core i7-1355U, RAM 16GB, SSD 512GB. Laptop đa năng thiết kế đẹp.", "/images/products/hp-pavilion-15.jpg", true, "HP Pavilion 15", 17990000m, 22, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 24, "HP", 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màn hình 16.1 inch QHD 165Hz, Intel Core i9-13900HX, RTX 4080, RAM 32GB, SSD 1TB. Gaming laptop siêu mạnh.", "/images/products/hp-omen-16.jpg", true, "HP Omen 16", 37990000m, 12, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_UserId",
                table: "CartItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderId",
                table: "OrderDetails",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductId",
                table: "OrderDetails",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderCode",
                table: "Orders",
                column: "OrderCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImages_ProductId",
                table: "ProductImages",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "ProductImages");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
