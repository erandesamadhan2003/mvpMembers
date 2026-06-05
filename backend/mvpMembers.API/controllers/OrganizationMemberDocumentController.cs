using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.Common;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.API.Controllers;

[Authorize]
[ApiController]
[Route("api/organization-member-documents")]
public class OrganizationMemberDocumentController(IOrganizationMemberDocumentService organizationMemberDocumentService) : ControllerBase
{
    private readonly IOrganizationMemberDocumentService _organizationMemberDocumentService = organizationMemberDocumentService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var documents = await _organizationMemberDocumentService.GetAllAsync();
        return Ok(new ApiResponse<List<OrganizationMemberDocument>>(true, "Organization member documents retrieved successfully", 200, documents));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var document = await _organizationMemberDocumentService.GetByIdAsync(id);
        if (document is null)
        {
            return NotFound(new ApiResponse<OrganizationMemberDocument?>(false, "Organization member document not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMemberDocument?>(true, "Organization member document retrieved successfully", 200, document));
    }

    [HttpGet("by-member/{memberId}")]
    public async Task<IActionResult> GetByMemberId(long memberId)
    {
        var document = await _organizationMemberDocumentService.GetByMemberIdAsync(memberId);
        if (document is null)
        {
            return NotFound(new ApiResponse<object>(false, "Organization member document not found", 404, null));
        }
        return Ok(new ApiResponse<OrganizationMemberDocument>(true, "Organization member document retrieved successfully", 200, document));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationMemberDocumentRequest request)
    {
        if (request.OrganizationMemberID <= 0)
        {
            return BadRequest(new ApiResponse<object>(false, "OrganizationMemberID is required", 400, null));
        }

        try
        {
            var document = new OrganizationMemberDocument
            {
                OrganizationMemberID = request.OrganizationMemberID,
                MemberPhoto = DocumentEncodingHelper.DecodeBase64(request.MemberPhoto),
                AadhaarCopy = DocumentEncodingHelper.DecodeBase64(request.AadhaarCopy),
                PANCopy = DocumentEncodingHelper.DecodeBase64(request.PanCopy),
                DeathCertificate = DocumentEncodingHelper.DecodeBase64(request.DeathCertificate),
                AddByTime = DateTime.UtcNow
            };

            var documentId = await _organizationMemberDocumentService.CreateAsync(document);
            return Created(string.Empty, new ApiResponse<long>(true, "Organization member document created successfully", 201, documentId));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateOrganizationMemberDocumentRequest request)
    {
        try
        {
            var document = new OrganizationMemberDocument
            {
                OrganizationMemberID = request.OrganizationMemberID,
                MemberPhoto = DocumentEncodingHelper.DecodeBase64(request.MemberPhoto),
                AadhaarCopy = DocumentEncodingHelper.DecodeBase64(request.AadhaarCopy),
                PANCopy = DocumentEncodingHelper.DecodeBase64(request.PanCopy),
                DeathCertificate = DocumentEncodingHelper.DecodeBase64(request.DeathCertificate)
            };

            await _organizationMemberDocumentService.UpdateAsync(id, document);
            return Ok(new ApiResponse<object>(true, "Organization member document updated successfully", 200, null));
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
            await _organizationMemberDocumentService.DeleteAsync(id);
            return Ok(new ApiResponse<object>(true, "Organization member document deleted successfully", 200, null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>(false, $"An error occurred: {ex.Message}", 500, null));
        }
    }
}

public class CreateOrganizationMemberDocumentRequest
{
    public long OrganizationMemberID { get; set; }
    public string? MemberPhoto { get; set; }
    public string? AadhaarCopy { get; set; }
    public string? PanCopy { get; set; }
    public string? DeathCertificate { get; set; }
}

public class UpdateOrganizationMemberDocumentRequest
{
    public long OrganizationMemberID { get; set; }
    public string? MemberPhoto { get; set; }
    public string? AadhaarCopy { get; set; }
    public string? PanCopy { get; set; }
    public string? DeathCertificate { get; set; }
}

internal static class DocumentEncodingHelper
{
    internal static byte[]? DecodeBase64(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var base64 = value.Contains(',') ? value.Split(',')[1] : value.Trim();
        return Convert.FromBase64String(base64);
    }
}
