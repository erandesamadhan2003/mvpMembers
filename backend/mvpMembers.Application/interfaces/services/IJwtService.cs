using mvpMembers.Domain.Entities;

namespace mvpMembers.Application.Interfaces.Services;
public interface IJwtService
{
    string GenerateToken(User user);
}