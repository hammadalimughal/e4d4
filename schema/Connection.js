const mongoose = require('mongoose');
const { Schema } = mongoose;

const connection = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business'
    },
    name: {
        type: Boolean,
        default: false
    },
    email: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Boolean,
        default: false
    },
    address: {
        type: Boolean,
        default: false
    },
    education: {
        type: Boolean,
        default: false
    },
    resume: {
        type: Boolean,
        default: false
    },
    coverLetter: {
        type: Boolean,
        default: false
    },
    linkedIn: {
        type: Boolean,
        default: false
    },
    twitter: {
        type: Boolean,
        default: false
    },
    facebook: {
        type: Boolean,
        default: false
    },
    instagram: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Connection = mongoose.model('connection', connection)
module.exports = Connection;