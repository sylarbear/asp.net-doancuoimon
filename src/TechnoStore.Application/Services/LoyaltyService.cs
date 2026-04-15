using Microsoft.EntityFrameworkCore;
using TechnoStore.Application.Common;
using TechnoStore.Application.DTOs.Loyalty;
using TechnoStore.Application.Interfaces;
using TechnoStore.Domain.Entities;
using TechnoStore.Domain.Interfaces;

namespace TechnoStore.Application.Services
{
    public class LoyaltyService : ILoyaltyService
    {
        private readonly IAppDbContext _db;

        // Tier thresholds
        private static readonly Dictionary<string, (int min, int max, decimal discount)> Tiers = new()
        {
            ["Bronze"]  = (0, 499, 0m),
            ["Silver"]  = (500, 1999, 2m),
            ["Gold"]    = (2000, 4999, 5m),
            ["Diamond"] = (5000, int.MaxValue, 8m)
        };

        public LoyaltyService(IAppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResponse<LoyaltyOverviewDto>> GetMyPointsAsync(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return ApiResponse<LoyaltyOverviewDto>.ErrorResponse("User not found");

            var tier = Tiers[user.MembershipTier];
            var nextTier = GetNextTier(user.MembershipTier);

            return ApiResponse<LoyaltyOverviewDto>.SuccessResponse(new LoyaltyOverviewDto
            {
                TotalPoints = user.TotalPoints,
                MembershipTier = user.MembershipTier,
                DiscountPercent = tier.discount,
                PointsToNextTier = nextTier.HasValue ? nextTier.Value.min - user.TotalPoints : 0,
                NextTier = nextTier.HasValue ? nextTier.Value.name : "Max"
            });
        }

        public async Task<ApiResponse<List<LoyaltyHistoryDto>>> GetHistoryAsync(int userId)
        {
            var history = await _db.LoyaltyPoints
                .Where(lp => lp.UserId == userId)
                .OrderByDescending(lp => lp.CreatedAt)
                .Select(lp => new LoyaltyHistoryDto
                {
                    Id = lp.Id,
                    Points = lp.Points,
                    Type = lp.Type,
                    Description = lp.Description,
                    CreatedAt = lp.CreatedAt
                })
                .ToListAsync();

            return ApiResponse<List<LoyaltyHistoryDto>>.SuccessResponse(history);
        }

        public async Task<ApiResponse<LoyaltyStatsDto>> GetStatsAsync()
        {
            var customers = await _db.Users.Where(u => u.Role == "Customer").ToListAsync();
            var points = await _db.LoyaltyPoints.ToListAsync();

            return ApiResponse<LoyaltyStatsDto>.SuccessResponse(new LoyaltyStatsDto
            {
                TotalMembers = customers.Count,
                BronzeCount = customers.Count(c => c.MembershipTier == "Bronze"),
                SilverCount = customers.Count(c => c.MembershipTier == "Silver"),
                GoldCount = customers.Count(c => c.MembershipTier == "Gold"),
                DiamondCount = customers.Count(c => c.MembershipTier == "Diamond"),
                TotalPointsIssued = points.Where(p => p.Type == "Earned").Sum(p => p.Points),
                TotalPointsRedeemed = points.Where(p => p.Type == "Redeemed").Sum(p => Math.Abs(p.Points))
            });
        }

        public async Task<ApiResponse<List<LoyaltyMemberDto>>> GetMembersAsync(string? tier)
        {
            var query = _db.Users
                .Where(u => u.Role == "Customer")
                .AsQueryable();

            if (!string.IsNullOrEmpty(tier))
                query = query.Where(u => u.MembershipTier == tier);

            var members = await query
                .Select(u => new LoyaltyMemberDto
                {
                    UserId = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    TotalPoints = u.TotalPoints,
                    MembershipTier = u.MembershipTier,
                    TotalOrders = u.Orders.Count,
                    TotalSpent = u.Orders.Sum(o => o.FinalAmount)
                })
                .OrderByDescending(m => m.TotalPoints)
                .ToListAsync();

            return ApiResponse<List<LoyaltyMemberDto>>.SuccessResponse(members);
        }

        public async Task AddPointsAsync(int userId, int orderId, decimal orderAmount)
        {
            int points = (int)(orderAmount / 100000m);
            if (points <= 0) return;

            _db.LoyaltyPoints.Add(new LoyaltyPoint
            {
                UserId = userId,
                Points = points,
                Type = "Earned",
                Description = $"Tich diem don hang #{orderId}",
                OrderId = orderId,
                CreatedAt = DateTime.UtcNow
            });

            var user = await _db.Users.FindAsync(userId);
            if (user != null)
            {
                user.TotalPoints += points;
            }
            await _db.SaveChangesAsync();
            await UpdateMembershipTierAsync(userId);
        }

        public async Task UpdateMembershipTierAsync(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return;

            var totalEarned = await _db.LoyaltyPoints
                .Where(lp => lp.UserId == userId && lp.Type == "Earned")
                .SumAsync(lp => lp.Points);

            string newTier = "Bronze";
            if (totalEarned >= 5000) newTier = "Diamond";
            else if (totalEarned >= 2000) newTier = "Gold";
            else if (totalEarned >= 500) newTier = "Silver";

            if (user.MembershipTier != newTier)
            {
                user.MembershipTier = newTier;
                await _db.SaveChangesAsync();
            }
        }

        public static decimal GetDiscountPercent(string tier)
        {
            return Tiers.ContainsKey(tier) ? Tiers[tier].discount : 0m;
        }

        private (string name, int min)? GetNextTier(string currentTier)
        {
            return currentTier switch
            {
                "Bronze" => ("Silver", 500),
                "Silver" => ("Gold", 2000),
                "Gold" => ("Diamond", 5000),
                _ => null
            };
        }
    }
}


