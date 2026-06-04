using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Services;

public class OrganizationMemberCenterService(IOrganizationMemberCenterRepository organizationMemberCenterRepository) : IOrganizationMemberCenterService
{
    private readonly IOrganizationMemberCenterRepository _organizationMemberCenterRepository = organizationMemberCenterRepository;

    public async Task<long> CreateAsync(long organizationMemberTownId, string centerName)
    {
        List<OrganizationMemberCenter> existingCenters = await _organizationMemberCenterRepository.GetByTownIdAsync(organizationMemberTownId);
        int totalCenters = existingCenters.Count + 1;
        string centerId = $"{organizationMemberTownId}.{totalCenters}";
        
        var organizationMemberCenter = new OrganizationMemberCenter
        {
            OrganizationMemberTownID = organizationMemberTownId,
            CenterName = centerName,
            CenterID = centerId,
            OCode = 1,
            AddByTime = DateTime.UtcNow,
        };

        await _organizationMemberCenterRepository.AddAsync(organizationMemberCenter);
        return organizationMemberCenter.OrganizationMemberCenterID;
    }

    public async Task UpdateAsync(long id, OrganizationMemberCenter organizationMemberCenter)
    {
        var existingCenter = await _organizationMemberCenterRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member center not found");

        existingCenter.CenterID = organizationMemberCenter.CenterID;
        existingCenter.CenterName = organizationMemberCenter.CenterName;
        existingCenter.OrganizationMemberTownID = organizationMemberCenter.OrganizationMemberTownID;
        existingCenter.OCode = organizationMemberCenter.OCode;
        existingCenter.EditByTime = DateTime.UtcNow;

        await _organizationMemberCenterRepository.UpdateAsync(existingCenter);
    }

    public async Task DeleteAsync(long id)
    {
        var organizationMemberCenter = await _organizationMemberCenterRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member center not found");
        await _organizationMemberCenterRepository.DeleteAsync(organizationMemberCenter);
    }

    public async Task<OrganizationMemberCenter?> GetByIdAsync(long id)
    {
        return await _organizationMemberCenterRepository.GetByIdAsync(id);
    }

    public async Task<List<OrganizationMemberCenter>> GetAllAsync()
    {
        return await _organizationMemberCenterRepository.GetAllAsync();
    }

    public async Task<List<OrganizationMemberCenter>> GetByTownIdAsync(long townId)
    {
        return await _organizationMemberCenterRepository.GetByTownIdAsync(townId);
    }

    public async Task<OrganizationMemberCenter?> GetByCenterIdAsync(string centerId)
    {
        return await _organizationMemberCenterRepository.GetByCenterIdAsync(centerId);
    }
}
