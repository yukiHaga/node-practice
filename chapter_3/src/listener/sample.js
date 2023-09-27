const events = require("events")

// この実装には一部問題がある
function createFizzBuzzEventEmitter(until) {
  // これがサブジェクト
  const eventEmitter = new events.EventEmitter()
  // これはreturnが実行された後に実行される
  // async関数自体は非同期処理
  // この関数の下にconsole.logを書けばわかる
  // ただ、同期的に呼び出しているから、イベント自体は関数が終了した関数が終了した後に同期的に発行されると思われる
  // _emitFizzBuzz(eventEmitter, until)

  // イベントの発行を常に非同期にするため、process.nextTick()を使用
  // process.nextTickがスケジュールしたコールバックは、それを実行するための特定のフェーズを持たない
  // 代わりにこのコールバックは特定のフェーズに属さないnextTickQueueと呼ばれるキューにつまれ、現在実行中の処理の完了後
  // すぐ(イベントループが次のフェーズへ進む前に)実行される。このため、フェーズを跨がなければ実行されないsetTimeoutのコールバックより
  // 早く実行される
  // この フェーズの処理の中では実行されないってことか行されないってことか?
  process.nextTick(() => _emitFizzBuzz(eventEmitter, until))
  return eventEmitter
}

// async/await構文が使えるよう、イベントを発行する部分を別の関数に切り離す
// startイベントが条件にかかわらず発行されないのは、createFizzBuzzEventEmitter()の中で
// emit("start")が常に同期的に実行されるためである
// onメソッドで登録したリスナは、登録前に発行されたイベントに対しては呼ばれない
async function _emitFizzBuzz(eventEmitter, until) {
  console.log("_emitFizzBuzzの中");
  // emitは指定したイベント(第一引数)を指定した引数(第二引数以降、任意)で発行する
  eventEmitter.emit("start")
  let count = 1
  while (count <= until) {
    // 0.1秒刻み
    await new Promise(resolve => setTimeout(resolve, 100))
    if (count % 15 === 0) {
      eventEmitter.emit("FizzBuzz", count)
    } else if (count % 3 === 0) {
      eventEmitter.emit("Fizz", count)
    } else if (count % 5 === 0) {
      eventEmitter.emit("Buzz", count)
    }
    count += 1
  }
  eventEmitter.emit("end")
}

function startListener() {
  console.log("start");
}

function fizzListener(count) {
  console.log("Fizz", count);
}

function buzzListener(count) {
  console.log("FizzBuzz", count);
}

function fizzBuzzLister(count) {
  console.log("FizzBuzz", count);
}

function endListener() {
  console.log("end");
  // EventEmitterの主要なインスタンスメソッドの中でemit以外のメソッドはそのメソッドを持つ
  // EventEmitterインスタンスを返すため、メソッドチェーンが可能になっている
  // リスナに渡す関数の中ではthisによってEventEmitterインスタンスにアクセスできる
  // emit()メソッドの戻り値はそのイベントに対するリスナが登録されているかどうかを示すbooleanです
  // offは指定したイベントに登録されたリスナを削除する
  // 以下の処理では全てのイベントからリスナを削除している
  this
    .off("start", startListener)
    .off("Fizz", fizzListener)
    .off("FizzBuzz", fizzBuzzLister)
    .off("end", endListener)
}

// Buzzイベントだけonceで登録
// onceはonと同様にイベントに対するリスナを登録するが、このリスナはイベントが1回発行されたら、自動的に削除され
// 2回目以降のイベントでは実行されない
// createFizzBuzzEventEmitter(40)
//   .on("start", startListener)
//   .on("Fizz", fizzListener)
//   .once("Buzz", buzzListener)
//   .on("FizzBuzz", fizzBuzzLister)
//   .on("end", endListener)

// startイベントで登録したリスナが実行されない
createFizzBuzzEventEmitter(40)
  .on("start", startListener)
  .on("end", endListener)