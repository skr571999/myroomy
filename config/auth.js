module.exports = {
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next()
		}
		req.flash("error", "You need to Login first")
		res.redirect("/user/login")
	}
}
