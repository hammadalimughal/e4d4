const mongoose = require('mongoose');
const { Schema } = mongoose;

const job = new Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business'
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    responsiblities: [{
        type: String,
        required: true
    }],
    education: {
        type: String
    },
    skills: [{
        type: String,
        required: true
    }],
    experience: {
        type: Number,
        required: true
    },
    certification: {
        type: String
    },
    position: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    benefits: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    workScheduled: {
        type: Number,
        required: true
    },
    applicationPosted: {
        type: Date,
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    applicationInstruction: {
        type: String
    },
    requiredDocuments: [{
        type: String,
        required: true
    }],
    contactPerson: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    additionalInfo: {
        type: String,
    },
}, { timestamps: true });

const Job = mongoose.model('job', job)
module.exports = Job;