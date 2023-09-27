class User {
  id = ""
  name = ""

  constructor(data) {
    Object.assign(this, data)
  }
}

module.exports = {
  User,
}