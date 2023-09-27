// fetchUserByIdという非同期APIを想定
function fetchUserById(id) {
  return new Promise((resolve, reject) => {
    // DBの処理を想定
    setTimeout(() => {
      try {
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

module.exports = {
  fetchUserById,
  parseUser,
  formateName,
}
