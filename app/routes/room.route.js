const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../../config/auth')
const Room = require('../models/Room.model')

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('newRoom', {
        title: 'New Room',
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
        })
        .catch(err => console.log(err.name))
    res.send('Add room request')
})
router.get('/add', ensureAuthenticated, (req, res) => {
    res.send('Add room request')
})

router.get('/all', ensureAuthenticated, (req, res) => {
    res.send('All room request')
})

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.send('Edit room request')
})

router.post('/updated', ensureAuthenticated, (req, res) => {
    res.send('Updated room request')
})

module.exports = router;