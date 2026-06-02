using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Repositories;

public interface IOrganizationMemberCenterRepository
{
    Task AddAsync(OrganizationMemberCenter organizationMemberCenter);
    Task UpdateAsync(OrganizationMemberCenter organizationMemberCenter);
    Task DeleteAsync(OrganizationMemberCenter organizationMemberCenter);
    Task<OrganizationMemberCenter?> GetByIdAsync(long id);
    Task<List<OrganizationMemberCenter>> GetAllAsync();
    Task<List<OrganizationMemberCenter>> GetByTownIdAsync(long townId);
    Task<OrganizationMemberCenter?> GetByCenterIdAsync(string centerId);
}
