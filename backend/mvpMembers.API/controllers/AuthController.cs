using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.DTOs.Auth;
using mvpMembers.Application.Interfaces.Services;

namespace mvpMembers.API.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto loginRequest)
    {
        var result = await _authService.LoginAsync(loginRequest);

        if (!result)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(new { message = "Login successful, OTP sent to email" });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOTP(VerifyOTPRequestDto verifyOTPRequest)
    {
        var token = await _authService.VerifyOTPAsync(verifyOTPRequest);
        if (token is null)
            return Unauthorized(new { message = "Invalid OTP" });

        return Ok(new { AccessToken = token });
    }
}