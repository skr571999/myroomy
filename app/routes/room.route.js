const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../../config/auth')
const Room = require('../models/Room.model')

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('room/new', {
        title: 'Add New Room',
        user: req.user
    })
})

router.post('/add', ensureAuthenticated, (req, res) => {
    console.log(req.body)
    const { location, features } = req.body;
    const newRoom = new Room({
        location, features
    })
    newRoom.save()
        .then((result) => {
            console.log(result)
            res.redirect('/user/dashboard')
        })
        .catch(err => console.log(err.name))
})

router.get('/all', ensureAuthenticated, (req, res) => {
    Room.find({}, { '_id': 0, '_v': 0 })
        .then(result => {
            res.render('room/all', {
                rooms: result,
                user: req.user
            })
        })
})

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.send('Edit room request')
})

router.post('/updated', ensureAuthenticated, (req, res) => {
    res.send('Updated room request')
})

module.exports = router;