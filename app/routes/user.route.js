const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const multer = require("multer");

let upload = multer({ dest: "app/uploads/" });
const user = require("../controllers/user.controller");
const User = require("../models/User.model");

router.get("/signup", user.signup);

router.post("/add", upload.single("photo"), user.add);

router.get("/login", user.login);

router.post("/auth", user.auth);

router.get("/logout", ensureAuthenticated, user.logout);

router.get("/dashboard", ensureAuthenticated, user.dashboard);

router.get("/:id/photo", ensureAuthenticated, user.photo);

router.get("/all", ensureAuthenticated, user.all);

router.get("/edit", ensureAuthenticated, user.edit);

router.post("/editted", ensureAuthenticated, user.editted);

router.get("/verify/:email/:token", (req, res) => {
  // console.log(req.params);
  User.findOne({ email: req.params.email })
    .then(result => {
      if (result.token === req.params.token) {
        User.findOneAndUpdate(
          { _id: result._id },
          {
            $unset: { token: 1 },
            $set: {
              verified: true
            }
          }
        )
          .then(result1 => {
            console.log(result1.email);
            // res.send("Verified Successfully");
            req.flash("success", "Verified Successfully");
            res.redirect("user/login");
          })
          .catch(err => {
            console.log(err);
            res.send("Error In Verification");
          });
      } else {
        res.send("Token not matched");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
