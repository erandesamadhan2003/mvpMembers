using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Configurations;

public class OrganizationMemberSubTownConfiguration : IEntityTypeConfiguration<OrganisationMemberSubTown>
{
    public void Configure(EntityTypeBuilder<OrganisationMemberSubTown> builder)
    {
        builder.ToTable("OrganizationMemberSubTown");
        builder.HasKey(x => x.OrganisationMemberSubTownID);
        builder.Property(x => x.OrganisationMemberSubTownID).UseIdentityColumn(1, 1);
        builder.Property(x => x.SubTownID).ValueGeneratedNever();
        builder.Property(x => x.SubTownName).HasMaxLength(50).IsRequired();
        builder.HasOne(x => x.OrganizationMemberCenter).WithMany().HasForeignKey(x => x.OrganizationMemberCenterID).OnDelete(DeleteBehavior.Restrict);
    }
}