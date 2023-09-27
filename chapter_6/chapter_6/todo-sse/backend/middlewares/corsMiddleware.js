function corsMiddleware(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.status(200).send()
  } else {
    // 後続のミドルウェアに処理を受け渡す
    // 要はヘッダーを付与しただけ
    next()
  }
  next()
}

module.exports = {
  corsMiddleware,
}