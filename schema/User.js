const mongoose = require('mongoose');
const { Schema } = mongoose;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerSchema = new Schema({
    id: {
        type: String,
    },
    type: {
        type: String
    }
});

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

const profileVideoSchema = new Schema({
    poster: {
        type: String,
    },
    url: {
        type: String,
        required: true
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
    },
    provider: [{
        type: providerSchema
    }]
});

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    subHeading: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    primaryEmail: {
        type: emailSchema,
        required: true,
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
    portfolio: {
        type: String,
    },
    socialLinks: [{
        type: SocialSchema
    }],
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
        ref: 'connection'
    },
    connectionReq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business'
    },
}, { timestamps: true });

// Pre-save middleware to add baseUrl to socialLinks in the User schema
userSchema.pre('save', function (next) {
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

const User = mongoose.model('user', userSchema);
module.exports = User;
