using System.ComponentModel.DataAnnotations;

namespace TechnoStore.Application.DTOs.Loyalty
{
    public class LoyaltyOverviewDto
    {
        public int TotalPoints { get; set; }
        public string MembershipTier { get; set; } = string.Empty;
        public decimal DiscountPercent { get; set; }
        public int PointsToNextTier { get; set; }
        public string NextTier { get; set; } = string.Empty;
    }

    public class LoyaltyHistoryDto
    {
        public int Id { get; set; }
        public int Points { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class LoyaltyMemberDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
        public string MembershipTier { get; set; } = string.Empty;
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class LoyaltyStatsDto
    {
        public int TotalMembers { get; set; }
        public int BronzeCount { get; set; }
        public int SilverCount { get; set; }
        public int GoldCount { get; set; }
        public int DiamondCount { get; set; }
        public int TotalPointsIssued { get; set; }
        public int TotalPointsRedeemed { get; set; }
    }
}
