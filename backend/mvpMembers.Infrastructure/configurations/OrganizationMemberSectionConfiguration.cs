using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Configurations;

public class OrganizationMemberSectionConfiguration: IEntityTypeConfiguration<OrganizationMemberSection>
{
    public void Configure(EntityTypeBuilder<OrganizationMemberSection> builder)
    {
        builder.ToTable("OrganizationMemberSection");
        builder.HasKey(x => x.MemberSectionID);
        builder.Property(x => x.MemberSectionID).UseIdentityColumn(1, 1);
        builder.Property(x => x.MemberSectionName).HasMaxLength(50).IsRequired();
    }
}