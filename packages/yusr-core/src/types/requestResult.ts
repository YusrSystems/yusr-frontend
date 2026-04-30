export const ResultStatus = {
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,

  // 3xx Redirection
  MovedPermanently: 301,
  Found: 302,
  NotModified: 304,

  // 4xx Client Errors
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  Conflict: 409,
  PreconditionFailed: 412,
  UnprocessableEntity: 422,
  TooManyRequests: 429,

  // 5xx Server Errors
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504
} as const;

export type ResultStatus = (typeof ResultStatus)[keyof typeof ResultStatus];

export type RequestResult<T> = {
  data?: T;
  status: ResultStatus;
  title: string;
  errors: string[];
  warnings: string[];
};
