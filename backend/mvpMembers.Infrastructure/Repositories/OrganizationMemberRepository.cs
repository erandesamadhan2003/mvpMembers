using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Domain.Entities;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Repositories;

public class OrganizationMemberRepository(AppDbContext appDbContext) : IOrganizationMemberRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task AddAsync(OrganizationMember organizationMember)
    {
        await _appDbContext.OrganizationMembers.AddAsync(organizationMember);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrganizationMember organizationMember)
    {
        _appDbContext.OrganizationMembers.Update(organizationMember);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(OrganizationMember organizationMember)
    {
        _appDbContext.OrganizationMembers.Remove(organizationMember);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task<OrganizationMember?> GetByIdAsync(long id)
    {
        return await _appDbContext.OrganizationMembers
            .Include(x => x.MemberSection)
            .Include(x => x.OrganizationMemberCenter)
            .FirstOrDefaultAsync(x => x.OrganizationMemberID == id);
    }

    public async Task<List<OrganizationMember>> GetAllAsync()
    {
        return await _appDbContext.OrganizationMembers
            .Include(x => x.MemberSection)
            .Include(x => x.OrganizationMemberCenter)
            .ToListAsync();
    }

    public async Task<List<OrganizationMember>> GetByMemberSectionIdAsync(long memberSectionId)
    {
        return await _appDbContext.OrganizationMembers
            .Where(x => x.MemberSectionID == memberSectionId)
            .Include(x => x.MemberSection)
            .Include(x => x.OrganizationMemberCenter)
            .ToListAsync();
    }

    public async Task<List<OrganizationMember>> GetByOrganizationMemberCenterIdAsync(long centerID)
    {
        return await _appDbContext.OrganizationMembers
            .Where(x => x.OrganizationMemberCenterID == centerID)
            .Include(x => x.MemberSection)
            .Include(x => x.OrganizationMemberCenter)
            .ToListAsync();
    }

    public async Task<OrganizationMember?> GetByMemberNoAsync(string memberNo)
    {
        return await _appDbContext.OrganizationMembers
            .Where(x => x.MemberNo == memberNo)
            .Include(x => x.MemberSection)
            .Include(x => x.OrganizationMemberCenter)
            .FirstOrDefaultAsync();
    }
}
