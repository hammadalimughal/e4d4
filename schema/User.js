const mongoose = require('mongoose');
const { Schema } = mongoose;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    type: {
        type: String
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
        type:providerSchema,
        required: true
    }]
})

const user = new Schema({
    fullName: {
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
        }
    },
    profilePic: {
        type: String,
    },
    phone: {
        type: String,
    },
    Suburb: {
        type: String,
    },
    address: {
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
    salaryExpectation: {
        type: Number,
    },
}, { timestamps: true });
const User = mongoose.model('user', user)
module.exports = User;