using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.Interfaces.Repositories;
using mvpMembers.Domain.Entities;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Repositories;

public class OrganizationMemberTownRepository(AppDbContext appDbContext) : IOrganizationMemberTownRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task AddAsync(OrganizationMemberTown organizationMemberTown)
    {
        await _appDbContext.OrganizationMemberTowns.AddAsync(organizationMemberTown);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrganizationMemberTown organizationMemberTown)
    {
        _appDbContext.OrganizationMemberTowns.Update(organizationMemberTown);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(OrganizationMemberTown organizationMemberTown)
    {
        _appDbContext.OrganizationMemberTowns.Remove(organizationMemberTown);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task<OrganizationMemberTown?> GetByIdAsync(long id)
    {
        return await _appDbContext.OrganizationMemberTowns.FindAsync(id);
    }

    public async Task<List<OrganizationMemberTown>> GetAllAsync()
    {
        return await _appDbContext.OrganizationMemberTowns.ToListAsync();
    }

    public async Task<OrganizationMemberTown?> GetByTownNameAsync(string townName)
    {
        return await _appDbContext.OrganizationMemberTowns
            .FirstOrDefaultAsync(x => x.TownName == townName);
    }
}
