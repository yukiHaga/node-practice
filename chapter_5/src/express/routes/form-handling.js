"use strict"
const express = require("express")
const router = express.Router()
// package.jsonやtsconfigを使うともっと綺麗になるかも
// パスでディレクトリを指定したら、そのディレクトリにあるindex.jsモジュールがインポートされてくるはず
const { User } = require("../models")

router.route("/")
  .post((req, res) => {
    const user = new User({ name: req.body.user_name })
    res.json(user)
  })

module.exports = router
