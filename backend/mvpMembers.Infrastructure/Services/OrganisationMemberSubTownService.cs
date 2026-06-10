using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Services;

public class OrganisationMemberSubTownService(
    IOrganisationMemberSubTownRepository subTownRepository,
    IOrganizationMemberCenterRepository centerRepository) : IOrganisationMemberSubTownService
{
    private readonly IOrganisationMemberSubTownRepository _subTownRepository = subTownRepository;
    private readonly IOrganizationMemberCenterRepository _centerRepository = centerRepository;

    public async Task<long> CreateAsync(long organizationMemberCenterID, string subTownName)
    {
        var center = await _centerRepository.GetByIdAsync(organizationMemberCenterID)
            ?? throw new Exception("Organization member center not found");
        Console.WriteLine($"Creating sub town for center: {center.CenterID} - {center.CenterName}");
        var existingSubTowns = await _subTownRepository.GetByCenterIdAsync(organizationMemberCenterID);
        int total = existingSubTowns.Count + 1;
        string subTownId = $"{center.CenterID}.{total}";
        Console.WriteLine($"Generated SubTownID: {subTownId}");

        var subTown = new OrganisationMemberSubTown
        {
            OrganizationMemberCenterID = organizationMemberCenterID,
            SubTownID = subTownId,
            SubTownName = subTownName,
            OCode = 1,
            AddByTime = DateTime.UtcNow,
        };

        await _subTownRepository.AddAsync(subTown);
        return subTown.OrganisationMemberSubTownID;
    }

    public async Task UpdateAsync(long id, OrganisationMemberSubTown subTown)
    {
        var existing = await _subTownRepository.GetByIdAsync(id)
            ?? throw new Exception("Organisation member sub town not found");

        existing.SubTownName = subTown.SubTownName;
        existing.OrganizationMemberCenterID = subTown.OrganizationMemberCenterID;
        existing.OCode = subTown.OCode;
        existing.EditByTime = DateTime.UtcNow;

        await _subTownRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(long id)
    {
        var subTown = await _subTownRepository.GetByIdAsync(id)
            ?? throw new Exception("Organisation member sub town not found");
        await _subTownRepository.DeleteAsync(subTown);
    }

    public async Task<OrganisationMemberSubTown?> GetByIdAsync(long id)
        => await _subTownRepository.GetByIdAsync(id);

    public async Task<List<OrganisationMemberSubTown>> GetAllAsync()
        => await _subTownRepository.GetAllAsync();

    public async Task<List<OrganisationMemberSubTown>> GetByCenterIdAsync(long centerId)
        => await _subTownRepository.GetByCenterIdAsync(centerId);

    public async Task<OrganisationMemberSubTown?> GetBySubTownIdAsync(string subTownId)
        => await _subTownRepository.GetBySubTownIdAsync(subTownId);
}