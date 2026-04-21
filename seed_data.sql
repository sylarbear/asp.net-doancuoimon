-- ============================================
-- TECHNOSTORE SEED DATA
-- Diverse orders, reviews, and real product images
-- ============================================

-- ========== 1. UPDATE PRODUCT IMAGES (real URLs) ==========
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-a16_1_.png' WHERE Id = 1; -- Galaxy A16
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-fe.png' WHERE Id = 2; -- Galaxy S24 FE
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s25-ultra_2_.png' WHERE Id = 3; -- Galaxy S25 Ultra
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15_1_.png' WHERE Id = 4; -- iPhone 15
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16_1_.png' WHERE Id = 5; -- iPhone 16
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1_.png' WHERE Id = 6; -- iPhone 16 Pro Max
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-14-5g.png' WHERE Id = 7; -- Redmi Note 14
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-15.png' WHERE Id = 8; -- Xiaomi 15
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-15-ultra.png' WHERE Id = 9; -- Xiaomi 15 Ultra
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-a3.png' WHERE Id = 10; -- OPPO A3
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno-13-5g.png' WHERE Id = 11; -- OPPO Reno 13
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x8.png' WHERE Id = 12; -- OPPO Find X8
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-vivobook-15-oled_1_.png' WHERE Id = 13; -- ASUS VivoBook 15
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-tuf-gaming-f15.png' WHERE Id = 14; -- ASUS TUF Gaming F15
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_5__6.png' WHERE Id = 15; -- ASUS ROG Strix G16
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/dell-inspiron-15-3520.png' WHERE Id = 16; -- Dell Inspiron 15
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/dell-latitude-5540.png' WHERE Id = 17; -- Dell Latitude 5540
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/dell-xps-16-9640.png' WHERE Id = 18; -- Dell XPS 16
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/e/lenovo-ideapad-3-15iah8.png' WHERE Id = 19; -- Lenovo IdeaPad 3
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/e/lenovo-thinkpad-e16-gen-5.png' WHERE Id = 20; -- Lenovo ThinkPad E16
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/e/lenovo-legion-pro-5-16irx9.png' WHERE Id = 21; -- Lenovo Legion Pro 5
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/h/p/hp-15-fd0234tu.png' WHERE Id = 22; -- HP 15
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/h/p/hp-pavilion-15-eg2082tu.png' WHERE Id = 23; -- HP Pavilion 15
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/h/p/hp-omen-16-xf0072ax.png' WHERE Id = 24; -- HP Omen 16
-- MacBook Air M3 (id=25 if exists)
UPDATE Products SET ImageUrl = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-2024.png' WHERE Id = 25;

-- ========== 2. SEED ORDERS (diverse statuses for chart) ==========
-- Confirmed order (3 days ago)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260418-SEED01', 2, 22490000, 'Confirmed', 'BankTransfer', 'Paid', N'456 Lê Lợi, Q.1, TP.HCM', N'Nguyễn Văn An', '0909123456', N'Giao giờ hành chính', '2026-04-18 10:30:00', '2026-04-18 11:00:00', 0, 22040200, 449800, 0, NULL);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
VALUES (SCOPE_IDENTITY(), 5, N'iPhone 16', 22490000, 1, 22490000);

-- Shipping order (2 days ago)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260419-SEED02', 3, 33990000, 'Shipping', 'COD', 'Pending', N'789 Nguyễn Huệ, Q.1, TP.HCM', N'Trần Thị Bình', '0912345678', N'Gọi trước khi giao', '2026-04-19 14:00:00', '2026-04-19 16:00:00', 0, 33990000, 0, 0, NULL);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
VALUES (SCOPE_IDENTITY(), 3, N'Samsung Galaxy S25 Ultra', 33990000, 1, 33990000);

-- Delivered order (yesterday)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260420-SEED03', 2, 17980000, 'Delivered', 'BankTransfer', 'Paid', N'123 Trần Hưng Đạo, Q.5, TP.HCM', N'Nguyễn Văn An', '0909123456', NULL, '2026-04-20 09:00:00', '2026-04-20 18:00:00', 0, 17620400, 359600, 0, NULL);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
VALUES (SCOPE_IDENTITY(), 23, N'HP Pavilion 15', 17990000, 1, 17990000);

-- Completed order (5 days ago, with voucher)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260416-SEED04', 3, 9980000, 'Completed', 'COD', 'Paid', N'321 Hai Bà Trưng, Q.3, TP.HCM', N'Trần Thị Bình', '0912345678', NULL, '2026-04-16 08:00:00', '2026-04-17 10:00:00', 1497000, 8483000, 0, 84, 'SALE15');
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
VALUES (SCOPE_IDENTITY(), 7, N'Redmi Note 14', 4990000, 2, 9980000);

-- Completed order (4 days ago)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260417-SEED05', 2, 44990000, 'Completed', 'BankTransfer', 'Paid', N'100 Điện Biên Phủ, Bình Thạnh', N'Nguyễn Văn An', '0909123456', N'Cần hóa đơn VAT', '2026-04-17 11:00:00', '2026-04-18 15:00:00', 0, 44090200, 899800, 440, NULL);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
VALUES (SCOPE_IDENTITY(), 18, N'Dell XPS 16', 44990000, 1, 44990000);

-- Completed order (6 days ago)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260415-SEED06', 3, 15990000, 'Completed', 'COD', 'Paid', N'55 Phan Xích Long, Phú Nhuận', N'Trần Thị Bình', '0912345678', NULL, '2026-04-15 13:00:00', '2026-04-16 09:00:00', 0, 15990000, 0, 159, NULL);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
VALUES (SCOPE_IDENTITY(), 4, N'iPhone 15', 15990000, 1, 15990000);

-- Another Completed (7 days ago, multi-item)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260414-SEED07', 2, 16280000, 'Completed', 'BankTransfer', 'Paid', N'200 Lý Tự Trọng, Q.1, TP.HCM', N'Nguyễn Văn An', '0909123456', NULL, '2026-04-14 16:00:00', '2026-04-15 12:00:00', 0, 15954400, 325600, 159, NULL);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
SELECT SCOPE_IDENTITY(), 13, N'ASUS VivoBook 15', 11990000, 1, 11990000
UNION ALL SELECT SCOPE_IDENTITY(), 10, N'OPPO A3', 4290000, 1, 4290000;

-- Pending order (today)
INSERT INTO Orders (OrderCode, UserId, TotalAmount, Status, PaymentMethod, PaymentStatus, ShippingAddress, ReceiverName, ReceiverPhone, Note, CreatedAt, UpdatedAt, DiscountAmount, FinalAmount, MemberDiscount, PointsEarned, VoucherCode)
VALUES ('TS-20260421-SEED08', 3, 39990000, 'Pending', 'BankTransfer', 'Pending', N'88 Nguyễn Thị Minh Khai, Q.3', N'Trần Thị Bình', '0912345678', N'Cần tư vấn thêm', '2026-04-21 10:00:00', '2026-04-21 10:00:00', 0, 39990000, 0, 0, NULL);
INSERT INTO OrderDetails (OrderId, ProductId, ProductName, UnitPrice, Quantity, SubTotal)
VALUES (SCOPE_IDENTITY(), 15, N'ASUS ROG Strix G16', 39990000, 1, 39990000);

-- ========== 3. SEED REVIEWS ==========
INSERT INTO Reviews (ProductId, UserId, Rating, Comment, CreatedAt, IsActive) VALUES
(4, 2, 5, N'iPhone 15 rất mượt, camera chụp đẹp, pin dùng cả ngày. Rất hài lòng!', '2026-04-16 10:00:00', 1),
(4, 3, 4, N'Thiết kế đẹp, hiệu năng ổn. Chỉ tiếc là sạc hơi chậm.', '2026-04-17 14:00:00', 1),
(5, 2, 5, N'iPhone 16 quá tuyệt vời! Apple Intelligence rất hữu ích.', '2026-04-18 09:00:00', 1),
(3, 3, 5, N'Galaxy S25 Ultra camera zoom 100x siêu nét, S-Pen rất tiện.', '2026-04-19 11:00:00', 1),
(7, 2, 4, N'Redmi Note 14 giá rẻ nhưng chất lượng rất tốt, màn hình AMOLED đẹp.', '2026-04-17 16:00:00', 1),
(7, 3, 5, N'Mua cho bé xài, rất hài lòng với mức giá này. Pin trâu!', '2026-04-18 08:00:00', 1),
(18, 2, 5, N'Dell XPS 16 màn OLED quá đỉnh, xử lý đồ họa mượt mà.', '2026-04-19 20:00:00', 1),
(13, 3, 4, N'VivoBook 15 gọn nhẹ, phù hợp sinh viên. Bàn phím gõ êm.', '2026-04-16 15:00:00', 1),
(23, 2, 4, N'HP Pavilion thiết kế sang, chạy Office và code rất mượt.', '2026-04-20 12:00:00', 1),
(6, 3, 5, N'iPhone 16 Pro Max camera siêu đỉnh, quay video 4K đẹp lung linh!', '2026-04-20 14:00:00', 1),
(11, 2, 4, N'OPPO Reno 13 chụp đêm rất đẹp, sạc siêu nhanh.', '2026-04-19 09:00:00', 1),
(14, 3, 5, N'ASUS TUF Gaming F15 chơi game rất mượt, tản nhiệt tốt!', '2026-04-18 21:00:00', 1);

PRINT 'Seed data completed successfully!';
