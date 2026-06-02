using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Repositories;

public interface IOrganizationMemberSectionRepository
{
    Task AddAsync(OrganizationMemberSection organizationMemberSection);
    Task UpdateAsync(OrganizationMemberSection organizationMemberSection);
    Task DeleteAsync(OrganizationMemberSection organizationMemberSection);
    Task<OrganizationMemberSection?> GetByIdAsync(long id);
    Task<List<OrganizationMemberSection>> GetAllAsync();
}