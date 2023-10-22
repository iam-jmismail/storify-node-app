const { TokenExpiredError } = require("jsonwebtoken");

class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.message = message;
  }
}
class ForbiddenError extends Error {
  constructor(message = "You are forbidden from accessing this resource") {
    super(message);
    this.name = "ForbiddenError";
    this.message = message;
  }
}

class UnAuthorizedError extends Error {
  action;
  constructor(message = "You are Unauthorized to access", action = "LOGIN") {
    super(message);
    this.name = "UnAuthorizedError";
    this.message = message;
    this.action = action;
  }
}

class ResourceConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceConflictError";
    this.message = message;
  }
}

class UnHandledError extends Error {
  constructor(message = "UnHandled Exception") {
    super(message);
    this.name = "UnHandledError";
    this.message = message;
  }
}

class ValidationError extends Error {
  errors;
  constructor(errors, message) {
    super(message);
    this.name = "ValidationError";
    this.message = message;
    this.errors = errors;
  }
}

const errorHandler = (err, _req, res, _next) => {
  // Not Found Error
  if (err instanceof NotFoundError) {
    return res.sendNotFoundResponse(err.message);
  }

  // JWT Token Error
  if (err instanceof TokenExpiredError) {
    return res.sendUnAuthorizedResponse(err.message);
  }

  // UnAuthorized User
  if (err instanceof UnAuthorizedError) {
    return res.sendUnAuthorizedResponse(err.message, err.action);
  }

  // Forbideen User
  if (err instanceof ForbiddenError) {
    return res.sendForbiddenResponse(err.message);
  }

  // Resource Conflicts!
  if (err instanceof ResourceConflictError) {
    return res.sendConflictResponse(err.message);
  }

  // Validation Error !
  if (err instanceof ValidationError) {
    return res.sendUnprocessableEntityResponse(err.errors, err.message);
  }

  // Validation Error !
  if (err instanceof UnHandledError) {
    return res.sendUnhandledExceptionResponse(err.message);
  }

  // Other Errors
  return res.status(500).send({
    message: err.message ?? "Something went wrong! ",
  });
};

module.exports = {
  errorHandler,
  ValidationError,
  UnHandledError,
  ResourceConflictError,
  UnAuthorizedError,
  ForbiddenError,
  NotFoundError,
};
