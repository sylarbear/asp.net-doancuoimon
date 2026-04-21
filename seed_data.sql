-- ============================================
-- TECHNOSTORE SEED DATA
-- Comprehensive demo data for all features
-- Run after database creation & initial migration
-- ============================================

-- ========== 1. THÊM KHÁCH HÀNG DEMO ==========
-- Password cho tất cả: Customer@123
-- BCrypt hash: $2a$11$K3GxGl2X5Bj0dPOZj8v9/.Q9zGK8YxCQ3E5D7H1nF4kR6MjW2YvKa
INSERT INTO Users (FullName, Email, PasswordHash, Phone, [Address], [Role], CreatedAt, IsActive) VALUES
(N'Trần Minh Tuấn', 'tuan@gmail.com', '$2a$11$K3GxGl2X5Bj0dPOZj8v9/.Q9zGK8YxCQ3E5D7H1nF4kR6MjW2YvKa', '0903456789', N'789 Nguyễn Huệ, Q.1, TP.HCM', 'Customer', '2026-01-15 08:00:00', 1),
(N'Lê Thị Hương', 'huong@gmail.com', '$2a$11$K3GxGl2X5Bj0dPOZj8v9/.Q9zGK8YxCQ3E5D7H1nF4kR6MjW2YvKa', '0914567890', N'321 Hai Bà Trưng, Q.3, TP.HCM', 'Customer', '2026-02-01 10:00:00', 1),
(N'Phạm Đức Anh', 'ducanh@gmail.com', '$2a$11$K3GxGl2X5Bj0dPOZj8v9/.Q9zGK8YxCQ3E5D7H1nF4kR6MjW2YvKa', '0925678901', N'55 Phan Xích Long, Phú Nhuận', 'Customer', '2026-02-10 14:00:00', 1),
(N'Võ Hoàng Nam', 'nam@gmail.com', '$2a$11$K3GxGl2X5Bj0dPOZj8v9/.Q9zGK8YxCQ3E5D7H1nF4kR6MjW2YvKa', '0936789012', N'100 Điện Biên Phủ, Bình Thạnh', 'Customer', '2026-03-01 09:00:00', 1);

-- Ghi chú: Sau khi INSERT, các user mới sẽ có Id = 3, 4, 5, 6
-- (vì Id 1 = Admin, Id 2 = Customer mặc định)

-- ========== 2. CẬP NHẬT ẢNH SẢN PHẨM (URLs thật) ==========
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-a16_1_.png' WHERE Id = 1;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-fe.png' WHERE Id = 2;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s25-ultra_2_.png' WHERE Id = 3;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15_1_.png' WHERE Id = 4;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16_1_.png' WHERE Id = 5;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_.png' WHERE Id = 6;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-14-5g.png' WHERE Id = 7;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-15.png' WHERE Id = 8;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-15-ultra.png' WHERE Id = 9;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-a3.png' WHERE Id = 10;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno-13-5g.png' WHERE Id = 11;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x8.png' WHERE Id = 12;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-vivobook-15-oled_1_.png' WHERE Id = 13;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-tuf-gaming-f15.png' WHERE Id = 14;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_5__6.png' WHERE Id = 15;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/dell-inspiron-15-3520.png' WHERE Id = 16;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/dell-latitude-5540.png' WHERE Id = 17;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/dell-xps-16-9640.png' WHERE Id = 18;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/e/lenovo-ideapad-3-15iah8.png' WHERE Id = 19;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/e/lenovo-thinkpad-e16-gen-5.png' WHERE Id = 20;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/e/lenovo-legion-pro-5-16irx9.png' WHERE Id = 21;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/h/p/hp-15-fd0234tu.png' WHERE Id = 22;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/h/p/hp-pavilion-15-eg2082tu.png' WHERE Id = 23;
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/h/p/hp-omen-16-xf0072ax.png' WHERE Id = 24;

-- ========== 3. SEED ĐƠN HÀNG (18 đơn, đa dạng trạng thái) ==========

-- === COMPLETED ORDERS (10 đơn - để doanh thu chart đẹp) ===

-- Đơn 1: Completed - 15 ngày trước (User 2 - Nguyễn Văn Khách)
DECLARE @orderId INT;
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260406-001', 2, 15990000, 'Completed', 'COD', 'Paid', N'456 Lê Lợi, Q.3, TP.HCM', N'Nguyễn Văn Khách', '0912345678', NULL, '2026-04-06 09:00:00', '2026-04-07 15:00:00', 0, 15990000, 0, 159, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 4, N'iPhone 15', 15990000, 1, 15990000);

-- Đơn 2: Completed - 14 ngày trước (User 3 - Trần Minh Tuấn)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260407-002', 3, 33990000, 'Completed', 'BankTransfer', 'Paid', N'789 Nguyễn Huệ, Q.1, TP.HCM', N'Trần Minh Tuấn', '0903456789', N'Giao giờ hành chính', '2026-04-07 10:30:00', '2026-04-08 16:00:00', 0, 33990000, 0, 339, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 3, N'Samsung Galaxy S25 Ultra', 33990000, 1, 33990000);

-- Đơn 3: Completed - 12 ngày trước, có voucher (User 4 - Lê Thị Hương)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260409-003', 4, 44990000, 'Completed', 'BankTransfer', 'Paid', N'321 Hai Bà Trưng, Q.3, TP.HCM', N'Lê Thị Hương', '0914567890', N'Cần hóa đơn VAT', '2026-04-09 11:00:00', '2026-04-10 14:00:00', 2000000, 42990000, 0, 429, 'SALE15');
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 18, N'Dell XPS 16', 44990000, 1, 44990000);

-- Đơn 4: Completed - 10 ngày trước, multi-item (User 5 - Phạm Đức Anh)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260411-004', 5, 9480000, 'Completed', 'COD', 'Paid', N'55 Phan Xích Long, Phú Nhuận', N'Phạm Đức Anh', '0925678901', NULL, '2026-04-11 14:00:00', '2026-04-12 10:00:00', 0, 9480000, 0, 94, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 7, N'Redmi Note 14', 4990000, 1, 4990000);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 1, N'Samsung Galaxy A16', 4490000, 1, 4490000);

-- Đơn 5: Completed - 8 ngày trước (User 6 - Võ Hoàng Nam)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260413-005', 6, 22490000, 'Completed', 'BankTransfer', 'Paid', N'100 Điện Biên Phủ, Bình Thạnh', N'Võ Hoàng Nam', '0936789012', NULL, '2026-04-13 08:00:00', '2026-04-14 12:00:00', 0, 22490000, 0, 224, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 5, N'iPhone 16', 22490000, 1, 22490000);

-- Đơn 6: Completed - 7 ngày trước (User 2)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260414-006', 2, 21990000, 'Completed', 'COD', 'Paid', N'456 Lê Lợi, Q.3, TP.HCM', N'Nguyễn Văn Khách', '0912345678', N'Mua laptop cho con', '2026-04-14 16:00:00', '2026-04-15 18:00:00', 0, 21990000, 0, 219, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 14, N'ASUS TUF Gaming F15', 21990000, 1, 21990000);

-- Đơn 7: Completed - 6 ngày trước, multi-item (User 3)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260415-007', 3, 16280000, 'Completed', 'BankTransfer', 'Paid', N'789 Nguyễn Huệ, Q.1, TP.HCM', N'Trần Minh Tuấn', '0903456789', NULL, '2026-04-15 13:00:00', '2026-04-16 09:00:00', 0, 16280000, 0, 162, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 13, N'ASUS VivoBook 15', 11990000, 1, 11990000);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 10, N'OPPO A3', 4290000, 1, 4290000);

-- Đơn 8: Completed - 5 ngày trước, có voucher (User 4)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260416-008', 4, 34490000, 'Completed', 'BankTransfer', 'Paid', N'321 Hai Bà Trưng, Q.3, TP.HCM', N'Lê Thị Hương', '0914567890', N'Ship nhanh giùm', '2026-04-16 10:00:00', '2026-04-17 11:00:00', 2000000, 32490000, 0, 324, 'SALE25');
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 6, N'iPhone 16 Pro Max', 34490000, 1, 34490000);

-- Đơn 9: Completed - 3 ngày trước (User 5)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260418-009', 5, 17990000, 'Completed', 'COD', 'Paid', N'55 Phan Xích Long, Phú Nhuận', N'Phạm Đức Anh', '0925678901', NULL, '2026-04-18 09:00:00', '2026-04-19 14:00:00', 0, 17990000, 0, 179, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 23, N'HP Pavilion 15', 17990000, 1, 17990000);

-- Đơn 10: Completed - 2 ngày trước, multi-item (User 6)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260419-010', 6, 9980000, 'Completed', 'BankTransfer', 'Paid', N'100 Điện Biên Phủ, Bình Thạnh', N'Võ Hoàng Nam', '0936789012', N'Mua tặng bạn gái', '2026-04-19 11:00:00', '2026-04-20 09:00:00', 0, 9980000, 0, 99, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 7, N'Redmi Note 14', 4990000, 2, 9980000);

-- === CONFIRMED ORDER (1 đơn) ===
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260420-011', 3, 12990000, 'Confirmed', 'BankTransfer', 'Paid', N'789 Nguyễn Huệ, Q.1, TP.HCM', N'Trần Minh Tuấn', '0903456789', N'Giao giờ hành chính', '2026-04-20 10:30:00', '2026-04-20 11:00:00', 0, 12990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 2, N'Samsung Galaxy S24 FE', 12990000, 1, 12990000);

-- === SHIPPING ORDERS (2 đơn) ===
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260420-012', 4, 19990000, 'Shipping', 'COD', 'Pending', N'321 Hai Bà Trưng, Q.3, TP.HCM', N'Lê Thị Hương', '0914567890', N'Gọi trước khi giao', '2026-04-20 14:00:00', '2026-04-20 16:00:00', 0, 19990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 20, N'Lenovo ThinkPad E16', 19990000, 1, 19990000);

INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260420-013', 2, 9990000, 'Shipping', 'BankTransfer', 'Paid', N'456 Lê Lợi, Q.3, TP.HCM', N'Nguyễn Văn Khách', '0912345678', NULL, '2026-04-20 08:00:00', '2026-04-20 12:00:00', 0, 9990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 11, N'OPPO Reno 13', 9990000, 1, 9990000);

-- === DELIVERED ORDER (1 đơn) ===
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260421-014', 5, 22990000, 'Delivered', 'COD', 'Pending', N'55 Phan Xích Long, Phú Nhuận', N'Phạm Đức Anh', '0925678901', N'Kiểm tra hàng trước', '2026-04-21 09:00:00', '2026-04-21 16:00:00', 0, 22990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 9, N'Xiaomi 15 Ultra', 22990000, 1, 22990000);

-- === PENDING ORDERS (2 đơn) ===
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260421-015', 6, 39990000, 'Pending', 'BankTransfer', 'Pending', N'100 Điện Biên Phủ, Bình Thạnh', N'Võ Hoàng Nam', '0936789012', N'Cần tư vấn thêm', '2026-04-21 10:00:00', '2026-04-21 10:00:00', 0, 39990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 15, N'ASUS ROG Strix G16', 39990000, 1, 39990000);

INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260421-016', 3, 12990000, 'Pending', 'COD', 'Pending', N'789 Nguyễn Huệ, Q.1, TP.HCM', N'Trần Minh Tuấn', '0903456789', NULL, '2026-04-21 12:00:00', '2026-04-21 12:00:00', 0, 12990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 8, N'Xiaomi 15', 12990000, 1, 12990000);

-- === CANCELLED ORDERS (2 đơn) ===
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260410-017', 2, 41990000, 'Cancelled', 'BankTransfer', 'Pending', N'456 Lê Lợi, Q.3, TP.HCM', N'Nguyễn Văn Khách', '0912345678', N'Đổi ý không mua nữa', '2026-04-10 15:00:00', '2026-04-10 17:00:00', 0, 41990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 21, N'Lenovo Legion Pro 5', 41990000, 1, 41990000);

INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260412-018', 6, 37990000, 'Cancelled', 'COD', 'Pending', N'100 Điện Biên Phủ, Bình Thạnh', N'Võ Hoàng Nam', '0936789012', N'Tìm được giá tốt hơn', '2026-04-12 08:00:00', '2026-04-12 09:30:00', 0, 37990000, 0, 0, NULL);
SET @orderId = SCOPE_IDENTITY();
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal) VALUES (@orderId, 24, N'HP Omen 16', 37990000, 1, 37990000);

-- ========== 4. SEED ĐÁNH GIÁ (25 reviews, phủ cả smartphone + laptop) ==========
INSERT INTO Reviews (ProductId, UserId, Rating, Comment, CreatedAt, IsActive) VALUES
-- Smartphone reviews
(1, 3, 4, N'Galaxy A16 giá rẻ nhưng màn AMOLED rất đẹp, pin dùng cả ngày. Đáng mua!', '2026-04-07 10:00:00', 1),
(1, 5, 5, N'Mua cho ba mẹ xài, rất dễ dùng và bền. Giao hàng nhanh!', '2026-04-10 08:00:00', 1),
(2, 4, 4, N'Galaxy S24 FE cấu hình flagship, giá tầm trung. Camera chụp đẹp, AI xóa phông tốt.', '2026-04-09 15:00:00', 1),
(3, 3, 5, N'S25 Ultra camera zoom 100x siêu nét, S-Pen rất tiện cho ghi chú. Flagship đáng mua nhất!', '2026-04-08 11:00:00', 1),
(3, 6, 5, N'Snapdragon 8 Elite chạy mượt mọi game, Galaxy AI rất thông minh. Worth every penny!', '2026-04-14 20:00:00', 1),
(4, 2, 5, N'iPhone 15 rất mượt, camera chụp đẹp, pin dùng cả ngày. Dynamic Island tiện lợi!', '2026-04-07 10:00:00', 1),
(4, 4, 4, N'Thiết kế đẹp, hiệu năng ổn. Chỉ tiếc là sạc hơi chậm so với Android.', '2026-04-10 14:00:00', 1),
(5, 6, 5, N'iPhone 16 quá tuyệt vời! Apple Intelligence rất hữu ích, camera Action button hay.', '2026-04-14 09:00:00', 1),
(5, 2, 4, N'Nâng cấp xứng đáng từ iPhone 15, chip A18 nhanh hơn rõ. Hệ sinh thái Apple tuyệt vời.', '2026-04-16 09:00:00', 1),
(6, 4, 5, N'iPhone 16 Pro Max camera siêu đỉnh, zoom 5x quang học sắc nét. Quay video 4K lung linh!', '2026-04-17 14:00:00', 1),
(6, 3, 5, N'Pin trâu dùng 2 ngày, titanium nhẹ mà chắc. Đắt nhưng xứng đáng!', '2026-04-18 16:00:00', 1),
(7, 2, 4, N'Redmi Note 14 giá rẻ nhưng chất lượng rất tốt, AMOLED 120Hz mượt mà.', '2026-04-12 16:00:00', 1),
(7, 5, 5, N'Mua cho bé xài, rất hài lòng với mức giá này. Pin trâu, sạc nhanh!', '2026-04-13 08:00:00', 1),
(9, 5, 5, N'Xiaomi 15 Ultra camera Leica quá đỉnh, chụp chân dung nghệ thuật. Flagship ẩn!', '2026-04-15 20:00:00', 1),
(11, 2, 4, N'OPPO Reno 13 chụp đêm rất đẹp, sạc 67W siêu nhanh. Thiết kế thời trang.', '2026-04-16 09:00:00', 1),
(12, 6, 5, N'OPPO Find X8 camera Hasselblad chụp siêu đẹp, Dimensity 9400 mạnh ngang Snapdragon!', '2026-04-18 10:00:00', 1),
-- Laptop reviews
(13, 4, 4, N'VivoBook 15 gọn nhẹ, phù hợp sinh viên. Bàn phím gõ êm, OLED hiển thị tốt.', '2026-04-10 15:00:00', 1),
(14, 2, 5, N'ASUS TUF Gaming F15 chơi game rất mượt, tản nhiệt tốt! RTX 4060 chạy mọi game.', '2026-04-15 21:00:00', 1),
(14, 6, 4, N'Laptop gaming bền bỉ, thiết kế hầm hố. Hơi nặng nhưng hiệu năng bù lại.', '2026-04-17 19:00:00', 1),
(16, 3, 4, N'Dell Inspiron 15 đáng tin cậy, build quality tốt. Dùng văn phòng rất ổn.', '2026-04-11 08:00:00', 1),
(18, 4, 5, N'Dell XPS 16 màn OLED 3.2K quá đỉnh, mỏng nhẹ mà hiệu năng mạnh. Ultrabook tốt nhất!', '2026-04-11 20:00:00', 1),
(19, 5, 4, N'IdeaPad 3 giá tốt cho sinh viên, Ryzen 5 chạy mượt Word Excel. Pin khá ổn.', '2026-04-12 14:00:00', 1),
(20, 3, 5, N'ThinkPad E16 bàn phím tốt nhất thế giới laptop! Doanh nhân nên mua ThinkPad.', '2026-04-16 10:00:00', 1),
(23, 5, 4, N'HP Pavilion thiết kế sang, chạy Office và code rất mượt. Loa B&O nghe hay.', '2026-04-19 12:00:00', 1),
(24, 3, 5, N'HP Omen 16 RTX 4080 chơi game 4K mượt mà, màn QHD sắc nét. Gaming laptop đỉnh!', '2026-04-20 22:00:00', 1);

-- ========== 5. SEED LOYALTY POINTS (lịch sử tích/đổi điểm) ==========
-- Lưu ý: OrderId phải tương ứng với orders đã tạo ở trên
-- Giả sử orders bắt đầu từ Id = 1

-- User 2 - Nguyễn Văn Khách (tổng earned: 159+219 = 378 điểm)
INSERT INTO LoyaltyPoints (UserId, Points, [Type], [Description], OrderId, CreatedAt) VALUES
(2, 159, 'Earned', N'Tích điểm đơn hàng TS-20260406-001 - iPhone 15', NULL, '2026-04-07 15:00:00'),
(2, 219, 'Earned', N'Tích điểm đơn hàng TS-20260414-006 - ASUS TUF Gaming F15', NULL, '2026-04-15 18:00:00');

-- User 3 - Trần Minh Tuấn (tổng earned: 339+162 = 501 điểm, redeemed: 300)
INSERT INTO LoyaltyPoints (UserId, Points, [Type], [Description], OrderId, CreatedAt) VALUES
(3, 339, 'Earned', N'Tích điểm đơn hàng TS-20260407-002 - Galaxy S25 Ultra', NULL, '2026-04-08 16:00:00'),
(3, 162, 'Earned', N'Tích điểm đơn hàng TS-20260415-007 - VivoBook + OPPO A3', NULL, '2026-04-16 09:00:00'),
(3, -300, 'Redeemed', N'Đổi voucher SALE25 - Giảm 25%', NULL, '2026-04-18 10:00:00');

-- User 4 - Lê Thị Hương (tổng earned: 429+324 = 753 điểm, redeemed: 0)
INSERT INTO LoyaltyPoints (UserId, Points, [Type], [Description], OrderId, CreatedAt) VALUES
(4, 429, 'Earned', N'Tích điểm đơn hàng TS-20260409-003 - Dell XPS 16', NULL, '2026-04-10 14:00:00'),
(4, 324, 'Earned', N'Tích điểm đơn hàng TS-20260416-008 - iPhone 16 Pro Max', NULL, '2026-04-17 11:00:00');

-- User 5 - Phạm Đức Anh (tổng earned: 94+179 = 273 điểm)
INSERT INTO LoyaltyPoints (UserId, Points, [Type], [Description], OrderId, CreatedAt) VALUES
(5, 94, 'Earned', N'Tích điểm đơn hàng TS-20260411-004 - Redmi + Galaxy A16', NULL, '2026-04-12 10:00:00'),
(5, 179, 'Earned', N'Tích điểm đơn hàng TS-20260418-009 - HP Pavilion 15', NULL, '2026-04-19 14:00:00');

-- User 6 - Võ Hoàng Nam (tổng earned: 224+99 = 323 điểm)
INSERT INTO LoyaltyPoints (UserId, Points, [Type], [Description], OrderId, CreatedAt) VALUES
(6, 224, 'Earned', N'Tích điểm đơn hàng TS-20260413-005 - iPhone 16', NULL, '2026-04-14 12:00:00'),
(6, 99, 'Earned', N'Tích điểm đơn hàng TS-20260419-010 - Redmi Note 14 x2', NULL, '2026-04-20 09:00:00');

-- ========== 6. CẬP NHẬT SỐ LƯỢNG TỒN KHO (trừ theo đơn đã bán) ==========
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 4;   -- iPhone 15 (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 3;   -- Galaxy S25 Ultra (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 18;  -- Dell XPS 16 (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 7;   -- Redmi Note 14 (-3 total)
UPDATE Products SET StockQuantity = StockQuantity - 2 WHERE Id = 7;
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 1;   -- Galaxy A16 (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 5;   -- iPhone 16 (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 14;  -- ASUS TUF (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 13;  -- VivoBook (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 10;  -- OPPO A3 (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 6;   -- iPhone 16 Pro Max (-1)
UPDATE Products SET StockQuantity = StockQuantity - 1 WHERE Id = 23;  -- HP Pavilion (-1)

PRINT '✅ Seed data completed successfully!';
PRINT '📊 Summary:';
PRINT '   - 4 new customers added';
PRINT '   - 18 orders (10 Completed, 1 Confirmed, 2 Shipping, 1 Delivered, 2 Pending, 2 Cancelled)';
PRINT '   - 25 product reviews (smartphones + laptops)';
PRINT '   - 11 loyalty point records';
PRINT '   - Product stock quantities updated';
