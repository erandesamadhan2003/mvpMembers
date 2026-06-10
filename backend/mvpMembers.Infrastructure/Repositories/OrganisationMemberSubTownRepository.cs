using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Domain.Entities;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Repositories;

public class OrganisationMemberSubTownRepository(AppDbContext appDbContext) : IOrganisationMemberSubTownRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task AddAsync(OrganisationMemberSubTown subTown)
    {
        await _appDbContext.OrganisationMemberSubTowns.AddAsync(subTown);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrganisationMemberSubTown subTown)
    {
        _appDbContext.OrganisationMemberSubTowns.Update(subTown);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(OrganisationMemberSubTown subTown)
    {
        _appDbContext.OrganisationMemberSubTowns.Remove(subTown);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task<OrganisationMemberSubTown?> GetByIdAsync(long id)
    {
        return await _appDbContext.OrganisationMemberSubTowns
            .Include(x => x.OrganizationMemberCenter)
                .ThenInclude(x => x.OrganizationMemberTown)
            .FirstOrDefaultAsync(x => x.OrganisationMemberSubTownID == id);
    }

    public async Task<List<OrganisationMemberSubTown>> GetAllAsync()
    {
        return await _appDbContext.OrganisationMemberSubTowns
            .Include(x => x.OrganizationMemberCenter)
                .ThenInclude(x => x.OrganizationMemberTown)
            .ToListAsync();
    }

    public async Task<List<OrganisationMemberSubTown>> GetByCenterIdAsync(long centerId)
    {
        return await _appDbContext.OrganisationMemberSubTowns
            .Where(x => x.OrganizationMemberCenterID == centerId)
            .Include(x => x.OrganizationMemberCenter)
                .ThenInclude(x => x.OrganizationMemberTown)
            .ToListAsync();
    }

    public async Task<OrganisationMemberSubTown?> GetBySubTownIdAsync(string subTownId)
    {
        return await _appDbContext.OrganisationMemberSubTowns
            .Where(x => x.SubTownID == subTownId)
            .Include(x => x.OrganizationMemberCenter)
                .ThenInclude(x => x.OrganizationMemberTown)
            .FirstOrDefaultAsync();
    }
}