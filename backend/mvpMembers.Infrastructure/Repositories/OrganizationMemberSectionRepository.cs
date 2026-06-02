using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Domain.Entities;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Repositories;

public class OrganizationMemberSectionRepository(AppDbContext appDbContext) : IOrganizationMemberSectionRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task AddAsync(OrganizationMemberSection organizationMemberSection)
    {
        await _appDbContext.OrganizationMemberSections.AddAsync(organizationMemberSection);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrganizationMemberSection organizationMemberSection)
    {
        _appDbContext.OrganizationMemberSections.Update(organizationMemberSection);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(OrganizationMemberSection organizationMemberSection)
    {
        _appDbContext.OrganizationMemberSections.Remove(organizationMemberSection);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task<OrganizationMemberSection?> GetByIdAsync(long id)
    {
        return await _appDbContext.OrganizationMemberSections.FindAsync(id);
    }

    public async Task<List<OrganizationMemberSection>> GetAllAsync()
    {
        return await _appDbContext.OrganizationMemberSections.ToListAsync();
    }
    
}