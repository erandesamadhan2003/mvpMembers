using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Repositories;

public interface IOrganizationMemberRepository
{
    Task AddAsync(OrganizationMember organizationMember);
    Task UpdateAsync(OrganizationMember organizationMember);
    Task DeleteAsync(OrganizationMember organizationMember);
    Task<OrganizationMember?> GetByIdAsync(long id);
    Task<List<OrganizationMember>> GetAllAsync();
    Task<List<OrganizationMember>> GetByMemberSectionIdAsync(long memberSectionId);
    Task<List<OrganizationMember>> GetByOrganizationMemberCenterIdAsync(long centerID);
    Task<OrganizationMember?> GetByMemberNoAsync(string memberNo);
}
