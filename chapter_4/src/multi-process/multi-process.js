"use strict"

const { fork, setupMaster } = require("cluster")
const cpuCount = require("os").cpus().length

console.log("メインプロセス", process.pid);

console.log(__dirname);

// サブプロセスが実行するファイルの指定
setupMaster({ exec: `${__dirname}/web-app`})

// CPUコアの数だけプロセスをフォーク
// 並列度の上限はコアの数までなので、コア数以上にプロセスをフォークすることに意味がない(逆に同一コア上でのプロセス間のコンテキストスイッチによるコストを発生させてしまう)
console.log({ cpuCount });
for (let i = 0; i < cpuCount; i++) {
  // forkメソッドを実行して、プロセスをフォークしている。
  // forkとは、プロセスが自身の複製を作成して新たなプロセスとして起動すること。元のプロセスをparent process、新たに生成されたプロセスをchild processと呼ぶ
  // それぞれ別のPIC(Process ID)が割り当てられ区別される
  // clusterモジュールのfork()メソッドは、フォークしたプロセスの情報などを保持するcluster.Workerインスタンスを返す
  // 通常すでに使用中のポート(たとえば3000とか)は他のところから使えない。しかし、cluster.fork()によって、フォークされたサブプロセス同士はポートを共有できる
  const sub = fork()
  console.log("サブプロセス", sub.process.pid);
}
