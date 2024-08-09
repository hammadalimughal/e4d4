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
    },
    provider: [{
        type: providerSchema,
        required: true
    }]
})

const business = new Schema({
    fullName: {
        type: String,
        required: true
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
    industry: {
        type: String,
        required: true,
    },
    operatingIndustry: {
        type: String,
        required: true,
    },
    sizeOfCompany: {
        type: sizeOfCompany,
        required: true,
    },
    foundedDate: {
        type: Date,
        required: true,
    },
    headQuarterLocation: {
        type: String,
        required: true,
    },
    website: {
        type: String
    },
    companyEmail: {
        type: emailSchema,
        required: true,
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const Business = mongoose.model('business', business)
module.exports = Business;