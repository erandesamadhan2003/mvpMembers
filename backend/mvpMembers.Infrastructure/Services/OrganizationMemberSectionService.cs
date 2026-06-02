using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Services;

public class OrganizationMemberSectionService(IOrganizationMemberSectionRepository organizationMemberSectionRepository) : IOrganizationMemberSectionService
{
    private readonly IOrganizationMemberSectionRepository _organizationMemeberSectionRepository = organizationMemberSectionRepository;

    public async Task CreateAsync(string name)
    {
        var organizationMemberSection = new OrganizationMemberSection
        {
            MemberSectionName = name
        };
        await _organizationMemeberSectionRepository.AddAsync(organizationMemberSection);
    }

    public async Task UpdateAsync(long id, string name)
    {
        var organizationMemberSection = await _organizationMemeberSectionRepository.GetByIdAsync(id) ?? throw new Exception("OrganizationMemberSection not found");
        organizationMemberSection.MemberSectionName = name;
        await _organizationMemeberSectionRepository.UpdateAsync(organizationMemberSection);

    }

    public async Task DeleteAsync(long id)
    {
        var organizationMemberSection = await _organizationMemeberSectionRepository.GetByIdAsync(id) ?? throw new Exception("OrganizationMemberSection not found");
        await _organizationMemeberSectionRepository.DeleteAsync(organizationMemberSection);
    }

    public async Task<List<OrganizationMemberSection>> GetAllAsync()
    {
        return await _organizationMemeberSectionRepository.GetAllAsync();
    }

    public async Task<OrganizationMemberSection?> GetByIdAsync(long id)
    {
        return await _organizationMemeberSectionRepository.GetByIdAsync(id);
    }

}
