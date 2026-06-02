using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using mvpMembers.Application.Common;
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
            return Unauthorized(new ApiResponse<object>(false, "Invalid email or password", 401, null));

        return Ok(new ApiResponse<object>(true, "Login successful, OTP sent to email", 200, null));
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOTP(VerifyOTPRequestDto verifyOTPRequest)
    {
        var token = await _authService.VerifyOTPAsync(verifyOTPRequest);
        if (token is null)
            return Unauthorized(new ApiResponse<string>(false, "Invalid OTP", 401, null));

        return Ok(new ApiResponse<string>(true, "OTP verified successfully", 200, token));
    }
}