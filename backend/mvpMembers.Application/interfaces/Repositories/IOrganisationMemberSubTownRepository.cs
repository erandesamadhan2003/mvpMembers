using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Repositories;

public interface IOrganisationMemberSubTownRepository
{
    Task AddAsync(OrganisationMemberSubTown subTown);
    Task UpdateAsync(OrganisationMemberSubTown subTown);
    Task DeleteAsync(OrganisationMemberSubTown subTown);
    Task<OrganisationMemberSubTown?> GetByIdAsync(long id);
    Task<List<OrganisationMemberSubTown>> GetAllAsync();
    Task<List<OrganisationMemberSubTown>> GetByCenterIdAsync(long centerId);
    Task<OrganisationMemberSubTown?> GetBySubTownIdAsync(string subTownId);
}