using Microsoft.EntityFrameworkCore;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.API.Extensions;

public static class MigrationExtension
{
    public static WebApplication ApplyMigrations(this WebApplication app)
    { 
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        Console.WriteLine("Database migrated successfully.");
        return app;
    }
}