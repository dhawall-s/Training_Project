// ============================================
// Assignment.js - Assignment Model (MongoDB Collection: assignments)
// ============================================
// WHY this model: Teachers upload assignments, students view/download them
// fileUrl stores the path to uploaded PDF file

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    // Assignment title (e.g., "DSA Assignment 1")
    title: {
        type: String,
        required: true
    },
    // Description/instructions for the assignment
    description: {
        type: String
    },
    // Which subject this assignment belongs to
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    // Which teacher uploaded it
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    // Last date to submit
    dueDate: {
        type: Date,
        required: true
    },
    // Path to the uploaded PDF file
    // WHY: We store file on server and save the URL/path here
    fileUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
