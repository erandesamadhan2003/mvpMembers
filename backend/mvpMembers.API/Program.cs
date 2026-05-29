using Microsoft.EntityFrameworkCore;
using mvpMembers.Infrastructure.Persistence;
using mvpMembers.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddRedis(builder.Configuration);

var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

//     try
//     {
//         db.Database.CanConnect();
//         Console.WriteLine("Database connection successful.");
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Database connection failed: {ex.Message}");
//     }
// }

// using (var scope = app.Services.CreateScope())
// {
//     var redis = scope.ServiceProvider.GetRequiredService<StackExchange.Redis.IConnectionMultiplexer>();

//     try
//     {
//         var db = redis.GetDatabase();
//         db.StringSet("TestKey", "TestValue");
//         var value = db.StringGet("TestKey");
//         Console.WriteLine($"Redis connection successful. TestKey: {value}");
//         db.KeyDelete("TestKey");
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Redis connection failed: {ex.Message}");
//     }
// }

app.ApplyMigrations();

app.MapGet("/", () => "MVP Members API is running!");

app.Run();