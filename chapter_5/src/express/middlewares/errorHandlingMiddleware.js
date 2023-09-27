// エラーハンドリングミドルウェアは、普通のミドルウェアの第一引数にエラーが追加され、4つの引数を受け取る
function errorHandlingMiddleware(err, req, res, next) {
  console.error("エラーが発生したのじゃ");
  body = {
    status: err.statusCode,
    message: err.message
  }

  res.status(err.statusCode)
  res.json(JSON.stringify(body))
}

module.exports = {
  errorHandlingMiddleware,
}