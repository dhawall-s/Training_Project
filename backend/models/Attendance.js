// ============================================
// Attendance.js - Attendance Model (MongoDB Collection: attendances)
// ============================================
// WHY this model: Records daily attendance for each student per subject
// Teacher marks attendance → saved here → student can view it

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    // Which student's attendance
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    // For which subject
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    // Date of attendance
    date: {
        type: Date,
        required: true
    },
    // Present or Absent
    // WHY enum: Only two values allowed - prevents wrong data
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    },
    // Which teacher marked this attendance
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
