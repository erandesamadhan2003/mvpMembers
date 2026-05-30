namespace mvpMembers.Application.DTOs.Auth;

public class VerifyOTPRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string OTP { get; set; } = string.Empty;
}
