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

const SocialSchema = new Schema({
    platform: {
        type: String,
    },
    username: {
        type: String
    },
    baseUrl: {
        type: String
    }
});

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

const businessSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    subHeading: {
        type: String,
    },
    coverPhoto: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    profileVideo: {
        type: String,
    },
    businessImages: [{
        type: String,
    }],
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
    companySize: {
        type: String
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
    socialLinks: [{
        type: SocialSchema
    }],
    notifications: [notificationSchema]
}, { timestamps: true });

businessSchema.pre('save', function (next) {
    const platformBaseUrls = {
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        twitter: 'https://www.twitter.com/',
        linkedin: 'https://www.linkedin.com/in/',
        behance: 'https://www.behance.net/',
        pinterest: 'https://www.pinterest.com/',
        dribbble: 'https://dribbble.com/',
        linktree: 'https://linktr.ee/',
    };

    // Iterate over socialLinks and set the baseUrl
    if (this.socialLinks && this.socialLinks.length > 0) {
        this.socialLinks.forEach(link => {
            link.baseUrl = platformBaseUrls[link.platform.toLowerCase()] || null;
        });
    }

    next();
});

const Business = mongoose.model('business', businessSchema)
module.exports = Business;