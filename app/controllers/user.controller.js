const passport = require("passport");
const User = require("../models/User.model");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");

const SendMail = require("./SendMail");

module.exports.signup = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("user/signup", {
      title: "Sign Up"
    });
  } else {
    req.flash("warning", "You are already logged in, first logout");
    res.redirect("/user/dashboard");
  }
};

module.exports.add = (req, res) => {
  const token = cryptoRandomString(16);
  const {
    userid,
    email,
    name,
    gender,
    mobileNumber,
    address,
    password
  } = req.body;
  let msgs = [];
  let finalImg;

  if (req.file) {
    finalImg = {
      contentType: req.file.mimetype,
      image: fs.readFileSync(req.file.path)
    };
  } else {
    finalImg = "";
  }

  User.findOne({ userid: userid }).then(user => {
    // User Matched
    if (user) {
      msgs.push("UserID already registered");
      res.render("user/signup", {
        msgs,
        userid,
        email,
        name,
        gender,
        mobileNumber,
        address,
        password
      });
    } else {
      User.findOne({ email: email }).then(result => {
        if (result) {
          msgs.push("User Email already registered");
          res.render("user/signup", {
            msgs,
            userid,
            email,
            name,
            gender,
            mobileNumber,
            address,
            password
          });
        } else {
          // User Not exists
          const newUser = new User({
            userid,
            email,
            name,
            gender,
            mobileNumber,
            address,
            token,
            photo: finalImg,
            password
          });

          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              // Set Password to the Hash
              newUser.password = hash;

              // Save the User
              newUser
                .save()
                .then(result => {
                  SendMail.verify(email, token)
                    .then(result2 => {
                      console.log("Email Sended Success");
                    })
                    .catch(err => {
                      console.log("Verify Email Error : ", err);
                    });
                  req.flash(
                    "success",
                    "Account maded successfully, Check your email to Verify"
                  );
                  res.redirect("/user/login");
                })
                .catch(err => {
                  console.log("Signup Error :", err);
                  req.flash("danger", "Error in registration, Signup Again");
                  res.redirect("/user/signup");
                });
            });
          });
        }
      });
    }
  });
};

module.exports.login = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("user/login", {
      title: "Login"
    });
  } else {
    req.flash("warning", "You are already logged in.");
    res.render("user/login", {
      title: "Login"
    });
  }
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logout Success");
  res.redirect("/user/login");
};

module.exports.dashboard = (req, res) => {
  res.render("user/dashboard", {
    title: "Dashboard",
    user: req.user
  });
};

module.exports.edit = (req, res) => {
  res.render("user/edit", {
    title: "Editting User",
    user: req.user
  });
};

module.exports.auth = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req, res, next);
};

module.exports.all = (req, res) => {
  if (req.user.userid === "admin") {
    User.find({}, { _id: 0, email: 1, userid: 1, address: 1 })
      .then(result => {
        res.render("user/all", {
          title: "All User",
          users: result,
          user: req.user
        });
      })
      .catch(err => {
        console.log("Error: ", err.name);
        req.flash("error", "Error in the Request");
        res.render("user/all", {
          title: "All User",
          user: req.user
        });
      });
  } else {
    req.flash("warning", "You are not Authorised for this data");
    res.redirect("/user/dashboard");
  }
};

module.exports.editted = (req, res) => {
  const { userid, name, mobileNumber } = req.body;
  User.updateOne({ userid: userid }, { name: name, mobileNumber: mobileNumber })
    .then(result => {
      req.flash("success", "Detail updated successfully");
      res.redirect("/user/dashboard");
    })
    .catch(err => {
      console.log("Update Error : ", err.name);
      req.flash("danger", "Error in the request");
      res.redirect("/user/dashboard");
    });
};

module.exports.photo = (req, res) => {
  User.find({ userid: req.params.id }, { _id: 0, photo: 1, name: 1 })
    .then(result => {
      if (result[0].photo.contentType !== undefined) {
        res.contentType(result[0].photo.contentType);
        res.send(result[0].photo.image);
      } else {
        let a = result[0].name[0].toUpperCase();
        res.contentType("image/png");
        let defaultAvatar = fs.readFileSync(`app/defaultAvatar/${a}.png`);
        res.send(defaultAvatar);
      }
    })
    .catch(err => {
      console.log("Image Error: ", err.name);
      res.contentType("image/png");
      let defaultAvatar = fs.readFileSync("app/defaultAvatar/A.png");
      res.send(defaultAvatar);
    });
};
