const LocalStrategy = require("passport-local").Strategy
const User = require("../app/models/User.model")

module.exports = passport => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "userid",
				passwordField: "password"
			},
			(username, password, done) => {
				User.findOne({ userid: username })
					.then(user => {
						// check user exists
						if (!user) {
							console.log("Not a user")
							return done(null, false, { message: "User not founded" })
						}
						// Match password
						if (password === user.password) {
							console.log("Password Matched")
							return done(null, user)
						} else {
							// handle incorrect password
							console.log("Incorrect password")
							return done(null, false, { message: "Password Incorrect" })
						}
					})
					.catch(err => console.log(err))
			}
		)
	)

	passport.serializeUser((user, cb) => {
		cb(null, user.id)
	})

	passport.deserializeUser((id, cb) => {
		User.findById(id, (err, user) => {
			cb(err, user)
		})
	})
}
