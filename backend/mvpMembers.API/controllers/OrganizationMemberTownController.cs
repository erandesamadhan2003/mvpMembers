using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.Common;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.API.Controllers;

[Authorize]
[ApiController]
[Route("api/organization-member-towns")]
public class OrganizationMemberTownController(IOrganizationMemberTownService organizationMemberTownService) : ControllerBase
{
    private readonly IOrganizationMemberTownService _organizationMemberTownService = organizationMemberTownService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var towns = await _organizationMemberTownService.GetAllAsync();
        return Ok(new ApiResponse<List<OrganizationMemberTown>>(true, "Organization member towns retrieved successfully", 200, towns));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var town = await _organizationMemberTownService.GetByIdAsync(id);
        if (town is null)
        {
            return NotFound(new ApiResponse<OrganizationMemberTown?>(false, "Organization member town not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMemberTown?>(true, "Organization member town retrieved successfully", 200, town));
    }

    [HttpGet("by-name/{townName}")]
    public async Task<IActionResult> GetByTownName(string townName)
    {
        if (string.IsNullOrWhiteSpace(townName))
        {
            return BadRequest(new ApiResponse<object>(false, "Town name is required", 400, null));
        }

        var town = await _organizationMemberTownService.GetByTownNameAsync(townName);
        if (town is null)
        {
            return NotFound(new ApiResponse<object>(false, "Organization member town not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMemberTown>(true, "Organization member town retrieved successfully", 200, town));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationMemberTownRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.TownName))
        {
            return BadRequest(new ApiResponse<object>(false, "TownName is required", 400, null));
        }

        try
        {
            var town = new OrganizationMemberTown
            {
                TownID = request.TownID,
                TownName = request.TownName,
                OCode = request.OCode,
                AddByTime = DateTime.UtcNow
            };

            var townId = await _organizationMemberTownService.CreateAsync(town);
            return Created(string.Empty, new ApiResponse<long>(true, "Organization member town created successfully", 201, townId));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateOrganizationMemberTownRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.TownName))
        {
            return BadRequest(new ApiResponse<object>(false, "TownName is required", 400, null));
        }

        try
        {
            var town = new OrganizationMemberTown
            {
                TownID = request.TownID,
                TownName = request.TownName,
                OCode = request.OCode
            };

            await _organizationMemberTownService.UpdateAsync(id, town);
            return Ok(new ApiResponse<object>(true, "Organization member town updated successfully", 200, null));
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
            await _organizationMemberTownService.DeleteAsync(id);
            return Ok(new ApiResponse<object>(true, "Organization member town deleted successfully", 200, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }
}

public class CreateOrganizationMemberTownRequest
{
    public long TownID { get; set; }
    public string TownName { get; set; } = string.Empty;
    public long? OCode { get; set; }
}

public class UpdateOrganizationMemberTownRequest
{
    public long TownID { get; set; }
    public string TownName { get; set; } = string.Empty;
    public long? OCode { get; set; }
}
