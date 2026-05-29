using StackExchange.Redis;
namespace mvpMembers.API.Extensions;

public static class RedisExtensions
{
    public static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        var redisConnection = configuration["Redis:ConnectionString"];

        services.AddSingleton<IConnectionMultiplexer>
        (
            ConnectionMultiplexer.Connect(redisConnection!)
        );

        return services;
    }
}