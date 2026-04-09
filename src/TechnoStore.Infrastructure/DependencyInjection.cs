using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Interfaces;
using TechnoStore.Infrastructure.Authentication;
using TechnoStore.Infrastructure.Data;
using TechnoStore.Infrastructure.Repositories;

namespace TechnoStore.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services, IConfiguration configuration)
        {
            // Database - SQLite for production (Render), SQL Server for development
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            if (connectionString != null && connectionString.Contains("Data Source=") && connectionString.Contains(".db"))
            {
                services.AddDbContext<TechnoStoreDbContext>(options =>
                    options.UseSqlite(connectionString));
            }
            else
            {
                services.AddDbContext<TechnoStoreDbContext>(options =>
                    options.UseSqlServer(connectionString));
            }

            // Repositories
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // JWT
            services.AddScoped<IJwtTokenService, JwtTokenService>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!))
                };
            });

            return services;
        }
    }
}
