"use strict"

// 指定された位置のフィボナッチ数を返す
function fibonacci(n) {
  // nが1以下の場合は、それ以外の場合は直前の2つのフィボナッチ数の和を返す
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

// workerDataでInt32Arrayインスタンスを受け取る
const { workerData: int32Array, parentPort } = require("worker_threads")

// メインスレッドからのメッセージを受信する
parentPort.on("message", n => {
  parentPort.postMessage(fibonacci(n))

  // 処理のたびに最初の値をインクリメントする
  int32Array[0] += 1
})