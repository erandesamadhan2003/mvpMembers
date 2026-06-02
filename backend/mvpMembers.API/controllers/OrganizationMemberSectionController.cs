using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.Common;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;
namespace mvpMembers.API.Controllers;

[Authorize]
[ApiController]
[Route("api/member-sections")]
public class OrganizationMemberSectionController(IOrganizationMemberSectionService organizationMemberSectionService) : ControllerBase
{
    private readonly IOrganizationMemberSectionService _organizationMemberSectionService = organizationMemberSectionService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sections = await _organizationMemberSectionService.GetAllAsync();
        return Ok(new ApiResponse<List<OrganizationMemberSection>>(true, "Organization member sections retrieved successfully", 200, sections));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var section = await _organizationMemberSectionService.GetByIdAsync(id);
        if (section is null)
        {
            return NotFound(new ApiResponse<OrganizationMemberSection?>(false, "Organization member section not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMemberSection?>(true, "Organization member section retrieved successfully", 200, section));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationMemberSectionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new ApiResponse<object>(false, "Name is required", 400, null));
        }

        try
        {
            await _organizationMemberSectionService.CreateAsync(request.Name);
            return Created(string.Empty, new ApiResponse<object>(true, "Organization member section created successfully", 201, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateOrganizationMemberSectionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new ApiResponse<object>(false, "Name is required", 400, null));
        }

        try
        {
            await _organizationMemberSectionService.UpdateAsync(id, request.Name);
            return Ok(new ApiResponse<object>(true, "Organization member section updated successfully", 200, null));
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
            await _organizationMemberSectionService.DeleteAsync(id);
            return Ok(new ApiResponse<object>(true, "Organization member section deleted successfully", 200, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }
}

public class CreateOrganizationMemberSectionRequest
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateOrganizationMemberSectionRequest
{
    public string Name { get; set; } = string.Empty;
}