// 非同期的にJSONをparseする関数
// JSONのparse処理が結構重いものと仮定する
function parseJSONAsync(json) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        decodedUser = JSON.parse(json)
        resolve(decodedUser)
      } catch (err) {
        reject(err)
      }
    }, 2000)
  })
}

// yieldの仕組みを利用して非同期処理を実行する関数
function* asyncWithGeneratorFactory(json) {
  try {
    // 非同期処理の実行
    // このジェネレータ関数の中では、非同期処理の前にyieldキーワードをつけるだけで非同期処理を
    // 同期処理と同じように扱うことができる
    // 初めてnextを実行すると、pending状態のpromiseインスタンスが返される
    const result = yield parseJSONAsync(json)
    // nextの引数にvalueを指定すると、直前のyield結果を書き換えることができる
    console.log("パース結果", result);
  } catch (err) {
    console.log("エラーをキャッチ", err);
  }
}

// resolvedにはresolveされたPromiseインスタンスの値が入る
function handleAsyncWithGenerator(generator, resolved) {
  // 初回はresolvedには値が入っていない(undefined)
  const { done, value } = generator.next(resolved)
  if (done) {
    return Promise.resolve(value)
  }
  return value.then(
    // 正常系では再起呼び出し
    resolved => handleAsyncWithGenerator(generator, resolved),
    // 異常系ではthrow()メソッドを実行
    err => generator.throw(err)
  )
}

module.exports = {
  parseJSONAsync,
  asyncWithGeneratorFactory,
  handleAsyncWithGenerator,
}
