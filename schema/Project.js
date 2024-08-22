const mongoose = require('mongoose');
const { Schema } = mongoose;

const project = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Project = mongoose.model('project', project)
module.exports = Project;