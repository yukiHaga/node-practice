// fetchUserByIdという非同期APIを想定
function fetchUserById(id) {
  return new Promise((resolve, reject) => {
    // DBの処理を想定
    setTimeout(() => {
      try {
        if (id == "不正なid") {
          throw new Error("不正なidです")
        }

        const user = {
          id,
          name: "hogefugas"
        }
        const encodedUser = JSON.stringify(user)
        resolve(encodedUser)
      } catch (err) {
        reject(err)
      }
    }, 2000)
  });
}

// parseUserという非同期APIを想定
//　だから非同期的の挙動をしたいsetTimeoutを使っている
// この関数ほんとはいらんけど
function parseUser(encodedUser) {
  return new Promise((resolve, reject) => {
    // パース処理が重いことを想定
    setTimeout(() => {
      try {
        const user = JSON.parse(encodedUser)
        resolve(user)
      } catch (err) {
        reject(err)
      }
    }, 2000)
  });
}

// formateNameという非同期APIを想定
function formateName(user) {
  return new Promise((resolve, reject) => {
    // 名前の変更処理が重いことを想定
    setTimeout(() => {
      try {
        resolve(`名前: ${user.name}`)
      } catch (err) {
        reject(err)
      }
    }, 2000)
  })
}

// yieldの仕組みを利用して複数の非同期処理を実行する関数
function* asyncWithGeneratorFactory(id) {
  try {
    // 非同期処理の実行
    // このジェネレータ関数の中では、非同期処理の前にyieldキーワードをつけるだけで非同期処理を
    // 同期処理と同じように扱うことができる
    // 初めてnextを実行すると、pending状態のpromiseインスタンスが返される
    const encodedUser = yield fetchUserById(id)
    const user = yield parseUser(encodedUser)
    const formatedName = yield formateName(user)
    return Promise.resolve(formatedName)
  } catch (err) {
    return Promise.reject(err)
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
  fetchUserById,
  parseUser,
  formateName,
  asyncWithGeneratorFactory,
  handleAsyncWithGenerator,
}
