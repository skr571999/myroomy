const express = require("express")
const passport = require("passport")
const router = express.Router()
const { ensureAuthenticated } = require("../../config/auth")
const multer = require("multer")
const fs = require("fs")
const bcrypt = require("bcryptjs")

let upload = multer({ dest: "app/uploads/" })
const User = require("../models/User.model")

router.get("/signup", (req, res) => {
  let msgs = []
  if (!req.isAuthenticated()) {
    res.render("user/signup", {
      title: "Sign Up"
    })
  } else {
    req.flash("warning", "You are already logged in, first logout")
    res.redirect("/user/dashboard")
  }
})

router.post("/add", upload.single("photo"), (req, res) => {
  const {
    userid,
    email,
    name,
    gender,
    mobileNumber,
    address,
    addharNumber,
    password
  } = req.body
  let msgs = []
  let finalImg

  if (req.file) {
    finalImg = {
      contentType: req.file.mimetype,
      image: fs.readFileSync(req.file.path)
    }
  } else {
    finalImg = ""
  }

  User.findOne({ userid: userid }).then(user => {
    // User Matched
    if (user) {
      msgs.push("User already registered")
      res.render("user/signup", {
        msgs,
        userid,
        email,
        name,
        gender,
        mobileNumber,
        address,
        addharNumber,
        password
      })
    } else {
      // User Not exists
      const newUser = new User({
        userid,
        email,
        name,
        gender,
        mobileNumber,
        address,
        addharNumber,
        photo: finalImg,
        password
      })

      // Hash Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err

          // Set Password to the Hash
          newUser.password = hash

          // Save the User
          newUser
            .save()
            .then(result => {
              req.flash("success", "Registration Success, You can login now")
              res.redirect("/user/login")
            })
            .catch(err => {
              console.log("Signup Error :", err)
              req.flash("danger", "Error in registration, Signup Again")
              res.redirect("/user/signup")
            })
        })
      })
    }
  })
})

router.get("/login", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("user/login", {
      title: "Login"
    })
  } else {
    req.flash("warning", "You are already logged in.")
    res.render("user/login", {
      title: "Login"
    })
  }
})

router.post("/auth", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req, res, next)
})

router.get("/logout", ensureAuthenticated, (req, res) => {
  req.logout()
  req.flash("success", "Logout Success")
  res.redirect("/user/login")
})

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("user/dashboard", {
    title: "Dashboard",
    user: req.user
  })
})

router.get("/:id/photo", ensureAuthenticated, (req, res) => {
  User.find({ userid: req.params.id }, { _id: 0, photo: 1, name: 1 })
    .then(result => {
      if (result[0].photo.contentType !== undefined) {
        res.contentType(result[0].photo.contentType)
        res.send(result[0].photo.image)
      } else {
        let a = result[0].name[0].toUpperCase()
        res.contentType("image/png")
        let defaultAvatar = fs.readFileSync(`app/defaultAvatar/${a}.png`)
        res.send(defaultAvatar)
      }
    })
    .catch(err => {
      console.log("Image Error: ", err.name)
      res.contentType("image/png")
      let defaultAvatar = fs.readFileSync("app/defaultAvatar/A.png")
      res.send(defaultAvatar)
    })
})

router.get("/all", ensureAuthenticated, (req, res) => {
  if (req.user.userid === "admin") {
    User.find({}, { _id: 0, email: 1, userid: 1, address: 1 })
      .then(result => {
        res.render("user/all", {
          title: "All User",
          users: result,
          user: req.user
        })
      })
      .catch(err => {
        console.log("Error: ", err.name)
        req.flash("error", "Error in the Request")
        res.render("user/all", {
          title: "All User",
          user: req.user
        })
      })
  } else {
    req.flash("warning", "You are not Authorised for this data")
    res.redirect("/user/dashboard")
  }
})

router.get("/edit", ensureAuthenticated, (req, res) => {
  res.render("user/edit", {
    title: "Editting User",
    user: req.user
  })
})

router.post("/editted", ensureAuthenticated, (req, res) => {
  const { userid, name, mobileNumber } = req.body
  User.updateOne({ userid: userid }, { name: name, mobileNumber: mobileNumber })
    .then(result => {
      req.flash("success", "Detail updated successfully")
      res.redirect("/user/dashboard")
    })
    .catch(err => {
      console.log("Update Error : ", err.name)
      req.flash("danger", "Error in the request")
      res.redirect("/user/dashboard")
    })
})

module.exports = router
