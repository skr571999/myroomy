const express = require("express")
const router = express.Router()
const { ensureAuthenticated } = require("../../config/auth")
const multer = require("multer")

// const passport = require("passport")
// const fs = require("fs")
// const bcrypt = require("bcryptjs")
// const User = require("../models/User.model")

let upload = multer({ dest: "app/uploads/" })
const user = require("../controllers/user.controller")

router.get("/signup", user.signup)

router.post("/add", upload.single("photo"), user.add)

router.get("/login", user.login)

router.post("/auth", user.auth)

router.get("/logout", ensureAuthenticated, user.logout)

router.get("/dashboard", ensureAuthenticated, user.dashboard)

router.get("/:id/photo", ensureAuthenticated, user.photo)

router.get("/all", ensureAuthenticated, user.all)

router.get("/edit", ensureAuthenticated, user.edit)

router.post("/editted", ensureAuthenticated, user.editted)

module.exports = router
