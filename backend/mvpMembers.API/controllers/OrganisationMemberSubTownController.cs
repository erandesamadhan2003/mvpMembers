using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.Common;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.API.Controllers;

[Authorize]
[ApiController]
[Route("api/organisation-member-sub-towns")]
public class OrganisationMemberSubTownController(IOrganisationMemberSubTownService subTownService) : ControllerBase
{
    private readonly IOrganisationMemberSubTownService _subTownService = subTownService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subTowns = await _subTownService.GetAllAsync();
        return Ok(new ApiResponse<List<OrganisationMemberSubTown>>(true, "Sub towns retrieved successfully", 200, subTowns));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var subTown = await _subTownService.GetByIdAsync(id);
        if (subTown is null)
            return NotFound(new ApiResponse<object>(false, "Sub town not found", 404, null));

        return Ok(new ApiResponse<OrganisationMemberSubTown>(true, "Sub town retrieved successfully", 200, subTown));
    }

    [HttpGet("by-center/{centerId}")]
    public async Task<IActionResult> GetByCenterId(long centerId)
    {
        var subTowns = await _subTownService.GetByCenterIdAsync(centerId);
        return Ok(new ApiResponse<List<OrganisationMemberSubTown>>(true, "Sub towns retrieved successfully", 200, subTowns));
    }

    [HttpGet("by-sub-town-id/{subTownId}")]
    public async Task<IActionResult> GetBySubTownId(string subTownId)
    {
        if (string.IsNullOrWhiteSpace(subTownId))
            return BadRequest(new ApiResponse<object>(false, "SubTown ID is required", 400, null));

        var subTown = await _subTownService.GetBySubTownIdAsync(subTownId);
        if (subTown is null)
            return NotFound(new ApiResponse<object>(false, "Sub town not found", 404, null));

        return Ok(new ApiResponse<OrganisationMemberSubTown>(true, "Sub town retrieved successfully", 200, subTown));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganisationMemberSubTownRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SubTownName))
            return BadRequest(new ApiResponse<object>(false, "SubTownName is required", 400, null));

        try
        {
            var id = await _subTownService.CreateAsync(request.OrganizationMemberCenterID, request.SubTownName);
            return Created(string.Empty, new ApiResponse<long>(true, "Sub town created successfully", 201, id));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateOrganisationMemberSubTownRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SubTownName))
            return BadRequest(new ApiResponse<object>(false, "SubTownName is required", 400, null));

        try
        {
            var subTown = new OrganisationMemberSubTown
            {
                SubTownName = request.SubTownName,
                OrganizationMemberCenterID = request.OrganizationMemberCenterID,
                OCode = request.OCode,
            };

            await _subTownService.UpdateAsync(id, subTown);
            return Ok(new ApiResponse<object>(true, "Sub town updated successfully", 200, null));
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
            await _subTownService.DeleteAsync(id);
            return Ok(new ApiResponse<object>(true, "Sub town deleted successfully", 200, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }
}

public class CreateOrganisationMemberSubTownRequest
{
    public string SubTownName { get; set; } = string.Empty;
    public long OrganizationMemberCenterID { get; set; }
}

public class UpdateOrganisationMemberSubTownRequest
{
    public string SubTownName { get; set; } = string.Empty;
    public long OrganizationMemberCenterID { get; set; }
    public long? OCode { get; set; }
}