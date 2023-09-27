"use strict"

const http = require("http")
const fibonacci = require("./fibonacci")

// サーバオブジェクトの生成とリクエストハンドラの設定
// createServerで各パターンか
http.createServer((request, response) => {
  // http://localhost:3000/10へのリクエストでは、req.urlは"/10"になるので、
  // そこから1文字目を取り除いてnを取得する
  // このNode.jsのreq.urlって直感的じゃないな。req.pathとかの方が絶対良い
  // console.log(req.url); // => /10
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;
  const n = Number(pathname.slice(1))

  if (Number.isNaN(n)) {
    // Number.isNaNで数値かどうかを判定し、数値でなかった場合は無視
    return res.end()
  }

  const result = fibonacci.fibonacci(n)
  // res.end()で計算結果をレスポンスとして返す
  response.end(result.toString())
}).listen(3000) // 3000番ポートでリクエストを待機