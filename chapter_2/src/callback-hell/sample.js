// fetchUserByIdという非同期APIを想定
function fetchUserById(id, callback) {
  // DBの処理を想定
  setTimeout(() => {
    try {
      const user = {
        id,
        name: "hogefugas"
      }
      const encodedUser = JSON.stringify(user)
      callback(null, encodedUser)
    } catch (err) {
      callback(err)
    }
  }, 2000)
}

// parseUserという非同期APIを想定
//　だから非同期的の挙動をしたいsetTimeoutを使っている
// この関数ほんとはいらんけど
function parseUser(encodedUser, callback) {
  // パース処理が重いことを想定
  setTimeout(() => {
    try {
      const user = JSON.parse(encodedUser)
      callback(null, user)
    } catch (err) {
      callback(err)
    }
  }, 2000)
}

// formateNameという非同期APIを想定
function formateName(user, callback) {
  // 名前の変更処理が重いことを想定
  setTimeout(() => {
    try {
      callback(null, `名前: ${user.name}`)
    } catch (err) {
      callback(err)
    }
  }, 2000)
}

module.exports = {
  fetchUserById,
  parseUser,
  formateName,
}