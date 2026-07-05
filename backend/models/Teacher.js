// ============================================
// Teacher.js - Teacher Model (MongoDB Collection: teachers)
// ============================================
// WHY this model: Stores teacher-specific info like employee ID, subjects
// Linked to User model for login credentials

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    // Reference to User model
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Unique employee ID
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    // Department they belong to
    department: {
        type: String,
        required: true
    },
    // Subjects they teach - array of subject IDs
    // WHY array: One teacher can teach multiple subjects
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    // Phone number
    phone: {
        type: String
    },
    // Qualification (e.g., M.Tech, PhD)
    qualification: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);
