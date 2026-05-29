using Microsoft.EntityFrameworkCore;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.API.Extensions;

public static class DatabaseExtension
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext> (options => options.UseSqlServer(
            configuration.GetConnectionString("DefaultConnection")
        ));
        return services;
    }

}