"use strict"

const http = require("http")
const { Worker } = require("worker_threads")
const cpuCount = require("os").cpus().length
const { ThreadPool } = require("./thread-pool")

// CPUコア数と同じサイズのスレッドプールを作成
const threadPool = new ThreadPool(cpuCount, `${__dirname}/fibonacci.js`)

// リクエストを受け付ける処理自体は非同期的な処理(async)だから、前の処理が後続のリクエストが捌けないとかはなさそう
http.createServer(async (req, res) => {
  // リクエストがきた際の処理
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const n = Number(pathname.slice(1))

  if (Number.isNaN(n)) {
    // Number.isNaNで数値かどうかを判定し、数値でなかった場合は無視
    return res.end()
  }

  // ここでawaitされるのか
  const result = await threadPool.executeInThread(n)
  res.end(result.toString())

}).listen(3000)
