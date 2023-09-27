"use strict"

const http = require("http")
const fibonacci = require("./fibonacci")
const pid = process.pid

// サブプロセスが起動すると、このファイルを上から順に実行していく
// つまり、サブプロセスにmessageイベントが登録されている
// IPCでメッセージを受信して指定されたポート番号でWebサーバーを起動
// IPCでのメッセージ受信はprocess.on("message", ハンドラ)で、メッセージ送信はprocess.send()で行います。
process.on("message", port => {
  console.log(pid, `ポート${port}でWebサーバーを起動します`);
  http.createServer((req, res) => {
    // リクエストがきた際の処理
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const n = Number(pathname.slice(1))

    if (Number.isNaN(n)) {
      // Number.isNaNで数値かどうかを判定し、数値でなかった場合は無視
      return res.end()
    }

    const response = fibonacci.fibonacci(n)
    const loggedAt = new Date()

    // 結果をIPCで送信
    process.send({ pid, response, loggedAt })
    res.end(response.toString())
  }).listen(port)
})