using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Services;

public interface IOrganizationMemberTownService
{
    Task<long> CreateAsync(OrganizationMemberTown organizationMemberTown);
    Task UpdateAsync(long id, OrganizationMemberTown organizationMemberTown);
    Task DeleteAsync(long id);
    Task<OrganizationMemberTown?> GetByIdAsync(long id);
    Task<List<OrganizationMemberTown>> GetAllAsync();
    Task<OrganizationMemberTown?> GetByTownNameAsync(string townName);
}
