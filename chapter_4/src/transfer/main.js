"use strict"

const perf_hooks = require("perf_hooks")
const { Worker } = require("worker_threads")

function useMaybeTransfer(transfer) {
  // 1GBのArrayBufferを生成
  const buffer = new ArrayBuffer(1024 * 1024 * 1024)
  // 現在時刻を記録
  const start = perf_hooks.performance.now()
  new Worker(
    "./maybe-transfer.js",
    {
      workerData: { buffer, transfer },
      // transferListプロパティに転送対象オブジェクトを指定
      transferList: transfer ? [buffer] : []
    }
  ).on("message", () => {
    // サブスレッドから値が戻ってくるまでにかかった時間を出力
    console.log(perf_hooks.performance.now() - start)
  })

  // サブスレッドに渡した値がどう見えるか確認
  console.log(buffer);
}

// 転送を利用する場合
useMaybeTransfer(true)

// 転送を利用しない場合(値のコピー)
useMaybeTransfer(false)