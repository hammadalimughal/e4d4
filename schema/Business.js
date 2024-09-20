const mongoose = require('mongoose');
const { Schema } = mongoose;
const notificationSchema = require('./notificationSchema')

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sizeOfCompany = new Schema({
    min: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
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
    }
})

const business = new Schema({
    fullName: {
        type: String,
        required: true
    },
    subHeading: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    profileVideo: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    primaryEmail: {
        type: emailSchema,
        required: true,
    },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                return passwordRegex.test(value);
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        },
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    businessYears: {
        type: Number
    },
    industry: {
        type: String,
        required: true,
    },
    operatingIndustry: {
        type: String
    },
    sizeOfCompany: {
        type: sizeOfCompany
    },
    foundedDate: {
        type: Date
    },
    about: {
        type: String
    },
    workWithUs: {
        type: String
    },
    headQuarterLocation: {
        type: String
    },
    website: {
        type: String
    },
    companyEmail: {
        type: emailSchema
    },
    connection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    connectionReq: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    }],
    notifications: [notificationSchema]
}, { timestamps: true });

const Business = mongoose.model('business', business)
module.exports = Business;