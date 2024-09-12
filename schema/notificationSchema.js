const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['message', 'connection request', 'mention', 'like', 'comment'], // Different types of notifications
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedModel' // This allows dynamic referencing
    },
    relatedModel: {
        type: String, // The model name the relatedId references
        enum: ['user', 'business', 'connection'] // List the possible related models here
    }
}, { timestamps: true });

module.exports = notificationSchema;