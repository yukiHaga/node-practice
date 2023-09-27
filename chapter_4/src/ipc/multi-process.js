"use strict"

const { fork, setupMaster } = require("cluster")
const cpuCount = require("os").cpus().length

console.log("メインプロセス", process.pid);

// サブプロセスが実行するファイルの指定
setupMaster({
  exec: `${__dirname}/web-app`,
  //  IPCでやりとりするメッセージをJSON形式にシリアライズするわけではなく、構造化クローンアルゴリズムというアルゴリズムでシリアライズするようにする
  serialization: "advanced",
})

// CPUコアの数だけプロセスをフォーク
// 並列度の上限はコアの数までなので、コア数以上にプロセスをフォークすることに意味がない(逆に同一コア上でのプロセス間のコンテキストスイッチによるコストを発生させてしまう)
for (let i = 0; i < cpuCount; i++) {
  // チャイルドプロセス
  const childProcess = fork()
  console.log("チャイルドプロセス", sub.process.pid);

  // このファイル自体はマスタープロセスで実行している
  // マスタープロセスが、IPCでサブプロセスにポート番号を送信
  childProcess.send(3000)
  // IPCで受信したメッセージをハンドリング
  childProcess.on("message", ({ pid, response, loggedAt }) => {
    console.log(process.pid, `${pid}が${response}を返します`)
    console.log("loggedAt", loggedAt);
  })
}
