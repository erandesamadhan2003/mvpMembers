using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Services;

public interface IOrganizationMemberDocumentService
{
    Task<long> CreateAsync(OrganizationMemberDocument organizationMemberDocument);
    Task UpdateAsync(long id, OrganizationMemberDocument organizationMemberDocument);
    Task DeleteAsync(long id);
    Task<OrganizationMemberDocument?> GetByIdAsync(long id);
    Task<List<OrganizationMemberDocument>> GetAllAsync();
    Task<OrganizationMemberDocument?> GetByMemberIdAsync(long memberId);
}
