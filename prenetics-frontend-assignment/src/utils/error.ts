export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }

  static wrap(obj: unknown): AppError {
    if (obj instanceof AppError) {
      return obj;
    }

    if (obj instanceof Response) {
      return new AppError(obj.statusText, obj.status);
    }

    return new AppError("Something went wrong");
  }
}
