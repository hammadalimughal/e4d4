const mongoose = require('mongoose');
const { Schema } = mongoose;

const connection = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: true
    },
    coverPhoto: {
        type: Boolean,
        default: false
    },
    profile: {
        type: Boolean,
        default: false
    },
    fullName: {
        type: Boolean,
        default: false
    },
    jobTitle: {
        type: Boolean,
        default: false
    },
    subHeading: {
        type: Boolean,
        default: false
    },
    experience: {
        type: Boolean,
        default: false
    },
    location: {
        type: Boolean,
        default: false
    },
    memberSince: {
        type: Boolean,
        default: false
    },
    about: {
        type: Boolean,
        default: false
    },
    profileVideo: {
        type: Boolean,
        default: false
    },
    primaryEmail: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Boolean,
        default: false
    },
    portfolio: {
        type: Boolean,
        default: false
    },
    projects: [{
        type: String
    }],
    experiences: [{
        type: String
    }],
    educations: [{
        type: String
    }],
    volunteerExperiences: [{
        type: String
    }],
    licenseCertification: [{
        type: String
    }],
    personalDocuments: [{
        type: String
    }],
    approved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Connection = mongoose.model('connection', connection)
module.exports = Connection;