using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Services;

public interface IOrganizationMemberCenterService
{
    Task<long> CreateAsync(OrganizationMemberCenter organizationMemberCenter);
    Task UpdateAsync(long id, OrganizationMemberCenter organizationMemberCenter);
    Task DeleteAsync(long id);
    Task<OrganizationMemberCenter?> GetByIdAsync(long id);
    Task<List<OrganizationMemberCenter>> GetAllAsync();
    Task<List<OrganizationMemberCenter>> GetByTownIdAsync(long townId);
    Task<OrganizationMemberCenter?> GetByCenterIdAsync(string centerId);
}
