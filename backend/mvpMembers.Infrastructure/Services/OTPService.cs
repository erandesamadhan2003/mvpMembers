using StackExchange.Redis;

namespace mvpMembers.Infrastructure.Services;

public class OTPService(IConnectionMultiplexer redis)
{
    private readonly IConnectionMultiplexer _redis = redis;

    public async Task StoreOTPAsync(string email, string otp)
    {
        var db = _redis.GetDatabase();
        await db.StringSetAsync($"OTP:{email}", otp, TimeSpan.FromMinutes(5));
    }

    public async Task<string?> GetOTPAsync(string email)
    {
        var db = _redis.GetDatabase();
        return await db.StringGetAsync($"OTP:{email}");
    }

    public async Task DeleteOTPAsync(string email)
    {
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync(email);
    }
}