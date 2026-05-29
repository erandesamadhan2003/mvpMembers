using BCrypt.Net;

namespace mvpMembers.API.Properties;

internal static class HashPassword
{
    public static void Main()
    {
        Console.WriteLine(
            BCrypt.Net.BCrypt.HashPassword(
                ""
            )
        );
    }
}
