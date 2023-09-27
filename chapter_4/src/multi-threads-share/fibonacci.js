"use strict"

// 指定された位置のフィボナッチ数を返す
function fibonacci(n) {
  // nが1以下の場合は、それ以外の場合は直前の2つのフィボナッチ数の和を返す
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

// const { workerData, parentPort } = require("worker_threads")

// // フィボナッチ数の計算結果をメインスレッドに送信
// // workerDataでメインスレッドから入力を受け取り、その値に対応するフィボナッチ数を計算して
// // parentPort.postMessage()でメインスレッドに返す。
// parentPort.postMessage(fibonacci(workerData))

// module.exports = {
//   fibonacci,
// }

const { parentPort } = require("worker_threads")

// messageイベントの監視により、メインスレッドからのメッセージの受信を待機
// 受信したらフィボナッチ数を計算して結果をメインスレッドに送信
// parentPortオブジェクトには、onメソッドが生えており、
// 'message'イベントを処理するイベントハンドラーを登録することで、メインスレッドからのデータを受信できるようになります:
parentPort.on("message", n => parentPort.postMessage(fibonacci(n)))
