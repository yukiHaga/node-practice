"use strict"

const { parentPort, workerData } = require("worker_threads")

// メインスレッドに返す
parentPort.postMessage(
  workerData.buffer,
  // postMessage()の第二引数に転送対象オブジェクトを指定
  workerData.transfer ? [workerData.buffer] : []
)
