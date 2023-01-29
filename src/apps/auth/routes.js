const express = require('express');
const multer = require('multer');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');

const { ensureAuthenticated } = require('../../utils/auth');
const SendMail = require('../../utils/SendMail');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router
    .route('/signup')
    .get((req, res) => {
        if (!req.isAuthenticated()) {
            return res.render('user/signup', { title: 'Signup' });
        }
        req.flash('warning', 'You are already logged in');
        res.redirect('/');
    })
    .post(upload.single('photo'), async (req, res) => {
        try {
            const token = cryptoRandomString({ length: 16 });
            const { userid, email, name, gender, mobileNumber, address, password } = req.body;
            let msgs = [];
            let photo = {};

            if (req.file) {
                photo = {
                    contentType: req.file.mimetype,
                    image: fs.readFileSync(req.file.path),
                };
            }

            let existingUser = await User.findOne({ userid: userid });
            if (existingUser) {
                msgs.push('UserID already registered');
                return res.render('user/signup', { msgs, ...req.body });
            }

            existingUser = await User.findOne({ email: email });
            if (existingUser) {
                msgs.push('User Email already registered');
                res.render('user/signup', { msgs, ...req.body });
            }

            const newUser = new User({ userid, email, name, gender, mobileNumber, address, token, photo, password });

            // Hash Password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newUser.password, salt);
            newUser.password = hash;
            await newUser.save();

            let link = `${req.protocol}://${req.get('host')}`;
            await SendMail.verify(email, token, link);
            console.log('Email Sended Success');
            req.flash('success', 'Account maded successfully, Check your email to Verify');
            res.redirect('/user/login');
        } catch (error) {
            console.log('Signup Error :', error);
            req.flash('danger', 'Error in registration, Signup Again');
            res.redirect('/user/signup');
        }
    });

router
    .route('/login')
    .get((req, res) => {
        if (!req.isAuthenticated()) {
            return res.render('user/login', { title: 'Login' });
        }

        req.flash('warning', 'You are already logged in.');
        return res.redirect('/');
    })
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        })(req, res, next);
    });

router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Logout Success');
    res.redirect('/login');
});

module.exports = router;
