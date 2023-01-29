const express = require('express');
const fs = require('fs');
const { ensureAuthenticated } = require('../../utils/auth');

const router = express.Router();
const User = require('./models');

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('user/dashboard', { title: 'Profile', user: req.user });
});

router.get('/:id/photo', ensureAuthenticated, (req, res) => {
    User.find({ userid: req.params.id }, { _id: 0, photo: 1, name: 1 })
        .then((result) => {
            if (result[0].photo.contentType !== undefined) {
                res.contentType(result[0].photo.contentType);
                res.send(result[0].photo.image);
            } else {
                let a = result[0].name[0].toUpperCase();
                res.contentType('image/png');
                let defaultAvatar = fs.readFileSync(`app/defaultAvatar/${a}.png`);
                res.send(defaultAvatar);
            }
        })
        .catch((err) => {
            console.log('Image Error: ', err.name);
            res.contentType('image/png');
            let defaultAvatar = fs.readFileSync('app/defaultAvatar/A.png');
            res.send(defaultAvatar);
        });
});

router.get('/all', ensureAuthenticated, (req, res) => {
    if (req.user.userid === 'admin') {
        User.find({}, { _id: 0, email: 1, userid: 1, address: 1 })
            .then((result) => {
                res.render('user/all', {
                    title: 'All User',
                    users: result,
                    user: req.user,
                });
            })
            .catch((err) => {
                console.log('Error: ', err.name);
                req.flash('error', 'Error in the Request');
                res.render('user/all', {
                    title: 'All User',
                    user: req.user,
                });
            });
    } else {
        req.flash('warning', 'You are not Authorized');
        res.redirect('/user/dashboard');
    }
});

router
    .route('/update')
    .get(ensureAuthenticated, (req, res) => {
        res.render('user/update', { title: 'Update Profile', user: req.user });
    })
    .post(ensureAuthenticated, (req, res) => {
        if (req.user.userid === 'admin') {
            User.find({}, { _id: 0, email: 1, userid: 1, address: 1 })
                .then((result) => {
                    res.render('user/all', {
                        title: 'All User',
                        users: result,
                        user: req.user,
                    });
                })
                .catch((err) => {
                    console.log('Error: ', err.name);
                    req.flash('error', 'Error in the Request');
                    res.render('user/all', {
                        title: 'All User',
                        user: req.user,
                    });
                });
        } else {
            req.flash('warning', 'You are not Authorised for this data');
            res.redirect('/user/dashboard');
        }
    });

router.get('/verify/:email/:token', (req, res) => {
    User.findOne({ email: req.params.email })
        .then((result) => {
            if (result.token === req.params.token) {
                User.findOneAndUpdate(
                    { _id: result._id },
                    {
                        $unset: { token: 1 },
                        $set: {
                            verified: true,
                        },
                    }
                )
                    .then((result1) => {
                        console.log(result1.email + ' verified');
                        res.send("Verified Successfully, You can login now at<a href='https://myroomy.herokuapp.comm/user/login'>Login</a>");
                        // req.flash("success", "Verified Successfully");
                        // res.redirect("user/login");
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send('Error In Verification');
                    });
            } else {
                res.send('Token not matched');
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
