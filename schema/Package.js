const mongoose = require('mongoose');
const { Schema } = mongoose;

const package = new Schema({
    title: {
        type: String,
        required: true
    },
    features: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Package = mongoose.model('package', package)
module.exports = Package;