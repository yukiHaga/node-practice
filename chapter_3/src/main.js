// const fs = require("fs")

// fs.createReadStream("no-such-file.txt")
//   .on("error", err => console.log("エラーイベント", err.message))
//   .pipe(fs.createWriteStream("dest.txt"))
//   .on("error", err => console.log("エラーイベント", err.message))

// =>
// node main.js
// エラーイベント ENOENT: no such file or directory, open 'no-such-file.txt'

const fs = require("fs")
const stream = require("stream")

// stream.pipeline()は2つ以上のストリームを引数に取り、それらをpipe()で連結する
// 連結したストリームのどこかでエラーが発生した場合、最後の引数として渡したコールバックがそのエラーを引数に実行される
// エラーの発生なくストリームが終了した場合、コールバックが引数なしで実行される
// いずれの場合でも、引数に渡したストリームは全て自動的に破棄される(コンピュータリソースであるメモリのメモリリークの心配がない)
stream.pipeline(
  // pipe()したい2つ以上のストリーム
  fs.createReadStream("no-such-file.txt"),
  fs.createWriteStream("dest.txt"),
  // コールバック
  err => err
    ? console.error("エラー発生", err.message)
    : console.log("正常終了")
)

// =>
// node main.js
// エラー発生 ENOENT: no such file or directory, open 'no-such-file.txt'