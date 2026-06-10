using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Configurations;

public class OrganizationMemberConfiguration: IEntityTypeConfiguration<OrganizationMember>
{
    public void Configure(EntityTypeBuilder<OrganizationMember> builder)
    {
        builder.ToTable("OrganizationMember");
        builder.HasKey(x => x.OrganizationMemberID);
        builder.HasOne(x => x.MemberSection).WithMany().HasForeignKey(x => x.MemberSectionID);
        builder.HasOne(x => x.OrganizationMemberCenter).WithMany().HasForeignKey(x => x.OrganizationMemberCenterID);
        builder.HasOne(x => x.TransferOrganizationMember).WithMany().HasForeignKey(x => x.TransferOrganizationMemberID).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.OrganisationMemberSubTown).WithMany().HasForeignKey(x => x.OrganizationMemberSubTownID).OnDelete(DeleteBehavior.Restrict);
    }
}