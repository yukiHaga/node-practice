function logMiddleware(req, res, next) {
  console.log("リクエストがきました")
  // 後続のミドルウェアに処理を受け渡す
  next()
}

module.exports = {
  logMiddleware,
}