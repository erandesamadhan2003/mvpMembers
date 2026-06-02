using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Domain.Entities;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Repositories;

public class OrganizationMemberDocumentRepository(AppDbContext appDbContext) : IOrganizationMemberDocumentRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task AddAsync(OrganizationMemberDocument organizationMemberDocument)
    {
        await _appDbContext.OrganizationMemberDocuments.AddAsync(organizationMemberDocument);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrganizationMemberDocument organizationMemberDocument)
    {
        _appDbContext.OrganizationMemberDocuments.Update(organizationMemberDocument);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(OrganizationMemberDocument organizationMemberDocument)
    {
        _appDbContext.OrganizationMemberDocuments.Remove(organizationMemberDocument);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task<OrganizationMemberDocument?> GetByIdAsync(long id)
    {
        return await _appDbContext.OrganizationMemberDocuments
            .Include(x => x.OrganizationMember)
            .FirstOrDefaultAsync(x => x.OrganizationMemberDocumentID == id);
    }

    public async Task<List<OrganizationMemberDocument>> GetAllAsync()
    {
        return await _appDbContext.OrganizationMemberDocuments
            .Include(x => x.OrganizationMember)
            .ToListAsync();
    }

    public async Task<OrganizationMemberDocument?> GetByMemberIdAsync(long memberId)
    {
        return await _appDbContext.OrganizationMemberDocuments
            .Where(x => x.OrganizationMemberID == memberId)
            .Include(x => x.OrganizationMember)
            .FirstOrDefaultAsync();
    }
}
