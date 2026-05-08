export class AppError extends Error {
  statusCode: number;
  code: string;
  issues?: unknown;

  constructor(statusCode: number, code: string, message: string, issues?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.issues = issues;
  }
}
