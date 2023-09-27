const fs = require("fs")

function buildWriteStream() {
  return fs.createWriteStream("dest.txt")
}

function handleWriteStream() {
  writeStream = buildWriteStream()
  // 書き込みストリームにはwrite()でデータを流し
  writeStream.write("Hello\n")
  writeStream.write("World\n")
  // 全てのデータを流し終えたらend()を実行する。
  writeStream.end()
}

module.exports = {
  handleWriteStream,
}