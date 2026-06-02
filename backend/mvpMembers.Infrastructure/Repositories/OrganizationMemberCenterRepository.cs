using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Domain.Entities;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Repositories;

public class OrganizationMemberCenterRepository(AppDbContext appDbContext) : IOrganizationMemberCenterRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task AddAsync(OrganizationMemberCenter organizationMemberCenter)
    {
        await _appDbContext.OrganizationMemberCenters.AddAsync(organizationMemberCenter);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrganizationMemberCenter organizationMemberCenter)
    {
        _appDbContext.OrganizationMemberCenters.Update(organizationMemberCenter);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(OrganizationMemberCenter organizationMemberCenter)
    {
        _appDbContext.OrganizationMemberCenters.Remove(organizationMemberCenter);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task<OrganizationMemberCenter?> GetByIdAsync(long id)
    {
        return await _appDbContext.OrganizationMemberCenters
            .Include(x => x.OrganizationMemberTown)
            .FirstOrDefaultAsync(x => x.OrganizationMemberCenterID == id);
    }

    public async Task<List<OrganizationMemberCenter>> GetAllAsync()
    {
        return await _appDbContext.OrganizationMemberCenters
            .Include(x => x.OrganizationMemberTown)
            .ToListAsync();
    }

    public async Task<List<OrganizationMemberCenter>> GetByTownIdAsync(long townId)
    {
        return await _appDbContext.OrganizationMemberCenters
            .Where(x => x.OrganizationMemberTownID == townId)
            .Include(x => x.OrganizationMemberTown)
            .ToListAsync();
    }

    public async Task<OrganizationMemberCenter?> GetByCenterIdAsync(string centerId)
    {
        return await _appDbContext.OrganizationMemberCenters
            .Where(x => x.CenterID == centerId)
            .Include(x => x.OrganizationMemberTown)
            .FirstOrDefaultAsync();
    }
}
