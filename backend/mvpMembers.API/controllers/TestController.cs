using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace mvpMembers.API.Controllers;

[ApiController]
[Route("api/test")]
public class TestController
    : ControllerBase
{
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok(
            "Anyone can access");
    }

    [Authorize]
    [HttpGet("private")]
    public IActionResult Private()
    {
        return Ok(
            "Authenticated user");
    }
}