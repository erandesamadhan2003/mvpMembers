using mvpMembers.Application.DTOs.Auth;

namespace mvpMembers.Application.Interfaces.Services;

public interface IAuthService
{
    Task<string?> LoginAsync(LoginRequestDto loginRequest);
}