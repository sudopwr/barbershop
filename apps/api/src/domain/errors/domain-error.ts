/**
 * Base class for every business-rule failure. The HTTP layer maps each
 * subclass to a status code; nothing in the domain knows about HTTP.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
}

export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';
}

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
}
