using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Services;

public interface IOrganizationMemberSectionService
{
    Task CreateAsync(string name);
    Task UpdateAsync(long id, string name);
    Task DeleteAsync(long id);
    Task<List<OrganizationMemberSection>> GetAllAsync();
    Task<OrganizationMemberSection?> GetByIdAsync(long id);
}