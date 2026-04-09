# 🛒 TechnoStore API

**Hệ thống bán hàng Smartphone & Laptop trực tuyến**  
Đồ án cuối môn ASP.NET Core Web API

---

## 🔗 Link Demo & Source Code

| | Link |
|---|---|
| **🌐 API Live (Swagger UI)** | https://technostore-api.onrender.com |
| **📦 GitHub Source Code** | https://github.com/sylarbear/asp.net-doancuoimon |

## 🔐 Tài khoản test

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@technostore.com | Admin@123 |
| Customer | customer@technostore.com | Customer@123 |

## 🚀 Chạy trên localhost

```bash
dotnet run --project src/TechnoStore.API
# Mở trình duyệt: http://localhost:5246
```

## 📋 Tổng quan

- **31 API endpoints** (Auth, Products, Cart, Orders, Dashboard)
- **Clean Architecture** 4 layers
- **JWT Authentication** + Role-based Authorization
- **Entity Framework Core 9** + SQL Server / SQLite
- **24 sản phẩm** mẫu (12 smartphone + 12 laptop)

## 🛠 Công nghệ

- ASP.NET Core 9
- Entity Framework Core 9
- SQL Server LocalDB / SQLite
- JWT Bearer Authentication
- BCrypt.Net (mã hóa mật khẩu)
- Swagger / Swashbuckle
- Docker (deploy trên Render.com)
