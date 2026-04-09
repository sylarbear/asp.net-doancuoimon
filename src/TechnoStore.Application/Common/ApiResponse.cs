namespace TechnoStore.Application.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string message = "Thành công")
            => new() { Success = true, Message = message, Data = data };

        public static ApiResponse<T> ErrorResponse(string message)
            => new() { Success = false, Message = message, Data = default };
    }
}
