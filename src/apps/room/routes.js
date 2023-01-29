const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

let upload = multer({ dest: 'uploads/' });

const { ensureAuthenticated } = require('../../utils/auth');
const SendMail = require('../../utils/SendMail');
const RoomModel = require('./models');
const UserModel = require('../user/models');

router.get('/', async (req, res) => {
    try {
        const rooms = await RoomModel.find({});
        res.render('room/all', {
            title: 'Home | MyRoomy',
            rooms,
            user: req.user,
        });
    } catch (error) {
        req.flash('error', 'Error in the Request: ' + err.name);
        req.flash('warning', 'Server Error Refresh the Page');
        res.render('home', {
            title: 'Home | MyRoomy',
            rooms: '',
        });
    }
});

router
    .route('/room/new')
    .get(ensureAuthenticated, (req, res) => {
        if (req.user.userid === 'admin') {
            res.render('room/new', {
                title: 'Add New Room',
                user: req.user,
            });
        } else {
            req.flash('success', 'Access Denied');
            res.redirect('/');
        }
    })
    .post(ensureAuthenticated, upload.array('photos', 4), (req, res) => {
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
                req.flash('success', 'Room added');
                res.redirect('/room/' + result._id);
            })
            .catch((err) => {
                console.log(err.name);
                req.flash('error', 'Error in the Request');
                res.redirect('/user/new');
            });
    });

router.get('/room/:id', ensureAuthenticated, (req, res) => {
    RoomModel.findOne({ _id: req.params.id })
        .then((result) => {
            res.render('room/room', {
                room: result,
                user: req.user,
                title: 'Room Detail',
            });
        })
        .catch((err) => {
            console.log('Room find Error : ', err.name);
            res.send('Error');
        });
});

router.get('/room/:id/photo', (req, res) => {
    RoomModel.findOne({ _id: req.params.id })
        .then((result) => {
            res.contentType(result.photos[0].contentType);
            res.send(result.photos[0].image);
        })
        .catch((err) => {
            console.log('Image Error: ', err.name);
            res.contentType('image/png');
            let defaultAvatar = fs.readFileSync('src/defaultAvatar/A.png');
            res.send(defaultAvatar);
        });
});

router.get('/room/:id/book', ensureAuthenticated, async (req, res) => {
    const result = await UserModel.findById(req.user.id, { verified: 1, _id: 1, userid: 1 });
    if (result.verified === true) {
        await Room.findOneAndUpdate({ _id: id }, { $set: { status: false } });
        await SendMail.book(req.params.id, req.user.email);

        req.flash('success', 'Room Booked successfully, check your email');
        res.redirect('/room/' + req.params.id);
    } else {
        req.flash('warning', 'Account Not verified, So cannot book');
        res.redirect('/');
    }
});

router
    .route('/room/:id/update')
    .get(ensureAuthenticated, async (req, res) => {
        if (req.user.userid === 'admin') {
            const result = await RoomModel.findOne({ _id: req.params.id });
            return res.render('room/update', { user: req.user, room: result });
        }
        req.flash('warning', 'Access Denied');
        res.redirect('/');
    })
    .post(ensureAuthenticated, upload.array('photos', 8), async (req, res) => {
        const { location, status, features, persons, price } = req.body;
        const result = await RoomModel.findByIdAndUpdate(req.params.id, {
            location: location,
            status: status === undefined ? false : true,
            features: features,
            persons: persons,
            price: price,
        });
        req.flash('success', 'Room Updated');
        res.redirect('/room/' + result._id);
    });

module.exports = router;
