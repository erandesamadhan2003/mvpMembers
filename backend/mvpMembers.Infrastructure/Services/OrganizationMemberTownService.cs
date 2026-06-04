using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Services;

public class OrganizationMemberTownService(IOrganizationMemberTownRepository organizationMemberTownRepository) : IOrganizationMemberTownService
{
    private readonly IOrganizationMemberTownRepository _organizationMemberTownRepository = organizationMemberTownRepository;

    public async Task<long> CreateAsync(string townName)
    {
        var towns = await _organizationMemberTownRepository.GetAllAsync();

        long nextTownId = towns.Any()
            ? towns.Max(x => x.TownID) + 1
            : 1;

        var organizationMemberTown = new OrganizationMemberTown
        {
            TownID = nextTownId,
            TownName = townName,
            AddByTime = DateTime.UtcNow,
            OCode = 1
        };

        await _organizationMemberTownRepository.AddAsync(organizationMemberTown);

        return organizationMemberTown.OrganizationMemberTownID;
    }

    public async Task UpdateAsync(long id, OrganizationMemberTown organizationMemberTown)
    {
        var existingTown = await _organizationMemberTownRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member town not found");

        existingTown.TownID = organizationMemberTown.TownID;
        existingTown.TownName = organizationMemberTown.TownName;
        existingTown.OCode = organizationMemberTown.OCode;
        existingTown.EditByTime = DateTime.UtcNow;

        await _organizationMemberTownRepository.UpdateAsync(existingTown);
    }

    public async Task DeleteAsync(long id)
    {
        var organizationMemberTown = await _organizationMemberTownRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member town not found");
        await _organizationMemberTownRepository.DeleteAsync(organizationMemberTown);
    }

    public async Task<OrganizationMemberTown?> GetByIdAsync(long id)
    {
        return await _organizationMemberTownRepository.GetByIdAsync(id);
    }

    public async Task<List<OrganizationMemberTown>> GetAllAsync()
    {
        return await _organizationMemberTownRepository.GetAllAsync();
    }

    public async Task<OrganizationMemberTown?> GetByTownNameAsync(string townName)
    {
        return await _organizationMemberTownRepository.GetByTownNameAsync(townName);
    }
}
