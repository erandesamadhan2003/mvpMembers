using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.Common;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.API.Controllers;

[Authorize]
[ApiController]
[Route("api/organization-member-centers")]
public class OrganizationMemberCenterController(IOrganizationMemberCenterService organizationMemberCenterService) : ControllerBase
{
    private readonly IOrganizationMemberCenterService _organizationMemberCenterService = organizationMemberCenterService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var centers = await _organizationMemberCenterService.GetAllAsync();
        return Ok(new ApiResponse<List<OrganizationMemberCenter>>(true, "Organization member centers retrieved successfully", 200, centers));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var center = await _organizationMemberCenterService.GetByIdAsync(id);
        if (center is null)
        {
            return NotFound(new ApiResponse<OrganizationMemberCenter?>(false, "Organization member center not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMemberCenter?>(true, "Organization member center retrieved successfully", 200, center));
    }

    [HttpGet("by-town/{townId}")]
    public async Task<IActionResult> GetByTownId(long townId)
    {
        var centers = await _organizationMemberCenterService.GetByTownIdAsync(townId);
        return Ok(new ApiResponse<List<OrganizationMemberCenter>>(true, "Organization member centers retrieved successfully", 200, centers));
    }

    [HttpGet("by-center-id/{centerId}")]
    public async Task<IActionResult> GetByCenterId(string centerId)
    {
        if (string.IsNullOrWhiteSpace(centerId))
        {
            return BadRequest(new ApiResponse<object>(false, "Center ID is required", 400, null));
        }

        var center = await _organizationMemberCenterService.GetByCenterIdAsync(centerId);
        if (center is null)
        {
            return NotFound(new ApiResponse<object>(false, "Organization member center not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMemberCenter>(true, "Organization member center retrieved successfully", 200, center));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationMemberCenterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CenterName))
        {
            return BadRequest(new ApiResponse<object>(false, "CenterName is required", 400, null));
        }

        try
        {

            var centerId = await _organizationMemberCenterService.CreateAsync(request.OrganizationMemberTownID, request.CenterName);
            return Created(string.Empty, new ApiResponse<long>(true, "Organization member center created successfully", 201, centerId));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateOrganizationMemberCenterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CenterName))
        {
            return BadRequest(new ApiResponse<object>(false, "CenterName is required", 400, null));
        }

        try
        {
            var center = new OrganizationMemberCenter
            {
                CenterID = request.CenterID,
                CenterName = request.CenterName,
                OrganizationMemberTownID = request.OrganizationMemberTownID,
                OCode = request.OCode
            };

            await _organizationMemberCenterService.UpdateAsync(id, center);
            return Ok(new ApiResponse<object>(true, "Organization member center updated successfully", 200, null));
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
            await _organizationMemberCenterService.DeleteAsync(id);
            return Ok(new ApiResponse<object>(true, "Organization member center deleted successfully", 200, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }
}

public class CreateOrganizationMemberCenterRequest
{
    // public string CenterID { get; set; } = string.Empty;
    public string CenterName { get; set; } = string.Empty;
    public long OrganizationMemberTownID { get; set; }
    // public long? OCode { get; set; }
}

public class UpdateOrganizationMemberCenterRequest
{
    public string CenterID { get; set; } = string.Empty;
    public string CenterName { get; set; } = string.Empty;
    public long OrganizationMemberTownID { get; set; }
    public long? OCode { get; set; }
}
