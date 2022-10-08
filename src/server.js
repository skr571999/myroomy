const path = require('path');

const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
// const RoomModel = require('./apps/room/Room.model');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.config')(passport);

// PUG Setup
app.set('views', './src/views');
app.set('view engine', 'pug');

// Static files Routings
app.use(express.static(path.join(__dirname + '/public')));


app.use('/', (req, res) => {
    RoomModel.find({})
        .then((result) => {
            res.render('room/all', {
                title: 'Home | MyRoomy',
                rooms: result,
                user: req.user,
            });
        })
        .catch((err) => {
            req.flash('error', 'Error in the Request: ' + err.name);
            req.flash('warning', 'Server Error Refresh the Page');
            res.render('home', {
                title: 'Home | MyRoomy',
                rooms: '',
            });
        });
});
app.use('/user', require('./apps/user/user.route'));
app.use('/room', require('./apps/room/room.route'));

module.exports = { app };
