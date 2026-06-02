using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Repositories;

public interface IOrganizationMemberTownRepository
{
    Task AddAsync(OrganizationMemberTown organizationMemberTown);
    Task UpdateAsync(OrganizationMemberTown organizationMemberTown);
    Task DeleteAsync(OrganizationMemberTown organizationMemberTown);
    Task<OrganizationMemberTown?> GetByIdAsync(long id);
    Task<List<OrganizationMemberTown>> GetAllAsync();
    Task<OrganizationMemberTown?> GetByTownNameAsync(string townName);
}
