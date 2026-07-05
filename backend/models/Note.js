// ============================================
// Note.js - Notes Model (MongoDB Collection: notes)
// ============================================
// WHY this model: Teachers upload study notes (PDFs), students download them
// Similar to Assignment but simpler - no due date, just study material

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    // Note title (e.g., "Unit 1 - Introduction to DBMS")
    title: {
        type: String,
        required: true
    },
    // Which subject these notes are for
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    // Which teacher uploaded
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    // Path to uploaded PDF file
    fileUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', noteSchema);
