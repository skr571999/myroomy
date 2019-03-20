const express = require("express")
const session = require("express-session")
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const mongoose = require("mongoose")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000
const dbURL = require("./config/db.config").url

// Disable to use useFindAndModify globally
mongoose.set("useFindAndModify", false)
mongoose
	.connect(dbURL, { useNewUrlParser: true })
	.then(() => console.log("DB Connected"))
	.catch(err => {
		console.log(`DB unconnected\nError name: ${err.name}\nExiting...`)
		process.exit()
	})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true
	})
)
app.use(flash())

// Passport Setup
app.use(passport.initialize())
app.use(passport.session())
require("./config/passport.config")(passport)

// PUG Setup
app.set("views", "./app/views")
app.set("view engine", "pug")

// Room Model
const Room = require("./app/models/Room.model")

// Routings
app.use(express.static(path.join(__dirname + "/app/public")))
app.get("/", (req, res) => {
	Room.find({})
		.then(result => {
			res.render("home", {
				title: "Home",
				rooms: result,
				user: req.user
			})
		})
		.catch(err => {
			req.flash("error", "Error in the Request: " + err.name)
			res.render("home", {
				title: "Home",
				rooms: ""
			})
		})
})
app.use("/user", require("./app/routes/user.route"))
app.use("/room", require("./app/routes/room.route"))

app.listen(PORT, console.log(`Server running on ${PORT}`))
