"use strict"
const express = require("express")
const router = express.Router()
const path = require("path")

router.route("/")
  .get((req, res) => {
    if (req.cookies.sessionId) {
      const target = path.resolve(__dirname, "../public/mypage.html")
      res.sendFile(target)
    } else {
      res.redirect("/sign_up")
    }
  })

module.exports = router
