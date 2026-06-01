using Microsoft.EntityFrameworkCore;
using mvpMembers.Infrastructure.Persistence;
using mvpMembers.API.Extensions;
using mvpMembers.API.Properties;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddRedis(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddJwtAuthentication(builder.Configuration);

var app = builder.Build();
app.ApplyMigrations();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => "MVP Members API is running!");

app.Run();