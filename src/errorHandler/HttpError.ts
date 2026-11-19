// Error con código HTTP. Las capas de abajo (service) lo lanzan con throw
// y el errorHandler lo convierte en la respuesta que corresponde (400, 404, etc.)
export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}
