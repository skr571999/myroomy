const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../apps/user/User.model');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'userid',
                passwordField: 'password',
            },
            (username, password, done) => {
                User.findOne({ userid: username })
                    .then((user) => {
                        // check user exists
                        if (!user) {
                            console.log('Not a user');
                            return done(null, false, { message: 'User not founded' });
                        }

                        //  Matched the Password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) throw err;

                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'Password Incorrect' });
                            }
                        });
                    })
                    .catch((err) => console.log(err));
            }
        )
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            cb(err, user);
        });
    });
};
