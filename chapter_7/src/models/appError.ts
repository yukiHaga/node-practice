import { StatusErrorCode } from "./responseError";

export class AppError extends Error {
  statusCode: StatusErrorCode;
  message: string;

  constructor(data: Partial<AppError> = {}) {
    // サブクラスにコンストラクタを書く場合、スーパークラスのコンストラクタは必ず呼び出す必要があります。
    // super呼び出しによって基底クラスのコンストラクタが実行されることです。
    super();
    Object.assign(this, data);
  }
}
