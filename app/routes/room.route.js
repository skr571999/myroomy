const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs')

let upload = multer({ dest: 'app/uploads/' })

const { ensureAuthenticated } = require('../../config/auth')
const Room = require('../models/Room.model')

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('room/new', {
        title: 'Add New Room',
        user: req.user
    })
})

router.post('/add', ensureAuthenticated, upload.array('photos', 8), (req, res) => {
    let finalImgs = [];

    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            finalImgs[i] = {
                contentType: req.files[i].mimetype,
                image: fs.readFileSync(req.files[i].path)
            }
        }
    } else {
        for (let i = 0; i < req.files.length; i++) {
            finalImgs[i] = ''
        }
    }

    const { location, features, persons, price } = req.body;
    let userid = req.user.userid

    const newRoom = new Room({
        location, features, persons, price, userid, photos: finalImgs
    })
    newRoom.save()
        .then((result) => {
            console.log(result)
            req.flash('success', 'Room added')
            res.redirect('/room/' + result._id)
        })
        .catch(err => {
            console.log(err.name)
            req.flash('error', 'Error in the Request')
            res.redirect('/user/new')
        })
})

router.get('/all', (req, res) => {
    if (req.isAuthenticated()) {
        Room.find({})
            .then(result => {
                res.render('room/all', {
                    title: 'All Room',
                    rooms: result,
                    user: req.user
                })
            })
    } else {
        Room.find({}, { 'status': 0 })
            .then(result => {
                req.flash('warning', 'To view complete information Login or SignUp')
                res.render('room/all', {
                    title: 'All Room',
                    rooms: result,
                    user: ''
                })
            })
    }
})

router.get('/:id', ensureAuthenticated, (req, res) => {
    Room.findOne({ '_id': req.params.id })
        .then(result => {
            res.render('room/room', {
                room: result,
                user: req.user
            })
        })
        .catch(err => {
            console.log('Room find Error : ', err.name)
            res.send("Error")
        })
})

router.get('/:id/photo', (req, res) => {
    Room.findOne({ "_id": req.params.id })
        .then(result => {
            res.contentType(result.photos[0].contentType)
            res.send(result.photos[0].image)
        })
        .catch(err => {
            console.log('Image Error: ', err.name)
            res.contentType('image/png')
            let defaultAvatar = fs.readFileSync('app/defaultAvatar/A.png')
            res.send(defaultAvatar)
        })
})

router.get('/book', ensureAuthenticated, (req, res) => {
    req.flash('success', 'Room Booked successfully')
    res.send('Room Booked')
})

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.send('Edit room request')
})

router.post('/updated', ensureAuthenticated, (req, res) => {
    res.send('Updated room request')
})

module.exports = router;