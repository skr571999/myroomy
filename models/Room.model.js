const mongoose = require('mongoose');

// Room Model
const Room = mongoose.model('Room', new mongoose.Schema({
    address: String
}));

module.exports = Room