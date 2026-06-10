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
        var token = await _authService.LoginAsync(loginRequest);
        if (token is null)
            return Unauthorized(new ApiResponse<object>(false, "Invalid email or password", 401, null));

        return Ok(new ApiResponse<string>(true, "Login successful", 200, token));
    }
}