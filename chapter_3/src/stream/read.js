const fs = require("fs")

const readStream = fs.createReadStream("./Centos.vdi")

function handleReadStream() {
  readStream
    .on("readable", () => {
      // readableイベントを発行する
      console.log("readable");
      let chunk;
      // 現在読み込み可能なデータを全て読み込む
      // チャンクは、送信や処理中のデータの一部のデータのこと
      while((chunk = readStream.read()) !== null) {
        console.log(`chunk: ${chunk.toString()}`);
      }
    })
    .on("end", () => console.log("end")) // endイベントリスナの登録
}

const stream = require("stream")
class HenaReadableStream extends stream.Readable {
  constructor(options) {
    // スーパークラスのコンストラクタ呼び出している
    super(options)
    // 読み込みストリームに対して、あらかじめ流されているデータ
    this.languages = ["JavaScript", "Python", "Java", "C#"]
  }

  // _read()はNode.jsのストリームの内部実装の中で実行されることを想定したものであり、
  // 決して外部から直接実行してはならない。readableイベントリスなの中でそうしているように、外部からのストリームの読み込みを実行したい場合は、read()を使う
  _read(size) {
    console.log("_read()");
    let language
    while ((language = this.languages.shift())) {
      // Array.prototype.pushではなく、readable.push
      // push()でこのストリームからのデータを流す
      // ただし、push()がfalseを返したら、読み込みストリームはそれ以上データを流さない
      if (!this.push(`Hello, ${language}!\n`)) {
        console.log("読み込み中断");
        return
      }
    }

    // データを全て流し終わったら、最後にnullを流してストリームの終了を通知する
    console.log("読み込み完了");
    this.push(null)
  }
}

module.exports = {
  handleReadStream,
  HenaReadableStream,
}

// =>
// node main.js
// readable
// chunk: The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

// Where can I get some?
// There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.

// 5
// 	paragraphs
// 	words
// 	bytes
// 	lists
// 	Start with 'Lorem
// ipsum dolor sit amet...'

// readable
// end