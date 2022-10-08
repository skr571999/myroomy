const express = require('express');
const RoomModel = require('./room/Room.model');

const router = express.Router();

router.use('/user', require('./user/user.route'));
router.use('/room', require('./room/room.route'));
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

module.exports = router;
