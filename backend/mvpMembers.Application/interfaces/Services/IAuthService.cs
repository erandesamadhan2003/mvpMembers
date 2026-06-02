using mvpMembers.Application.DTOs.Auth;

namespace mvpMembers.Application.Interfaces.Services;
public interface IAuthService
{
    Task<bool> LoginAsync(LoginRequestDto loginRequest);
    Task<string?> VerifyOTPAsync(VerifyOTPRequestDto verifyOTPRequest);
}