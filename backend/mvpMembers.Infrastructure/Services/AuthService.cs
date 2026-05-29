using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using mvpMembers.Application.DTOs.Auth;
using mvpMembers.Application.Interfaces.Services;
using mvpMembers.Infrastructure.Persistence;

namespace mvpMembers.Infrastructure.Services;

public class AuthService(AppDbContext db, OTPService otpService) : IAuthService
{
    private readonly AppDbContext _db = db;
    private readonly OTPService _otpService = otpService;

    public async Task<bool> LoginAsync(LoginRequestDto loginRequest)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

        if (user is null)
            return false;

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password);

        if (!isPasswordValid)
            return false;
        
        var otp = new Random().Next(100000, 999999).ToString();

        await _otpService.StoreOTPAsync(user.Email, otp);

        // Have to implement email sending in production, for now we will just print the OTP to the console
        Console.WriteLine($"OTP for {user.Email}: {otp}"); 

        return true;
    }
}
