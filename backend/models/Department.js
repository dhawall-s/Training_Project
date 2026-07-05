// ============================================
// Department.js - Department Model (MongoDB Collection: departments)
// ============================================
// WHY this model: College has multiple departments (CS, IT, ECE, etc.)
// Admin creates/manages departments

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    // Department name (e.g., "Computer Science", "Electronics")
    name: {
        type: String,
        required: true,
        unique: true
    },
    // Head of Department name
    hodName: {
        type: String
    },
    // Short code (e.g., "CSE", "ECE")
    code: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Department', departmentSchema);
