const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

let upload = multer({ dest: 'uploads/' });

const { ensureAuthenticated } = require('../../utils/auth');
const SendMail = require('../../utils/SendMail');
const RoomModel = require('./Room.model');
const UserModel = require('../user/User.model');

router.get('/new', ensureAuthenticated, (req, res) => {
    if (req.user.userid === 'admin') {
        res.render('room/new', {
            title: 'Add New Room',
            user: req.user,
        });
    } else {
        req.flash('success', 'Access Denied');
        res.redirect('/');
    }
});

router.post('/add', ensureAuthenticated, upload.array('photos', 4), (req, res) => {
    let finalImgs = [];

    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            finalImgs[i] = {
                contentType: req.files[i].mimetype,
                image: fs.readFileSync(req.files[i].path),
            };
        }
    } else {
        for (let i = 0; i < req.files.length; i++) {
            finalImgs[i] = '';
        }
    }

    const { location, features, persons, price } = req.body;
    let userid = req.user.userid;

    const newRoom = new RoomModel({
        location,
        features,
        persons,
        price,
        userid,
        photos: finalImgs,
    });
    newRoom
        .save()
        .then((result) => {
            console.log(result);
            req.flash('success', 'Room added');
            res.redirect('/room/' + result._id);
        })
        .catch((err) => {
            console.log(err.name);
            req.flash('error', 'Error in the Request');
            res.redirect('/user/new');
        });
});

router.get('/all', (req, res) => {
    if (req.isAuthenticated()) {
        RoomModel.find({}).then((result) => {
            res.render('room/all', {
                title: 'All Room',
                rooms: result,
                user: req.user,
            });
        });
    } else {
        res.redirect('/');
    }
});

router.get('/:id', ensureAuthenticated, (req, res) => {
    RoomModel.findOne({ _id: req.params.id })
        .then((result) => {
            res.render('room/room', {
                room: result,
                user: req.user,
            });
        })
        .catch((err) => {
            console.log('Room find Error : ', err.name);
            res.send('Error');
        });
});

router.get('/:id/photo', (req, res) => {
    RoomModel.findOne({ _id: req.params.id })
        .then((result) => {
            res.contentType(result.photos[0].contentType);
            res.send(result.photos[0].image);
        })
        .catch((err) => {
            console.log('Image Error: ', err.name);
            res.contentType('image/png');
            let defaultAvatar = fs.readFileSync('app/defaultAvatar/A.png');
            res.send(defaultAvatar);
        });
});

router.get('/book/:id', ensureAuthenticated, (req, res) => {
    UserModel.findById(req.user.id, { verified: 1, _id: 1, userid: 1 })
        .then((result) => {
            if (result.verified === true) {
                SendMail.book(req.params.id, req.user.email)
                    .then((result) => {
                        console.log('Book Email sended');
                        req.flash('success', 'Room Booked successfully, check your email');
                        res.redirect('/room/' + req.params.id);
                    })
                    .catch((err) => {
                        console.log('Book email Error: ', err);
                    });
            } else {
                console.log('User not verified');
                req.flash('warning', 'Account Not verified, So cannot book');
                res.redirect('/user/dashboard');
            }
        })
        .catch((err) => {
            console.log('Book error :', err);
            res.send('Error In the request');
        });
});

router.get('/:id/edit', ensureAuthenticated, (req, res) => {
    if (req.user.userid === 'admin') {
        RoomModel.findOne({ _id: req.params.id }).then((result) => {
            res.render('room/edit', {
                user: req.user,
                room: result,
            });
        });
    } else {
        res.send('Access Denied');
    }
});

router.post('/update/:id', ensureAuthenticated, upload.array('photos', 8), (req, res) => {
    const { location, status, features, persons, price } = req.body;
    RoomModel.findByIdAndUpdate(req.params.id, {
        location: location,
        status: status === undefined ? false : true,
        features: features,
        persons: persons,
        price: price,
    })
        .then((result) => {
            req.flash('success', 'Room Updated');
            res.redirect('/room/' + result._id);
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/');
        });
});

module.exports = router;
