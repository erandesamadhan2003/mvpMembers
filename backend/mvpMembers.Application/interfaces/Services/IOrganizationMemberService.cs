using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Services;

public interface IOrganizationMemberService
{
    Task<long> CreateAsync(OrganizationMember organizationMember);
    Task UpdateAsync(long id, OrganizationMember organizationMember);
    Task DeleteAsync(long id);
    Task<OrganizationMember?> GetByIdAsync(long id);
    Task<List<OrganizationMember>> GetAllAsync();
    Task<List<OrganizationMember>> GetByMemberSectionIdAsync(long memberSectionId);
    Task<List<OrganizationMember>> GetByOrganizationMemberCenterIdAsync(long centerID);
    Task<OrganizationMember?> GetByMemberNoAsync(string memberNo);
}
