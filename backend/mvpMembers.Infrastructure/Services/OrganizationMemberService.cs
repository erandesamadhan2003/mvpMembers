using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Services;

public class OrganizationMemberService(
    IOrganizationMemberRepository organizationMemberRepository,
    IOrganisationMemberSubTownRepository subTownRepository) : IOrganizationMemberService
{
    private readonly IOrganizationMemberRepository _organizationMemberRepository = organizationMemberRepository;
    private readonly IOrganisationMemberSubTownRepository _subTownRepository = subTownRepository;

    public async Task<long> CreateAsync(OrganizationMember organizationMember)
    {
        if (string.IsNullOrWhiteSpace(organizationMember.FirstName))
            throw new ArgumentException("FirstName is required");

        // Auto-derive CenterID from SubTown
        if (organizationMember.OrganizationMemberSubTownID is > 0)
        {
            var subTown = await _subTownRepository.GetByIdAsync(
                organizationMember.OrganizationMemberSubTownID.Value)
                ?? throw new Exception("Sub town not found");

            organizationMember.OrganizationMemberCenterID = subTown.OrganizationMemberCenterID;
        }

        organizationMember.RegistrationDate ??= DateTime.UtcNow;
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

        // Auto-derive CenterID from SubTown
        if (organizationMember.OrganizationMemberSubTownID is > 0)
        {
            var subTown = await _subTownRepository.GetByIdAsync(
                organizationMember.OrganizationMemberSubTownID.Value)
                ?? throw new Exception("Sub town not found");

            organizationMember.OrganizationMemberCenterID = subTown.OrganizationMemberCenterID;
        }

        existingMember.NameTitleID = organizationMember.NameTitleID;
        existingMember.FirstName = organizationMember.FirstName;
        existingMember.LastName = organizationMember.LastName;
        existingMember.MiddleName = organizationMember.MiddleName;
        existingMember.NameInNativeLanguage = organizationMember.NameInNativeLanguage;
        existingMember.Town = organizationMember.Town;
        existingMember.City = organizationMember.City;
        existingMember.Taluka = organizationMember.Taluka;
        existingMember.District = organizationMember.District;
        existingMember.States = organizationMember.States;
        existingMember.PinCode = organizationMember.PinCode;
        existingMember.PTown = organizationMember.PTown;
        existingMember.PCity = organizationMember.PCity;
        existingMember.PTaluka = organizationMember.PTaluka;
        existingMember.PDistrict = organizationMember.PDistrict;
        existingMember.PPinCode = organizationMember.PPinCode;
        existingMember.MTown = organizationMember.MTown;
        existingMember.MCity = organizationMember.MCity;
        existingMember.MTaluka = organizationMember.MTaluka;
        existingMember.MDistrict = organizationMember.MDistrict;
        existingMember.MStates = organizationMember.MStates;
        existingMember.MPinCode = organizationMember.MPinCode;
        existingMember.MPTown = organizationMember.MPTown;
        existingMember.MPCity = organizationMember.MPCity;
        existingMember.MPTaluka = organizationMember.MPTaluka;
        existingMember.MPDistrict = organizationMember.MPDistrict;
        existingMember.MPPinCode = organizationMember.MPPinCode;
        existingMember.Gender = organizationMember.Gender;
        existingMember.DOB = organizationMember.DOB;
        existingMember.Qualification = organizationMember.Qualification;
        existingMember.OccupationID = organizationMember.OccupationID;
        existingMember.Nominee = organizationMember.Nominee;
        existingMember.PhoneNo = organizationMember.PhoneNo;
        existingMember.MobileNo = organizationMember.MobileNo;
        existingMember.EMail = organizationMember.EMail;
        existingMember.AdharID = organizationMember.AdharID;
        existingMember.PANNo = organizationMember.PANNo;
        existingMember.RegNo = organizationMember.RegNo;
        existingMember.ApplicationNo = organizationMember.ApplicationNo;
        existingMember.PrvShareHolder = organizationMember.PrvShareHolder;
        existingMember.Objection = organizationMember.Objection;
        existingMember.Death = organizationMember.Death;
        existingMember.DeathDate = organizationMember.DeathDate;
        existingMember.DeathRef = organizationMember.DeathRef;
        existingMember.MemberSectionID = organizationMember.MemberSectionID;
        existingMember.OrganizationMemberCenterID = organizationMember.OrganizationMemberCenterID;
        existingMember.OrganizationMemberSubTownID = organizationMember.OrganizationMemberSubTownID;
        existingMember.EditByTime = DateTime.UtcNow;

        await _organizationMemberRepository.UpdateAsync(existingMember);
    }

    // remaining methods unchanged
    public async Task DeleteAsync(long id)
    {
        var organizationMember = await _organizationMemberRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member not found");
        await _organizationMemberRepository.DeleteAsync(organizationMember);
    }

    public async Task<OrganizationMember?> GetByIdAsync(long id)
        => await _organizationMemberRepository.GetByIdAsync(id);

    public async Task<List<OrganizationMember>> GetAllAsync()
        => await _organizationMemberRepository.GetAllAsync();

    public async Task<List<OrganizationMember>> GetByMemberSectionIdAsync(long memberSectionId)
        => await _organizationMemberRepository.GetByMemberSectionIdAsync(memberSectionId);

    public async Task<List<OrganizationMember>> GetByOrganizationMemberCenterIdAsync(long centerID)
        => await _organizationMemberRepository.GetByOrganizationMemberCenterIdAsync(centerID);

    public async Task<OrganizationMember?> GetByMemberNoAsync(string memberNo)
        => await _organizationMemberRepository.GetByMemberNoAsync(memberNo);
}