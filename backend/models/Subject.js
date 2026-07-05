// ============================================
// Subject.js - Subject Model (MongoDB Collection: subjects)
// ============================================
// WHY this model: Stores all subjects offered in the college
// Used by students (to see subjects), teachers (to teach), admin (to manage)

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    // Subject name (e.g., "Data Structures", "DBMS")
    name: {
        type: String,
        required: true
    },
    // Subject code (e.g., "CS301")
    code: {
        type: String,
        required: true,
        unique: true
    },
    // Which department this subject belongs to
    department: {
        type: String,
        required: true
    },
    // Which semester this subject is taught in
    semester: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', subjectSchema);
