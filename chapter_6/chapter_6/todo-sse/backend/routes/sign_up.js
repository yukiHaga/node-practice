"use strict"
const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const path = require("path")

router.route("/")
  .get((req, res) => {
    if (req.cookies.sessionId) {
      // 既にsessionIdというクッキーを持っているなら、リダイレクト
      res.redirect("/mypage")
    } else {
      // sendFileは絶対パスで指定しないといけから、path.resolveで絶対パスに変換する
      // てか一番良いのは、package.jsonとかで絶対パスで指定できるようにすることなんやけどね。
      const target = path.resolve(__dirname, "../public/sign_up.html")
      res.sendFile(target)
    }
  })
  .post((req, res) => {
    res.cookie("sessionId", crypto.randomUUID())
    // Postでこのmypage.htmlゲットしたは変だからリダイレクトさせる
    res.redirect("/mypage")
  })

module.exports = router
