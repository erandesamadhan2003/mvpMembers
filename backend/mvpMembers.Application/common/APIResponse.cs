namespace mvpMembers.Application.Common;

public class ApiResponse<T>(bool success, string message, int statusCode, T? data)
{
    public bool Success { get; set; } = success;
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = statusCode;
    public T? Data { get; set; } = data;
}