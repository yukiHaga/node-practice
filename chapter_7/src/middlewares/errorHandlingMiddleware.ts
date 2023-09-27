import { NextFunction, Request, Response } from "express";
import { AppError, ResponseError } from "~/models";

// エラーハンドリングミドルウェアは、普通のミドルウェアの第一引数にエラーが追加され、4つの引数を受け取る
export function errorHandlingMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("=== エラーが発生しました ===");

  const body = new ResponseError({ status: err.statusCode, message: err.message });

  res.status(err.statusCode).json(JSON.stringify(body));
}
