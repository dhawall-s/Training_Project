// ============================================
// Result.js - Result/Marks Model (MongoDB Collection: results)
// ============================================
// WHY this model: Stores marks/grades for each student per subject
// Teacher enters marks → saved here → student views their results

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    // Which student
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    // Which subject
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    // Marks obtained (out of 100)
    marks: {
        type: Number,
        required: true
    },
    // Which semester these marks are for
    semester: {
        type: Number,
        required: true
    },
    // Exam type (internal/external/practical)
    examType: {
        type: String,
        enum: ['internal', 'external', 'practical'],
        default: 'internal'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', resultSchema);
