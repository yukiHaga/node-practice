export const StatusErrorCode = {
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
} as const;

export type StatusErrorCode = (typeof StatusErrorCode)[keyof typeof StatusErrorCode];

export class ResponseError {
  status: StatusErrorCode;
  message: string;

  constructor(data: Partial<ResponseError> = {}) {
    Object.assign(this, data);
  }
}
