const path = require('path');

const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const BaseRouter = require('./apps/index.route');

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

app.use('/', BaseRouter);

module.exports = { app };
