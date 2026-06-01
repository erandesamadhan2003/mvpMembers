using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Configurations;

public class OrgainizationMemberCenterConfiguration: IEntityTypeConfiguration<OrganizationMemberCenter>
{
    public void Configure(EntityTypeBuilder<OrganizationMemberCenter> builder)
    {
        builder.ToTable("OrganizationMemberCenter");
        builder.HasKey(x => x.OrganizationMemberCenterID);
        builder.Property(x => x.CenterID).HasMaxLength(50).IsRequired();
        builder.Property(x => x.CenterName).HasMaxLength(50).IsRequired();
        builder.HasOne(x => x.OrganizationMemberTown).WithMany().HasForeignKey(x => x.OrganizationMemberTownID);
    }
}