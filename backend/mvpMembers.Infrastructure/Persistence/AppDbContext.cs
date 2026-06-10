using Microsoft.EntityFrameworkCore;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<OrganizationMemberTown> OrganizationMemberTowns { get; set; }
    public DbSet<OrganizationMemberSection> OrganizationMemberSections { get; set; }
    public DbSet<OrganizationMemberCenter> OrganizationMemberCenters { get; set; }
    public DbSet<OrganizationMember> OrganizationMembers { get; set; }
    public DbSet<OrganizationMemberDocument> OrganizationMemberDocuments { get; set; }
    public DbSet<OrganisationMemberSubTown> OrganisationMemberSubTowns { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}