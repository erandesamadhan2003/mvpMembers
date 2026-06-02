using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Repositories;

public interface IOrganizationMemberDocumentRepository
{
    Task AddAsync(OrganizationMemberDocument organizationMemberDocument);
    Task UpdateAsync(OrganizationMemberDocument organizationMemberDocument);
    Task DeleteAsync(OrganizationMemberDocument organizationMemberDocument);
    Task<OrganizationMemberDocument?> GetByIdAsync(long id);
    Task<List<OrganizationMemberDocument>> GetAllAsync();
    Task<OrganizationMemberDocument?> GetByMemberIdAsync(long memberId);
}
