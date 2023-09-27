// "use strict"

// const { fork, setupMaster } = require("cluster")
// const cpuCount = require("os").cpus().length

// console.log("メインプロセス", process.pid);

// // サブプロセスが実行するファイルの指定
// setupMaster({
//   exec: `${__dirname}/web-app`,
//   //  IPCでやりとりするメッセージをJSON形式にシリアライズするわけではなく、構造化クローンアルゴリズムというアルゴリズムでシリアライズするようにする
//   serialization: "advanced",
// })

// // CPUコアの数だけプロセスをフォーク
// // 並列度の上限はコアの数までなので、コア数以上にプロセスをフォークすることに意味がない(逆に同一コア上でのプロセス間のコンテキストスイッチによるコストを発生させてしまう)
// for (let i = 0; i < cpuCount; i++) {
//   const sub = fork()
//   console.log("サブプロセス", sub.process.pid);

//   // マスタープロセスが、IPCでサブプロセスにポート番号を送信
//   sub.send(3000)
//   // IPCで受信したメッセージをハンドリング
//   sub.on("message", ({ pid, response, loggedAt }) => {
//     console.log(process.pid, `${pid}が${response}を返します`)
//     console.log("loggedAt", loggedAt);
//   })
// }

"use strict"

const { Worker, threadId } = require("worker_threads")

console.log("メインスレッド", threadId);

// CPUコアの数だけスレッドを起動
const cpuCount = require("os").cpus().length

for(let i = 0; i < cpuCount; i++) {
  // サブスレッドで実行するファイルのパスを指定してWorkerをnew
  // このWorkerはcluster.Workerとは別物
  const worker = new Worker(`${__dirname}/web-app.js`)
  console.log("サブスレッド", worker.threadId);
}