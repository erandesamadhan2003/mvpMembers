using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.Common;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;
using mvpMembers.Application.DTOs.OrganizationMember;

namespace mvpMembers.API.Controllers;

[Authorize]
[ApiController]
[Route("api/organization-members")]
public class OrganizationMemberController(IOrganizationMemberService organizationMemberService) : ControllerBase
{
    private readonly IOrganizationMemberService _organizationMemberService = organizationMemberService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var members = await _organizationMemberService.GetAllAsync();
        return Ok(new ApiResponse<List<OrganizationMember>>(true, "Organization members retrieved successfully", 200, members));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var member = await _organizationMemberService.GetByIdAsync(id);
        if (member is null)
        {
            return NotFound(new ApiResponse<OrganizationMember?>(false, "Organization member not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMember?>(true, "Organization member retrieved successfully", 200, member));
    }

    [HttpGet("by-member-no/{memberNo}")]
    public async Task<IActionResult> GetByMemberNo(string memberNo)
    {
        if (string.IsNullOrWhiteSpace(memberNo))
        {
            return BadRequest(new ApiResponse<object>(false, "Member number is required", 400, null));
        }

        var member = await _organizationMemberService.GetByMemberNoAsync(memberNo);
        if (member is null)
        {
            return NotFound(new ApiResponse<object>(false, "Organization member not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMember>(true, "Organization member retrieved successfully", 200, member));
    }

    [HttpGet("by-section/{memberSectionId}")]
    public async Task<IActionResult> GetByMemberSectionId(long memberSectionId)
    {
        var members = await _organizationMemberService.GetByMemberSectionIdAsync(memberSectionId);
        return Ok(new ApiResponse<List<OrganizationMember>>(true, "Organization members retrieved successfully", 200, members));
    }

    [HttpGet("by-center/{centerID}")]
    public async Task<IActionResult> GetByOrganizationMemberCenterId(long centerID)
    {
        var members = await _organizationMemberService.GetByOrganizationMemberCenterIdAsync(centerID);
        return Ok(new ApiResponse<List<OrganizationMember>>(true, "Organization members retrieved successfully", 200, members));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationMemberRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName))
            return BadRequest(new ApiResponse<object>(false, "FirstName is required", 400, null));

        try
        {
            var member = new OrganizationMember
            {
                NameTitleID = request.NameTitleID,
                FirstName = request.FirstName,
                LastName = request.LastName,
                MiddleName = request.MiddleName,
                NameInNativeLanguage = request.NameInNativeLanguage,
                Town = request.Town,
                City = request.City,
                Taluka = request.Taluka,
                District = request.District,
                States = request.States,
                PinCode = request.PinCode,
                PTown = request.PTown,
                PCity = request.PCity,
                PTaluka = request.PTaluka,
                PDistrict = request.PDistrict,
                PPinCode = request.PPinCode,
                MTown = request.MTown,
                MCity = request.MCity,
                MTaluka = request.MTaluka,
                MDistrict = request.MDistrict,
                MStates = request.MStates,
                MPinCode = request.MPinCode,
                MPTown = request.MPTown,
                MPCity = request.MPCity,
                MPTaluka = request.MPTaluka,
                MPDistrict = request.MPDistrict,
                MPPinCode = request.MPPinCode,
                Gender = request.Gender,
                DOB = request.DOB,
                Qualification = request.Qualification,
                OccupationID = request.OccupationID,
                Nominee = request.Nominee,
                PhoneNo = request.PhoneNo,
                MobileNo = request.MobileNo,
                EMail = request.EMail,
                AdharID = request.AdharID,
                PANNo = request.PANNo,
                MemberNo = request.MemberNo,
                RegNo = request.RegNo,
                ApplicationNo = request.ApplicationNo,
                RegistrationDate = request.RegistrationDate ?? DateTime.UtcNow,
                PrvShareHolder = request.PrvShareHolder,
                Objection = request.Objection,
                MemberSectionID = request.MemberSectionID,
                OrganizationMemberCenterID = request.OrganizationMemberCenterID,
                OrganizationMemberSubTownID = request.OrganizationMemberSubTownID,
                IsTransfer = request.IsTransfer ?? false,
                TransferOrganizationMemberID = request.TransferOrganizationMemberID,
                MemberCardIssue = true,
                FlagStatus = "Active",
                OCode = 1,
                AddByTime = DateTime.UtcNow
            };

            var memberId = await _organizationMemberService.CreateAsync(member);
            return Created(string.Empty, new ApiResponse<long>(true, "Organization member created successfully", 201, memberId));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateOrganizationMemberRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName))
            return BadRequest(new ApiResponse<object>(false, "FirstName is required", 400, null));

        try
        {
            var member = new OrganizationMember
            {
                NameTitleID = request.NameTitleID,
                FirstName = request.FirstName,
                LastName = request.LastName,
                MiddleName = request.MiddleName,
                NameInNativeLanguage = request.NameInNativeLanguage,
                Town = request.Town,
                City = request.City,
                Taluka = request.Taluka,
                District = request.District,
                States = request.States,
                PinCode = request.PinCode,
                PTown = request.PTown,
                PCity = request.PCity,
                PTaluka = request.PTaluka,
                PDistrict = request.PDistrict,
                PPinCode = request.PPinCode,
                MTown = request.MTown,
                MCity = request.MCity,
                MTaluka = request.MTaluka,
                MDistrict = request.MDistrict,
                MStates = request.MStates,
                MPinCode = request.MPinCode,
                MPTown = request.MPTown,
                MPCity = request.MPCity,
                MPTaluka = request.MPTaluka,
                MPDistrict = request.MPDistrict,
                MPPinCode = request.MPPinCode,
                Gender = request.Gender,
                DOB = request.DOB,
                Qualification = request.Qualification,
                OccupationID = request.OccupationID,
                Nominee = request.Nominee,
                PhoneNo = request.PhoneNo,
                MobileNo = request.MobileNo,
                EMail = request.EMail,
                AdharID = request.AdharID,
                PANNo = request.PANNo,
                RegNo = request.RegNo,
                ApplicationNo = request.ApplicationNo,
                PrvShareHolder = request.PrvShareHolder,
                Objection = request.Objection,
                Death = request.Death,
                DeathDate = request.DeathDate,
                DeathRef = request.DeathRef,
                MemberSectionID = request.MemberSectionID,
                OrganizationMemberCenterID = request.OrganizationMemberCenterID,
                OrganizationMemberSubTownID = request.OrganizationMemberSubTownID,
            };

            await _organizationMemberService.UpdateAsync(id, member);
            return Ok(new ApiResponse<object>(true, "Organization member updated successfully", 200, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            await _organizationMemberService.DeleteAsync(id);
            return Ok(new ApiResponse<object>(true, "Organization member deleted successfully", 200, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }
}
