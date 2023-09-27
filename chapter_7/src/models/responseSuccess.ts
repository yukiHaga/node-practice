export const StatusSuccessCode = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
} as const;

export type StatusSuccessCode = (typeof StatusSuccessCode)[keyof typeof StatusSuccessCode];

export class ResponseSuccess {
  data: object;

  constructor(data: Partial<ResponseSuccess> = {}) {
    Object.assign(this, data);
  }
}
