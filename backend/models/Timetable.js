// ============================================
// Timetable.js - Timetable Model (MongoDB Collection: timetables)
// ============================================
// WHY this model: Stores weekly class schedule for each department/semester
// Admin creates timetable → students view it

const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    // Which department
    department: {
        type: String,
        required: true
    },
    // Which semester
    semester: {
        type: Number,
        required: true
    },
    // Day of the week
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
    },
    // Array of periods/classes for that day
    // WHY array: One day has multiple periods (9am, 10am, etc.)
    periods: [{
        time: String,       // e.g., "9:00 AM - 10:00 AM"
        subject: String,    // Subject name
        teacher: String     // Teacher name
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Timetable', timetableSchema);
