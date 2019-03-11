const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User.model')

module.exports = function (passport) {
    /* PASSPORT LOCAL AUTHENTICATION */
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username })
            .then(user => {
                // check user exists
                console.log(user)
                if (!user) {
                    console.log('Not a user')
                    return done(null, false)
                }
                // Match password
                if (password === user.password) {
                    console.log('Password Matched')
                    return done(null, user)
                } else {
                    // handle incorrect password
                    console.log('Incorrect password')
                    return done(null, false)
                }
            })
            .catch(err => console.log(err))
    }));

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            cb(err, user);
        });
    });
}