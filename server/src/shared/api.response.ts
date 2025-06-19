export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;

  constructor(success: boolean, message: string, data?: T, error?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T, message = "Success"): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string, error?: any): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null, error);
  }
}
