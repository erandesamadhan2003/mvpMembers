using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.DTOs.Auth;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Services;

public class AuthService(AppDbContext db, IJwtService jwtService) : IAuthService
{
    private readonly AppDbContext _db = db;
    private readonly IJwtService _jwtService = jwtService;

    public async Task<string?> LoginAsync(LoginRequestDto loginRequest)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
        if (user is null) return null;

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password);
        if (!isPasswordValid) return null;

        return _jwtService.GenerateToken(user);
    }

}
