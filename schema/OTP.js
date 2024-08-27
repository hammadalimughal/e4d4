const mongoose = require('mongoose');
const { Schema } = mongoose;

const otp = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business'
    },
    code: {
        type: String,
        required: true
    }
}, { timestamps: true });

otp.index({ createdAt: 1 }, { expireAfterSeconds: 900 }); // 900 seconds = 15 minutes

const Otp = mongoose.model('otp', otp)
module.exports = Otp;