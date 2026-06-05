using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Services;

public class OrganizationMemberService(IOrganizationMemberRepository organizationMemberRepository) : IOrganizationMemberService
{
    private readonly IOrganizationMemberRepository _organizationMemberRepository = organizationMemberRepository;

    public async Task<long> CreateAsync(OrganizationMember organizationMember)
    {
        if (string.IsNullOrWhiteSpace(organizationMember.FirstName))
            throw new ArgumentException("FirstName is required");

        organizationMember.RegistrationDate = DateTime.UtcNow;
        organizationMember.FlagStatus = "Active";
        await _organizationMemberRepository.AddAsync(organizationMember);

        if (organizationMember.TransferOrganizationMemberID is > 0)
        {
            var sourceMember = await _organizationMemberRepository.GetByIdAsync(
                organizationMember.TransferOrganizationMemberID.Value)
                ?? throw new Exception("Transfer source member not found");
            sourceMember.IsTransfer = true;
            sourceMember.FlagStatus = "Inactive";
            sourceMember.EditByTime = DateTime.UtcNow;
            await _organizationMemberRepository.UpdateAsync(sourceMember);
        }

        return organizationMember.OrganizationMemberID;
    }

    public async Task UpdateAsync(long id, OrganizationMember organizationMember)
    {
        var existingMember = await _organizationMemberRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member not found");

        existingMember.NameTitleID = organizationMember.NameTitleID;
        existingMember.FirstName = organizationMember.FirstName;
        existingMember.LastName = organizationMember.LastName;
        existingMember.MiddleName = organizationMember.MiddleName;
        existingMember.NameInNativeLanguage = organizationMember.NameInNativeLanguage;
        existingMember.City = organizationMember.City;
        existingMember.Taluka = organizationMember.Taluka;
        existingMember.District = organizationMember.District;
        existingMember.States = organizationMember.States;
        existingMember.PinCode = organizationMember.PinCode;
        existingMember.PCity = organizationMember.PCity;
        existingMember.PTaluka = organizationMember.PTaluka;
        existingMember.PDistrict = organizationMember.PDistrict;
        existingMember.PPinCode = organizationMember.PPinCode;
        existingMember.Gender = organizationMember.Gender;
        existingMember.DOB = organizationMember.DOB;
        existingMember.Qualification = organizationMember.Qualification;
        existingMember.OccupationID = organizationMember.OccupationID;
        existingMember.Nominee = organizationMember.Nominee;
        existingMember.PhoneNo = organizationMember.PhoneNo;
        existingMember.EMail = organizationMember.EMail;
        existingMember.AdharID = organizationMember.AdharID;
        existingMember.PANNo = organizationMember.PANNo;
        existingMember.MemberSectionID = organizationMember.MemberSectionID;
        existingMember.OrganizationMemberCenterID = organizationMember.OrganizationMemberCenterID;
        existingMember.EditByTime = DateTime.UtcNow;

        await _organizationMemberRepository.UpdateAsync(existingMember);
    }

    public async Task DeleteAsync(long id)
    {
        var organizationMember = await _organizationMemberRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member not found");
        await _organizationMemberRepository.DeleteAsync(organizationMember);
    }

    public async Task<OrganizationMember?> GetByIdAsync(long id)
    {
        return await _organizationMemberRepository.GetByIdAsync(id);
    }

    public async Task<List<OrganizationMember>> GetAllAsync()
    {
        return await _organizationMemberRepository.GetAllAsync();
    }

    public async Task<List<OrganizationMember>> GetByMemberSectionIdAsync(long memberSectionId)
    {
        return await _organizationMemberRepository.GetByMemberSectionIdAsync(memberSectionId);
    }

    public async Task<List<OrganizationMember>> GetByOrganizationMemberCenterIdAsync(long centerID)
    {
        return await _organizationMemberRepository.GetByOrganizationMemberCenterIdAsync(centerID);
    }

    public async Task<OrganizationMember?> GetByMemberNoAsync(string memberNo)
    {
        return await _organizationMemberRepository.GetByMemberNoAsync(memberNo);
    }
}
