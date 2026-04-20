# 🛒 TechnoStore — E-Commerce Platform

> Hệ thống bán hàng công nghệ trực tuyến với tích điểm đổi voucher

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5-0170FE?logo=antdesign)](https://ant.design/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver)](https://www.microsoft.com/en-us/sql-server)

## 📋 Giới thiệu

TechnoStore là nền tảng thương mại điện tử chuyên bán điện thoại & laptop, được xây dựng với kiến trúc **Clean Architecture**. Hệ thống bao gồm đầy đủ tính năng quản lý sản phẩm, giỏ hàng, đơn hàng, chương trình khách hàng thân thiết (Loyalty), và thanh toán chuyển khoản ngân hàng.

## ✨ Tính năng chính

### 👤 Khách hàng
- 🔐 Đăng ký / Đăng nhập (JWT Authentication)
- 📱 Xem sản phẩm, tìm kiếm, lọc theo thương hiệu & danh mục
- 🛒 Giỏ hàng (thêm, sửa số lượng, xóa)
- 📋 Đặt hàng (COD / Chuyển khoản)
- ⭐ Đánh giá sản phẩm (1-5 sao + bình luận)
- 🎫 Áp dụng voucher giảm giá
- 🏆 Tích điểm thành viên (Bronze → Silver → Gold → Diamond)
- 👤 Xem & chỉnh sửa hồ sơ cá nhân

### 🔧 Quản trị viên (Admin)
- 📊 Dashboard tổng quan (doanh thu, đơn hàng, khách hàng)
- 💰 Biểu đồ doanh thu theo ngày + Pie chart trạng thái đơn
- 📋 Quản lý đơn hàng (cập nhật trạng thái: Pending → Confirmed → Shipping → Delivered → Completed)
- 📦 CRUD Sản phẩm (thêm, sửa, xóa)
- 🎫 CRUD Voucher (tạo, sửa, xóa voucher giảm giá)
- 🏆 Thống kê Loyalty (thành viên theo tier, điểm phát/đổi)
- 📥 Xuất Excel (đơn hàng, sản phẩm)

## 🏗️ Kiến trúc

```
TechnoStore/
├── src/
│   ├── TechnoStore.API/            # Web API (ASP.NET Core)
│   ├── TechnoStore.Application/    # Business Logic & DTOs
│   ├── TechnoStore.Domain/         # Entities & Interfaces
│   └── TechnoStore.Infrastructure/ # EF Core & Data Access
└── frontend/                       # React SPA (Vite)
    ├── src/
    │   ├── components/             # Header, ErrorBoundary
    │   ├── context/                # AuthContext (JWT)
    │   ├── pages/                  # Home, Products, Cart, Orders, Profile, Admin
    │   └── productImages.js        # SVG Image Generator
    └── package.json
```

## 🛠️ Công nghệ sử dụng

| Layer | Công nghệ |
|-------|----------|
| **Backend** | .NET 9, ASP.NET Core Web API, Entity Framework Core 9 |
| **Frontend** | React 19, Vite, Ant Design 5, Recharts |
| **Database** | SQL Server 2022 (LocalDB) |
| **Auth** | JWT Bearer Token, BCrypt password hashing |
| **Architecture** | Clean Architecture (4 layers) |

## 🚀 Hướng dẫn cài đặt

### Yêu cầu
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (hoặc LocalDB)

### 1. Clone & cài đặt

```bash
git clone https://github.com/sylarbear/asp.net-doancuoimon.git
cd asp.net-doancuoimon
```

### 2. Chạy Backend

```bash
# Database sẽ tự động được tạo (Code-First Migration)
dotnet run --project src/TechnoStore.API
# API chạy tại: http://localhost:5246
```

### 3. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
# App chạy tại: http://localhost:5173
```

### 4. Tài khoản mặc định

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@technostore.com | Admin@123 |
| **Customer** | customer@technostore.com | Customer@123 |

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| GET | `/api/products` | Danh sách sản phẩm |
| GET | `/api/products/{id}` | Chi tiết sản phẩm |
| GET/POST/PUT/DELETE | `/api/cart` | Giỏ hàng CRUD |
| GET/POST | `/api/orders` | Đơn hàng |
| PUT | `/api/orders/{id}/status` | Admin: cập nhật trạng thái |
| GET | `/api/vouchers/available` | Voucher đang có |
| POST | `/api/vouchers/validate` | Kiểm tra voucher |
| GET | `/api/loyalty/my-points` | Điểm tích lũy |
| GET | `/api/admin/dashboard/overview` | Admin: tổng quan |

## 👨‍💻 Tác giả

- **Sinh viên**: [Tên sinh viên]
- **MSSV**: [Mã số sinh viên]
- **Môn học**: Đồ án cuối môn ASP.NET
- **Năm**: 2026
