export class AppError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor({
    message,
    status = 500,
    code,
    details,
  }: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
  }) {
    super(message);

    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
