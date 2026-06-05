using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Domain.Entities;

namespace mvpMembers.Infrastructure.Services;

public class OrganizationMemberDocumentService(IOrganizationMemberDocumentRepository organizationMemberDocumentRepository) : IOrganizationMemberDocumentService
{
    private readonly IOrganizationMemberDocumentRepository _organizationMemberDocumentRepository = organizationMemberDocumentRepository;

    public async Task<long> CreateAsync(OrganizationMemberDocument organizationMemberDocument)
    {
        if (organizationMemberDocument.OrganizationMemberID <= 0)
            throw new ArgumentException("OrganizationMemberID is required");

        await _organizationMemberDocumentRepository.AddAsync(organizationMemberDocument);
        return organizationMemberDocument.OrganizationMemberDocumentID;
    }

    public async Task UpdateAsync(long id, OrganizationMemberDocument organizationMemberDocument)
    {
        var existingDocument = await _organizationMemberDocumentRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member document not found");

        if (organizationMemberDocument.MemberPhoto is not null)
            existingDocument.MemberPhoto = organizationMemberDocument.MemberPhoto;
        if (organizationMemberDocument.AadhaarCopy is not null)
            existingDocument.AadhaarCopy = organizationMemberDocument.AadhaarCopy;
        if (organizationMemberDocument.PANCopy is not null)
            existingDocument.PANCopy = organizationMemberDocument.PANCopy;
        if (organizationMemberDocument.DeathCertificate is not null)
            existingDocument.DeathCertificate = organizationMemberDocument.DeathCertificate;
        existingDocument.EditByTime = DateTime.UtcNow;

        await _organizationMemberDocumentRepository.UpdateAsync(existingDocument);
    }

    public async Task DeleteAsync(long id)
    {
        var organizationMemberDocument = await _organizationMemberDocumentRepository.GetByIdAsync(id)
            ?? throw new Exception("Organization member document not found");
        await _organizationMemberDocumentRepository.DeleteAsync(organizationMemberDocument);
    }

    public async Task<OrganizationMemberDocument?> GetByIdAsync(long id)
    {
        return await _organizationMemberDocumentRepository.GetByIdAsync(id);
    }

    public async Task<List<OrganizationMemberDocument>> GetAllAsync()
    {
        return await _organizationMemberDocumentRepository.GetAllAsync();
    }

    public async Task<OrganizationMemberDocument?> GetByMemberIdAsync(long memberId)
    {
        return await _organizationMemberDocumentRepository.GetByMemberIdAsync(memberId);
    }
}
