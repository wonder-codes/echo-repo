const mongoose = require('mongoose');

const ReadmeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    code: { type: String },
    repoUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Readme', ReadmeSchema);
