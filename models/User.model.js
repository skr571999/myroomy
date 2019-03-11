const mongoose = require('mongoose');

// User Model
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    occupation: String
}));

module.exports = User