const express = require('express');
const passport = require('passport')
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const User = require('../models/User.model');
const Room = require('../models/Room.model');

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Sign Up'
    })
})

router.post('/add', (req, res) => {
    const { username, password, occupation } = req.body;
    let messages = []

    User.findOne({ username: username })
        .then((user) => {
            // User Matched
            if (user) {
                messages.push('User already registered')
                res.render('signup', {
                    messages, username, password, occupation
                })
            } else {
                // User Not exists
                const newUser = new User({
                    username: username,
                    password: password,
                    occupation: occupation
                })

                newUser.save()
                    .then((result) => {
                        res.render('Login', {
                            title: 'Login'
                        })
                    })
                    .catch(err => {
                        res.send('User Registered')
                    })
            }
        })
})

// Login handle
router.post('/auth', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/error'
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/home')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    // res.send(`Welcome ${req.user}`)
    res.render('dashboard', {
        title: 'Dashboard',
        user: req.user
    })
});

router.get('/error', (req, res) => {
    res.send('Error in the Request')
})

router.get('/all', ensureAuthenticated, (req, res) => {
    // res.send(req.user)
    if (req.user.username === 'admin') {
        User.find()
            .then(result => {
                res.render('all', {
                    users: result,
                    user: req.user
                })
            })
            .catch(err => {
                res.send('Error: ', err.name)
                console.log('Error: ', err.name)
            })
    } else {
        // messages.push('You are not Authorised for this data')
        res.json(messages)
    }
})

// router.get('/edit', ensureAuthenticated, (req, res) => {
//     res.render('editUser', {
//         title: 'Editting User',
//         user: req.user
//     })
// })

// router.get('/editted',ensureAuthenticated,(req,res)=>{
// })

module.exports = router;