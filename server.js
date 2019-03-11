const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const dbURL = require('./config/db.config').urlCloud;

// Disable to use useFindAndModify
mongoose.set('useFindAndModify', false);

// DB connection
mongoose.connect(dbURL, { useNewUrlParser: true })
    .then(() => console.log('DB Connected'))
    .catch(err=>{
        console.log('DB not connected\nError: ', err.name)
        process.exit();
        console.log("Exitting...")
    })

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// CORS Setup
app.use(cors())

app.use(cookieParser());

// Session Setup
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash());

app.use((req, res, next) => {
    app.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next();
})

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport.config')(passport);

// PUG Setup
// app.set('view','./views')
app.set('view engine', 'pug')

// Routing Setup
app.use(express.static(path.join(__dirname + '/public')))

app.get('/home', (req, res) => {
    // res.sendFile('index.html', { root: __dirname + '/public' })
    res.render('home')
});

app.get('/flash', (req, res) => {
    req.flash('success', 'Success Message')
    req.flash('error', 'Error Message')
    res.render('welcome')
})

app.use('/user', require('./routes/user.route'))

// Server Start
app.listen(PORT, console.log(`Server running on ${PORT}`));
