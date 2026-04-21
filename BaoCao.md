# BÁO CÁO ĐỒ ÁN CUỐI MÔN ASP.NET

## TECHNOSTORE — HỆ THỐNG BÁN HÀNG CÔNG NGHỆ TRỰC TUYẾN

---

**Sinh viên:** Phan Quang Thuật  
**MSSV:** 2120110351  
**GVHD:** Huỳnh Tấn Phát  
**Môn học:** Đồ án cuối môn ASP.NET  
**Năm:** 2026  
**GitHub:** https://github.com/sylarbear/asp.net-doancuoimon

---

## MỤC LỤC

1. Giới thiệu đề tài
2. Công nghệ sử dụng
3. Kiến trúc hệ thống
4. Cấu trúc thư mục dự án
5. Chức năng chính
6. Thiết kế cơ sở dữ liệu
7. Giao diện hệ thống
8. Hướng dẫn cài đặt & chạy
9. Kiểm thử
10. Kết luận

---

## 1. GIỚI THIỆU ĐỀ TÀI

### 1.1 Đặt vấn đề

Trong thời đại công nghệ số, nhu cầu mua sắm trực tuyến các sản phẩm công nghệ ngày càng tăng cao. Người tiêu dùng cần một nền tảng đáng tin cậy để tìm kiếm, so sánh và mua các thiết bị điện tử chính hãng với giá tốt nhất.

### 1.2 Mục tiêu

Xây dựng hệ thống thương mại điện tử **TechnoStore** với các mục tiêu:

- Cung cấp nền tảng mua bán điện thoại và laptop chính hãng
- Tích hợp hệ thống tích điểm khách hàng thân thiết (Loyalty Program)
- Hỗ trợ quản lý đơn hàng, sản phẩm, voucher cho admin
- Áp dụng kiến trúc Clean Architecture đảm bảo khả năng mở rộng
- Giao diện hiện đại, thân thiện người dùng

### 1.3 Phạm vi

- **Khách hàng:** Đăng ký, đăng nhập, duyệt sản phẩm, lọc/tìm kiếm, giỏ hàng, đặt hàng, đánh giá, tích điểm
- **Admin:** Dashboard thống kê, quản lý sản phẩm/đơn hàng/voucher, xuất báo cáo Excel

---

## 2. CÔNG NGHỆ SỬ DỤNG

### 2.1 Backend

| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| .NET | 9.0 | Framework chính |
| ASP.NET Core Web API | 9.0 | Xây dựng RESTful API |
| Entity Framework Core | 9.0 | ORM - truy xuất dữ liệu |
| SQL Server | 2022 (LocalDB) | Hệ quản trị CSDL |
| JWT Bearer | - | Xác thực người dùng |
| BCrypt.Net | - | Mã hóa mật khẩu |

### 2.2 Frontend

| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| React | 19 | Thư viện giao diện |
| Vite | 8.0 | Build tool & dev server |
| Ant Design | 5 | UI component library |
| Recharts | - | Biểu đồ thống kê |
| Axios | - | HTTP client |
| XLSX / FileSaver | - | Xuất file Excel |

### 2.3 Kiến trúc

- **Clean Architecture (4 layers):** Tách biệt rõ ràng giữa Domain, Application, Infrastructure và API
- **Repository Pattern + Unit of Work:** Quản lý truy xuất dữ liệu
- **DTO Pattern:** Tách biệt model truyền tải và domain entity

---

## 3. KIẾN TRÚC HỆ THỐNG

### 3.1 Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React)                │
│         Home | Products | Cart | Orders          │
│         Profile | Admin Dashboard                │
└───────────────────┬─────────────────────────────┘
                    │ HTTP/REST (Axios)
                    ▼
┌─────────────────────────────────────────────────┐
│              API Layer (ASP.NET Core)             │
│    Controllers: Auth, Products, Cart, Orders,    │
│    Reviews, Payment, Loyalty, Vouchers, Admin    │
├─────────────────────────────────────────────────┤
│           Application Layer (Services)           │
│    ProductService, OrderService, CartService,    │
│    LoyaltyService, ReviewService, VoucherService,│
│    DashboardService, PaymentService              │
├─────────────────────────────────────────────────┤
│              Domain Layer (Entities)             │
│    User, Product, Category, Order, OrderDetail,  │
│    CartItem, Review, Voucher, LoyaltyPoint       │
├─────────────────────────────────────────────────┤
│         Infrastructure Layer (EF Core)           │
│    DbContext, Repositories, Migrations, Seed     │
└───────────────────┬─────────────────────────────┘
                    │ Entity Framework Core
                    ▼
┌─────────────────────────────────────────────────┐
│            SQL Server (LocalDB)                  │
│    Users, Products, Categories, Orders,          │
│    Reviews, Vouchers, LoyaltyPoints, CartItems   │
└─────────────────────────────────────────────────┘
```

### 3.2 Luồng xử lý (Request Flow)

1. **Client** gửi HTTP request (kèm JWT token nếu cần auth)
2. **Controller** nhận request, validate input
3. **Service** (Application layer) xử lý business logic
4. **Repository** (Infrastructure) truy xuất/cập nhật database
5. **Response** trả về client dạng JSON (ApiResponse wrapper)

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN

```
TechnoStore/
├── src/
│   ├── TechnoStore.API/                    # Web API Layer
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs           # Đăng ký, đăng nhập, profile
│   │   │   ├── ProductsController.cs       # CRUD sản phẩm
│   │   │   ├── CartController.cs           # Giỏ hàng
│   │   │   ├── OrdersController.cs         # Đơn hàng
│   │   │   ├── ReviewsController.cs        # Đánh giá sản phẩm
│   │   │   ├── VouchersController.cs       # Voucher giảm giá
│   │   │   ├── LoyaltyController.cs        # Tích điểm thành viên
│   │   │   ├── PaymentController.cs        # Thanh toán
│   │   │   └── AdminDashboardController.cs # Dashboard admin
│   │   ├── Program.cs                      # DI, CORS, JWT config
│   │   └── appsettings.json                # Connection string, JWT key
│   │
│   ├── TechnoStore.Application/            # Business Logic Layer
│   │   ├── DTOs/                           # Data Transfer Objects
│   │   │   ├── Auth/                       # LoginDto, RegisterDto
│   │   │   ├── Product/                    # ProductDto, CreateProductDto
│   │   │   ├── Cart/                       # CartDto, AddToCartDto
│   │   │   ├── Order/                      # OrderDto, CreateOrderDto
│   │   │   ├── Review/                     # ReviewDto, CreateReviewDto
│   │   │   ├── Voucher/                    # VoucherDto, CreateVoucherDto
│   │   │   ├── Loyalty/                    # LoyaltyPointDto
│   │   │   └── Dashboard/                  # DashboardOverviewDto
│   │   ├── Interfaces/                     # Service contracts
│   │   ├── Services/                       # Service implementations
│   │   └── Common/                         # ApiResponse wrapper
│   │
│   ├── TechnoStore.Domain/                 # Domain Layer
│   │   ├── Entities/                       # Domain models
│   │   │   ├── User.cs
│   │   │   ├── Product.cs
│   │   │   ├── Category.cs
│   │   │   ├── Order.cs & OrderDetail.cs
│   │   │   ├── CartItem.cs
│   │   │   ├── Review.cs
│   │   │   ├── Voucher.cs & VoucherUsage.cs
│   │   │   └── LoyaltyPoint.cs
│   │   ├── Enums/                          # OrderStatus, PaymentMethod
│   │   └── Interfaces/                     # IRepository, IUnitOfWork
│   │
│   └── TechnoStore.Infrastructure/         # Infrastructure Layer
│       ├── Data/
│       │   ├── TechnoStoreDbContext.cs      # EF Core DbContext
│       │   └── SeedData.cs                 # Dữ liệu khởi tạo
│       ├── Repositories/                   # Generic Repository
│       └── DependencyInjection.cs          # Đăng ký DI
│
├── frontend/                               # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                  # Navigation bar + search
│   │   │   └── ErrorBoundary.jsx           # Error handling
│   │   ├── context/
│   │   │   └── AuthContext.jsx             # JWT auth state
│   │   ├── pages/
│   │   │   ├── Home.jsx                    # Trang chủ
│   │   │   ├── Products.jsx                # Danh sách SP + lọc brand
│   │   │   ├── ProductDetail.jsx           # Chi tiết SP + specs + reviews
│   │   │   ├── Cart.jsx                    # Giỏ hàng
│   │   │   ├── Orders.jsx                  # Lịch sử đơn hàng
│   │   │   ├── Profile.jsx                 # Hồ sơ + loyalty
│   │   │   ├── Login.jsx                   # Đăng nhập
│   │   │   ├── Register.jsx                # Đăng ký
│   │   │   ├── AdminDashboard.jsx          # Admin panel
│   │   │   └── NotFound.jsx                # 404
│   │   ├── api.js                          # Axios API layer
│   │   ├── utils.js                        # Format helpers
│   │   ├── productImages.js                # SVG image generator
│   │   └── index.css                       # Design system
│   └── package.json
│
├── seed_data.sql                           # Dữ liệu demo mở rộng
└── README.md                               # Tài liệu dự án
```

---

## 5. CHỨC NĂNG CHÍNH

### 5.1 Phân hệ Khách hàng

#### 5.1.1 Đăng ký / Đăng nhập
- Đăng ký tài khoản với họ tên, email, mật khẩu, SĐT, địa chỉ
- Đăng nhập bằng email + mật khẩu
- Xác thực bằng JWT Bearer Token
- Mật khẩu mã hóa BCrypt
- Phân quyền: Customer / Admin

#### 5.1.2 Xem & Tìm kiếm Sản phẩm
- Danh sách sản phẩm với phân trang
- Tìm kiếm theo tên sản phẩm (header search bar)
- Lọc theo **danh mục** (Smartphone / Laptop)
- Lọc theo **thương hiệu** (Samsung, Apple, Xiaomi, OPPO, ASUS, Dell, Lenovo, HP)
- Lọc theo **khoảng giá** (Dưới 5 triệu, 5-10 triệu, 10-20 triệu, Trên 20 triệu)
- Sắp xếp (Mới nhất, Giá thấp → cao, Giá cao → thấp)
- Hiển thị tag lọc đang áp dụng

#### 5.1.3 Chi tiết Sản phẩm
- Breadcrumb navigation (Trang chủ > Sản phẩm > Danh mục > Tên SP)
- Ảnh sản phẩm từ URL thật (cellphones.com.vn CDN)
- Category & Brand tags
- Highlight badges (5G, Chính hãng 100%, Trả góp 0%, Bảo hành 12 tháng)
- **Bảng thông số kỹ thuật** tự động parse từ tên + mô tả sản phẩm
- Tính trả góp 12 tháng
- Mini policy cards (Bảo hành, Giao hàng, Đổi trả, Tích điểm)
- **4 tabs:** Thông số kỹ thuật | Mô tả chi tiết | Đánh giá (reviews) | Chính sách
- Biểu đồ phân bổ rating (5★ → 1★)
- Sản phẩm liên quan (4 SP cùng danh mục)

#### 5.1.4 Giỏ hàng
- Thêm sản phẩm vào giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- Hiển thị tạm tính + tổng thanh toán
- Áp dụng mã voucher giảm giá
- Badge số lượng giỏ hàng trên header

#### 5.1.5 Đặt hàng
- Form thông tin giao hàng (tên, SĐT, địa chỉ, ghi chú)
- Phương thức thanh toán: COD / Chuyển khoản ngân hàng
- Áp mã voucher giảm giá
- Tự động tính ưu đãi thành viên

#### 5.1.6 Quản lý Đơn hàng
- Danh sách đơn hàng với status tracker (Pending → Confirmed → Shipping → Delivered → Completed)
- Hiển thị chi tiết đơn (sản phẩm, số lượng, giá, voucher)
- Hủy đơn (khi status = Pending)
- Thanh toán chuyển khoản (popup thông tin ngân hàng)

#### 5.1.7 Đánh giá Sản phẩm
- Đánh giá 1-5 sao + bình luận
- Xem đánh giá của người mua khác
- Biểu đồ phân bổ điểm đánh giá

#### 5.1.8 Tích điểm Khách hàng thân thiết (Loyalty)
- Mỗi 100,000₫ = 1 điểm
- 4 hạng: Bronze (0đ) → Silver (500đ) → Gold (2000đ) → Diamond (5000đ)
- Ưu đãi theo hạng: Silver -2%, Gold -5%, Diamond -10%
- Lịch sử tích/đổi điểm
- Progress bar lên hạng tiếp theo

#### 5.1.9 Hồ sơ cá nhân
- Xem thông tin tài khoản
- Chỉnh sửa họ tên, SĐT, địa chỉ
- Card loyalty (hạng, tổng điểm, ưu đãi)

---

### 5.2 Phân hệ Admin

#### 5.2.1 Dashboard tổng quan
- Thẻ thống kê: Doanh thu, Đơn hàng, Khách hàng, Sản phẩm, Đơn chờ xử lý
- **Biểu đồ cột:** Doanh thu theo ngày (10 ngày gần nhất)
- **Biểu đồ tròn:** Phân bổ trạng thái đơn hàng

#### 5.2.2 Quản lý Đơn hàng
- Bảng đơn hàng (mã, KH, tổng tiền, PTTT, trạng thái, ngày)
- Cập nhật trạng thái: Pending → Confirmed → Shipping → Delivered → Completed
- Phân trang
- **Xuất Excel** danh sách đơn hàng

#### 5.2.3 Quản lý Sản phẩm (CRUD)
- Bảng sản phẩm (tên, hãng, danh mục, giá, kho)
- Thêm mới sản phẩm (tên, hãng, mô tả, giá, số lượng, ảnh URL, danh mục)
- Sửa thông tin sản phẩm
- Xóa sản phẩm (soft delete)
- **Xuất Excel** danh sách sản phẩm

#### 5.2.4 Quản lý Voucher (CRUD)
- Bảng voucher (mã, giảm giá, loại, thời hạn, đã dùng)
- Tạo voucher mới (mã, loại giảm %, giá trị, đơn tối thiểu, giảm tối đa, giới hạn, thời hạn)
- Sửa voucher
- Xóa voucher

#### 5.2.5 Thống kê Loyalty
- Tổng thành viên theo hạng
- Tổng điểm đã phát / đã đổi
- Bảng chi tiết thành viên

---

## 6. THIẾT KẾ CƠ SỞ DỮ LIỆU

### 6.1 Danh sách bảng

| STT | Tên bảng | Mô tả |
|-----|----------|-------|
| 1 | Users | Người dùng (Admin/Customer) |
| 2 | Categories | Danh mục sản phẩm |
| 3 | Products | Sản phẩm |
| 4 | CartItems | Giỏ hàng |
| 5 | Orders | Đơn hàng |
| 6 | OrderDetails | Chi tiết đơn hàng |
| 7 | Reviews | Đánh giá sản phẩm |
| 8 | Vouchers | Mã giảm giá |
| 9 | VoucherUsages | Lịch sử dùng voucher |
| 10 | LoyaltyPoints | Lịch sử tích/đổi điểm |

### 6.2 Chi tiết các bảng

#### Users
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| Id | int (PK) | Mã người dùng |
| FullName | nvarchar(100) | Họ tên |
| Email | nvarchar(256) | Email (unique) |
| PasswordHash | nvarchar(max) | Mật khẩu mã hóa BCrypt |
| Phone | nvarchar(20) | Số điện thoại |
| Address | nvarchar(500) | Địa chỉ |
| Role | nvarchar(20) | Vai trò: Admin / Customer |
| MembershipTier | nvarchar(20) | Hạng: Bronze/Silver/Gold/Diamond |
| TotalPoints | int | Tổng điểm tích lũy |
| IsActive | bit | Trạng thái hoạt động |
| CreatedAt | datetime2 | Ngày tạo |

#### Products
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| Id | int (PK) | Mã sản phẩm |
| Name | nvarchar(200) | Tên sản phẩm |
| Brand | nvarchar(100) | Thương hiệu |
| Description | nvarchar(max) | Mô tả |
| Price | decimal(18,2) | Giá |
| StockQuantity | int | Số lượng tồn kho |
| ImageUrl | nvarchar(500) | Link ảnh |
| CategoryId | int (FK) | Danh mục |
| IsActive | bit | Trạng thái |
| CreatedAt | datetime2 | Ngày tạo |

#### Orders
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| Id | int (PK) | Mã đơn hàng |
| OrderCode | nvarchar(50) | Mã đơn (VD: TS-20260421-001) |
| UserId | int (FK) | Người đặt |
| TotalAmount | decimal(18,2) | Tổng tiền gốc |
| DiscountAmount | decimal(18,2) | Giảm giá voucher |
| MemberDiscount | decimal(18,2) | Ưu đãi thành viên |
| FinalAmount | decimal(18,2) | Tổng thanh toán |
| Status | nvarchar(20) | Trạng thái đơn |
| PaymentMethod | nvarchar(20) | COD / BankTransfer |
| PaymentStatus | nvarchar(20) | Paid / Pending |
| ShippingAddress | nvarchar(500) | Địa chỉ giao |
| ReceiverName | nvarchar(100) | Tên người nhận |
| ReceiverPhone | nvarchar(20) | SĐT người nhận |
| VoucherCode | nvarchar(50) | Mã voucher (nullable) |
| PointsEarned | int | Điểm nhận được |
| Note | nvarchar(500) | Ghi chú |
| CreatedAt | datetime2 | Ngày tạo |
| UpdatedAt | datetime2 | Ngày cập nhật |

#### Reviews
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| Id | int (PK) | Mã đánh giá |
| ProductId | int (FK) | Sản phẩm |
| UserId | int (FK) | Người đánh giá |
| Rating | int | Số sao (1-5) |
| Comment | nvarchar(max) | Nội dung bình luận |
| IsActive | bit | Trạng thái |
| CreatedAt | datetime2 | Ngày tạo |

#### Vouchers
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| Id | int (PK) | Mã voucher |
| Code | nvarchar(50) | Mã code (unique) |
| Description | nvarchar(200) | Mô tả |
| DiscountType | nvarchar(20) | Percent / Fixed |
| DiscountValue | decimal(18,2) | Giá trị giảm |
| MinOrderAmount | decimal(18,2) | Đơn tối thiểu |
| MaxDiscountAmount | decimal(18,2) | Giảm tối đa |
| UsageLimit | int | Giới hạn sử dụng |
| UsedCount | int | Đã sử dụng |
| PointsCost | int | Điểm cần đổi (nullable) |
| StartDate | datetime2 | Ngày bắt đầu |
| EndDate | datetime2 | Ngày kết thúc |
| IsActive | bit | Trạng thái |

#### LoyaltyPoints
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| Id | int (PK) | Mã bản ghi |
| UserId | int (FK) | Người dùng |
| Points | int | Số điểm (+earned / -redeemed) |
| Type | nvarchar(20) | Earned / Redeemed |
| Description | nvarchar(200) | Mô tả |
| OrderId | int (FK, nullable) | Đơn hàng liên quan |
| CreatedAt | datetime2 | Ngày tạo |

### 6.3 Dữ liệu demo (Seed Data)

| Dữ liệu | Số lượng | Chi tiết |
|----------|----------|----------|
| Users | 6 | 1 Admin + 5 Customers |
| Categories | 2 | Smartphone, Laptop |
| Products | 24 | 12 Smartphone + 12 Laptop, 8 thương hiệu |
| Orders | 18 | 10 Completed, 2 Pending, 2 Shipping, 1 Confirmed, 1 Delivered, 2 Cancelled |
| Reviews | 25 | Đánh giá 4-5 sao, phủ cả smartphone & laptop |
| Vouchers | 3 | SALE15 (15%), SALE25 (25%), SALE35 (35%) |
| LoyaltyPoints | 11 | 9 Earned + 2 Redeemed |

---

## 7. GIAO DIỆN HỆ THỐNG

### 7.1 Trang chủ
- Hero banner với call-to-action
- Voucher đang có
- Feature highlights (Giao hàng nhanh, Chính hãng, Hỗ trợ 24/7, Tích điểm)
- Sản phẩm nổi bật (8 sản phẩm)

### 7.2 Danh sách sản phẩm
- Grid sản phẩm responsive
- Bộ lọc: Danh mục, Thương hiệu, Khoảng giá, Sắp xếp
- Tags lọc đang áp dụng (click để xóa)
- Badges: Hết hàng, Sắp hết, Premium
- Phân trang

### 7.3 Chi tiết sản phẩm
- Layout 2 cột: Ảnh (trái) + Thông tin (phải)
- Breadcrumb navigation
- Tags thương hiệu + danh mục
- Highlight badges
- Bảng thông số kỹ thuật tự động
- 4 tabs thông tin
- Sản phẩm liên quan

### 7.4 Giỏ hàng
- Danh sách sản phẩm với ảnh, giá, số lượng
- Form checkout (thông tin giao hàng + PTTT)
- Voucher input
- Tóm tắt thanh toán

### 7.5 Admin Dashboard
- 5 thẻ thống kê (Doanh thu, Đơn hàng, Chờ xử lý, Sản phẩm, Khách hàng)
- Biểu đồ cột doanh thu theo ngày
- Biểu đồ tròn trạng thái đơn hàng
- 5 tabs: Tổng quan | Đơn hàng | Sản phẩm | Voucher | Loyalty

---

## 8. HƯỚNG DẪN CÀI ĐẶT & CHẠY

### 8.1 Yêu cầu hệ thống
- .NET 9 SDK
- Node.js 18+
- SQL Server (LocalDB hoặc full)

### 8.2 Cài đặt

```bash
# Clone repository
git clone https://github.com/sylarbear/asp.net-doancuoimon.git
cd asp.net-doancuoimon
```

### 8.3 Chạy Backend

```bash
# Database tự động tạo (Code-First Migration)
dotnet run --project src/TechnoStore.API
# API chạy tại: http://localhost:5246
```

### 8.4 Chạy Frontend

```bash
cd frontend
npm install
npm run dev
# App chạy tại: http://localhost:5173
```

### 8.5 Chạy Seed Data mở rộng (tùy chọn)

```bash
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TechnoStoreDb -i seed_data.sql -f 65001
```

### 8.6 Tài khoản mặc định

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@technostore.com | Admin@123 |
| Customer | customer@technostore.com | Customer@123 |

---

## 9. KIỂM THỬ

### 9.1 Kết quả kiểm thử chức năng

| STT | Chức năng | Kết quả | Ghi chú |
|-----|-----------|---------|---------|
| 1 | Đăng ký tài khoản | ✅ PASS | Validate email, password min 6 ký tự |
| 2 | Đăng nhập | ✅ PASS | JWT token, role-based redirect |
| 3 | Xem sản phẩm | ✅ PASS | Phân trang, hình ảnh từ URL thật |
| 4 | Lọc theo thương hiệu | ✅ PASS | 8 brands, active filter tags |
| 5 | Chi tiết sản phẩm | ✅ PASS | Specs auto-parse, 4 tabs |
| 6 | Thêm giỏ hàng | ✅ PASS | Kiểm tra tồn kho |
| 7 | Đặt hàng COD | ✅ PASS | Tự sinh mã đơn |
| 8 | Đặt hàng CK | ✅ PASS | Hiển thị info ngân hàng |
| 9 | Áp voucher | ✅ PASS | Validate min order, max discount |
| 10 | Đánh giá SP | ✅ PASS | 1-5 sao + bình luận |
| 11 | Tích điểm | ✅ PASS | Auto-upgrade tier |
| 12 | Admin Dashboard | ✅ PASS | Charts, stats hiển thị đúng |
| 13 | Admin CRUD SP | ✅ PASS | Thêm/sửa/xóa |
| 14 | Admin CRUD Voucher | ✅ PASS | Thêm/sửa/xóa |
| 15 | Admin cập nhật TT đơn | ✅ PASS | Workflow status |
| 16 | Xuất Excel | ✅ PASS | File .xlsx đúng format |
| 17 | Responsive | ✅ PASS | Desktop, tablet, mobile |
| 18 | Encoding tiếng Việt | ✅ PASS | Hiển thị đúng dấu |

### 9.2 API Endpoints đã kiểm thử

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/login | Đăng nhập |
| POST | /api/auth/register | Đăng ký |
| GET | /api/auth/profile | Thông tin cá nhân |
| PUT | /api/auth/profile | Cập nhật profile |
| GET | /api/products | Danh sách SP (phân trang) |
| GET | /api/products/{id} | Chi tiết SP |
| POST | /api/products | Thêm SP (Admin) |
| PUT | /api/products/{id} | Sửa SP (Admin) |
| DELETE | /api/products/{id} | Xóa SP (Admin) |
| GET | /api/categories | Danh mục |
| GET/POST/PUT/DELETE | /api/cart | Giỏ hàng CRUD |
| GET/POST | /api/orders | Đơn hàng |
| PUT | /api/orders/{id}/status | Admin: cập nhật TT |
| PUT | /api/orders/{id}/cancel | Hủy đơn |
| GET | /api/products/{id}/reviews | Đánh giá SP |
| POST | /api/products/{id}/reviews | Tạo đánh giá |
| GET | /api/vouchers/available | Voucher khả dụng |
| POST | /api/vouchers/validate | Kiểm tra voucher |
| GET | /api/loyalty/my-points | Điểm tích lũy |
| GET | /api/loyalty/history | Lịch sử điểm |
| GET | /api/admin/dashboard/overview | Dashboard tổng quan |

---

## 10. KẾT LUẬN

### 10.1 Kết quả đạt được

- Xây dựng thành công hệ thống e-commerce hoàn chỉnh với kiến trúc Clean Architecture
- Tích hợp đầy đủ các tính năng: quản lý sản phẩm, giỏ hàng, đơn hàng, đánh giá, voucher, loyalty
- Giao diện hiện đại, responsive, trải nghiệm người dùng tốt
- Admin dashboard với biểu đồ thống kê trực quan
- Bảo mật với JWT + BCrypt
- Code sạch, dễ bảo trì nhờ Clean Architecture

### 10.2 Hạn chế

- Chưa tích hợp thanh toán tự động (VNPay, MoMo)
- Chưa có chức năng chat/hỗ trợ trực tuyến
- Chưa tối ưu SEO cho frontend (SPA)
- Chưa deploy lên server production

### 10.3 Hướng phát triển

- Tích hợp cổng thanh toán VNPay / MoMo
- Thêm chức năng wishlist (sản phẩm yêu thích)
- Real-time notifications (SignalR)
- Deploy lên Azure / AWS
- Mobile app (React Native)
