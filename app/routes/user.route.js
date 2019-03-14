const express = require('express');
const passport = require('passport')
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');

const User = require('../models/User.model');

router.get('/signup', (req, res) => {
    let msgs = []
    if (!req.isAuthenticated()) {
        res.render('signup', {
            title: 'Sign Up'
        })
    } else {
        msgs.push('You are already logged in, first logout')
        res.send('You are already logged in, to add accout first logout')
    }
})

router.post('/add', (req, res) => {
    const { userid, email, name, mobileNumber, address, addharNumber, password } = req.body;
    let msgs = []

    User.findOne({ userid: userid })
        .then((user) => {
            // User Matched
            if (user) {
                msgs.push('User already registered')
                res.render('signup', {
                    msgs, userid, email, name, mobileNumber, address, addharNumber, password
                })
            } else {
                // User Not exists
                const newUser = new User({
                    userid, email, name, mobileNumber, address, addharNumber, password
                })

                newUser.save()
                    .then((result) => {
                        req.flash('success', 'User Registration Success')
                        res.redirect('/user/login')
                    })
                    .catch(err => {
                        res.send('User not Registered')
                    })
            }
        })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.post('/auth', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/login'
    })(req, res, next)
})

router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/user/login')
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