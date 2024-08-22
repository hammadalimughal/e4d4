const mongoose = require('mongoose');
const { Schema } = mongoose;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerSchema = new Schema({
    id: {
        type: String,
        // unique: true
    },
    type: {
        type: String
    }
})
const profileVideoSchema = new Schema({
    poster: {
        type: String,
        // unique: true
    },
    url: {
        type: String,
        required: true
    }
})

const emailSchema = new Schema({
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                return emailRegex.test(value);
            },
            message: 'Please provide a valid email address.'
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    provider: [{
        type: providerSchema
    }]
})

const user = new Schema({
    fullName: {
        type: String,
        required: true
    },
    subHeading: {
        type: String,
        // required: true
    },
    jobTitle: {
        type: String,
        // required: true
    },
    primaryEmail: {
        type: emailSchema,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                return passwordRegex.test(value);
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        }
    },
    profilePic: {
        type: String,
    },
    resume: {
        type: String,
    },
    coverLetter: {
        type: String,
    },
    coverPhoto: {
        type: String,
    },
    profileVideo: {
        type: profileVideoSchema,
    },
    phone: {
        type: String,
    },
    suburb: {
        type: String,
    },
    about: {
        type: String,
    },
    address: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    educationLevel: {
        type: String,
    },
    skills: [{
        type: String,
    }],
    industryInterest: {
        type: String,
    },
    weeksOfAvailablity: {
        type: String,
    },
    workType: {
        type: String,
    },
    workClassification: {
        type: String,
    },
    preferredJobLocation: [{
        type: String,
    }],
    positionTypeInterest: {
        type: String,
    },
    experience: {
        type: Number,
    },
    salaryExpectation: {
        type: Number,
    },
    infoRequired: {
        type: Boolean,
        default: true
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    }],
    
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business'
    },
    connectionReq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business'
    },
}, { timestamps: true });
const User = mongoose.model('user', user)
module.exports = User;