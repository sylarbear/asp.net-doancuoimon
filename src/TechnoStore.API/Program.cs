using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TechnoStore.API.Middleware;
using TechnoStore.Application.Interfaces;
using TechnoStore.Application.Services;
using TechnoStore.Infrastructure;
using TechnoStore.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// ===== PORT for Render =====
var port = Environment.GetEnvironmentVariable("PORT") ?? "5246";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ===== INFRASTRUCTURE (DB + JWT + Repositories) =====
builder.Services.AddInfrastructure(builder.Configuration);

// ===== APPLICATION SERVICES =====
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// ===== CONTROLLERS =====
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// ===== SWAGGER =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TechnoStore API",
        Version = "v1",
        Description = "API Hệ thống bán Smartphone & Laptop trực tuyến - Đồ án cuối môn ASP.NET Core"
    });

    // JWT Authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập JWT token. Ví dụ: eyJhbGciOiJIUzI1NiIs..."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ===== AUTO MIGRATE + SEED =====
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TechnoStoreDbContext>();
    var connStr = builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
    if (connStr.Contains(".db"))
    {
        // SQLite: use EnsureCreated (migrations are SQL Server specific)
        db.Database.EnsureCreated();
    }
    else
    {
        // SQL Server: use Migrate
        db.Database.Migrate();
    }
    SeedData.Initialize(db);
}

// ===== MIDDLEWARE PIPELINE =====

// Global Exception Handler
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Swagger (always enabled for demo)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TechnoStore API v1");
    c.RoutePrefix = string.Empty; // Swagger at root URL
});

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

