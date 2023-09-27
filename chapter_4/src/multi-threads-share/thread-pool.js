"use strict"

const { Worker } = require("worker_threads")

class ThreadPool {
  // 空きスレッド、キューを初期化

  // インスタンスのメンバ
  availableWorkers = []
  queue = []

  // sizeは生成するスレッドの数
  // Workerコンストラクタの第一引数(サブスレッドで実行するファイルパス)と第二引数(オプション)
  // は利用元から指定できるようにしておく。
  // リクエストを受け付けた時、空いているスレッドがあればそれを使って処理をするが、なければリクエストをキューに積む。
  // それぞれのスレッドは、割り当てられた処理が完了したら、キューからリクエストを(あれば)取り出して処理する
  constructor(size, filePath, options) {
    // 引数で指定された通りにスレッドを生成してプール
    for(let i = 0; i < size; i++) {
      // この別スレッドの生成時にメッセージイベントを登録していた
      // Workerインスタンスはされ続けている限り、GCで消されたりしないはず
      this.availableWorkers.push(new Worker(filePath, options))
    }
  }

  // 外部からの処理要求を受け付けるメソッド(このメソッドは非同期APIだね)
  executeInThread(arg) {
    return new Promise(resolve => {
      const request = { resolve, arg }
      // 空きスレッドがあればリクエストを処理しなければキューにつむ
      const worker = this.availableWorkers.pop()
      // jsでは#をつけるとプライベートになるそう
      // TSのprivateの方がまだわかりやすいな。#ってなんやねんってなりそう
      worker ? this.#process(worker, request) : this.queue.push(request)
    })
  }

  // 実際にスレッドで処理を実行するprivateメソッド
  // resolve, argはスレッド呼び出し時のパラメータ
  #process(worker, { resolve, arg }) {
    // 一回限りのリスナを登録している
    worker.once("message", result => {
      // リクエスト元に結果を返す
      // このresultがフィボナッチ数。
      resolve(result)

      // キューに積まれたリクエストがあれば処理をして、なければ空きスレッドに戻す
      const request = this.queue.shift()
      request
        ? this.#process(worker, request)
        : this.availableWorkers.push(worker)
    })
    // workerにメッセージを渡す
    // filePathを実行する予定のワーカーに対して、メッセージを送る
    //
    worker.postMessage(arg)
  }
}

module.exports = {
  ThreadPool,
}