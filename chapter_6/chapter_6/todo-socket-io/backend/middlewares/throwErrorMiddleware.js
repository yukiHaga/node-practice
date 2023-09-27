// Expressではミドルウェアでnextがエラー引数で呼び出されるか、同期処理がエラーを投げたときに、そのエラーを捕虜してエラーハンドリングミドルウェアで処理する
// 独自のエラーハンドリングミドルウェアを用意していないなら、デフォルトのエラーハンドリングミドルウェアでエラーハンドリングが行われる
function throwErrorMiddleware(req, res, next) {
  next(new Error("ミドルウェアで発生したエラーだよん"))
}

module.exports = {
  throwErrorMiddleware,
}