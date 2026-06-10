using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Services;

public interface IOrganisationMemberSubTownService
{
    Task<long> CreateAsync(long organizationMemberCenterID, string subTownName);
    Task UpdateAsync(long id, OrganisationMemberSubTown subTown);
    Task DeleteAsync(long id);
    Task<OrganisationMemberSubTown?> GetByIdAsync(long id);
    Task<List<OrganisationMemberSubTown>> GetAllAsync();
    Task<List<OrganisationMemberSubTown>> GetByCenterIdAsync(long centerId);
    Task<OrganisationMemberSubTown?> GetBySubTownIdAsync(string subTownId);
}