using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Configurations;

public class OrganizationMemberDocumentConfiguration: IEntityTypeConfiguration<OrganizationMemberDocument>
{
    public void Configure(EntityTypeBuilder<OrganizationMemberDocument> builder)
    {
        builder.ToTable("OrganizationMemberDocument");
        builder.HasKey(x => x.OrganizationMemberDocumentID);
        builder.HasOne(x => x.OrganizationMember).WithMany().HasForeignKey(x => x.OrganizationMemberID);
    }
}