using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Configurations;

public class OrganizationMemberTownConfiguration : IEntityTypeConfiguration<OrganizationMemberTown>
{
    public void Configure(EntityTypeBuilder<OrganizationMemberTown> builder)
    {
        builder.ToTable("OrganizationMemberTown");
        builder.HasKey(x => x.OrganizationMemberTownID);
        builder.Property(x => x.TownName).HasMaxLength(50).IsRequired();
    }
}