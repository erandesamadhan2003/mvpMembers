using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Infrastructure.Services;

namespace mvpMembers.API.Extensions;

public static class ServiceExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<OTPService>();
        services.AddScoped<IJwtService, JwtService>();
        return services;
    }
}