const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.config')(passport);

app.set('views', './src/views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname + '/public')));
app.use('/', require('./apps/auth/routes'));
app.use('/', require('./apps/room/routes'));
app.use('/user', require('./apps/user/routes'));

module.exports = { app };
