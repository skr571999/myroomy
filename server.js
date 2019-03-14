const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const dbURL = require('./config/db.config').url;

// Disable to use useFindAndModify globally
mongoose.set('useFindAndModify', false);
mongoose.connect(dbURL, { useNewUrlParser: true })
    .then(() => console.log('DB Connected'))
    .catch(err => {
        console.log(`DB unconnected\nError name: ${err.name}\nExiting...`)
        process.exit();
    })

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport.config')(passport);

// PUG Setup
app.set('views', './app/views')
app.set('view engine', 'pug')

// Routings
app.use(express.static(path.join(__dirname + '/app/public')))
app.get('/', (req, res) => { res.render('home') })
app.use('/user', require('./app/routes/user.route'))
app.use('/room',require('./app/routes/room.route'))

app.listen(PORT, console.log(`Server running on ${PORT}`));
