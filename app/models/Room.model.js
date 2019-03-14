const mongoose = require('mongoose');

// Room Model
const roomSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    features: {
        type: Array
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Room', roomSchema)