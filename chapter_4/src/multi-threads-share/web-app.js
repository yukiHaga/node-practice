"use strict"

const http = require("http")
const cpuCount = require("os").cpus().length
const { ThreadPool } = require("./thread-pool")

// スレッド間で共有したい値をSharedArrayBufferでラップする
const sharedArrayBuffer = new SharedArrayBuffer(4)
// 長さ1のInt32Arrayインスタンスを生成
const int32Array = new Int32Array(sharedArrayBuffer)

// CPUコア数と同じサイズのスレッドプールを作成
const threadPool = new ThreadPool(
  cpuCount,
  `${__dirname}/fibonacci.js`,
  { workerData: int32Array } // Int32Arrayインスタンスをスレッドプールに渡す
)

// メインスレッド側のカウンタ
let count = 0

// リクエストを受け付ける処理自体は非同期的な処理(async)だから、前の処理が後続のリクエストが捌けないとかはなさそう
http.createServer(async (req, res) => {
  // リクエストがきた際の処理

  // /callsに対してはトラッキングしているリクエスト回数を返す
  if (req.url === "/calls") {
    return res.end(`Main = ${count}, Sub = ${int32Array[0]}`)
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const n = Number(pathname.slice(1))

  if (Number.isNaN(n)) {
    // Number.isNaNで数値かどうかを判定し、数値でなかった場合は無視
    return res.end()
  }

  count += 1
  // ここでawaitされるのか
  const result = await threadPool.executeInThread(n)
  res.end(result.toString())
}).listen(3000)
