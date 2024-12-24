"use strict";
const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict error",
};
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.CONFLICT
  ) {
    super(message, status);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.CONFLICT
  ) {
    super(message, status);
  }
}
class FORBIDDEN extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    status = StatusCode.FORBIDDEN
  ) {
    super(message, status);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    status = StatusCode.NOT_FOUND
  ) {
    super(message, status);
  }
}

module.exports = { AuthFailureError, ConflictRequestError, BadRequestError ,NotFoundError, NotFoundRequestError};
