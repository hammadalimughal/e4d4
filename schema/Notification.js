const mongoose = require('mongoose');
const { Schema } = mongoose;

const notification = new Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Notification = mongoose.model('notification', notification)
module.exports = Notification;