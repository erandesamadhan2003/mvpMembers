using Microsoft.EntityFrameworkCore;

namespace mvpMembers.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    
}