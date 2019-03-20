const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    addharNumber: {
        type: Number,
        required: true
    },
    photo: {
        contentType: String,
        image: Buffer
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema)