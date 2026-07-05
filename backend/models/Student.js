// ============================================
// Student.js - Student Model (MongoDB Collection: students)
// ============================================
// WHY this model: Stores extra details about students
// The User model only has login info, this has academic info
// userId links this to the User model (like a foreign key in SQL)

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // Reference to User model - links student details to their login account
    // WHY ref: When we need user info, mongoose can auto-fill it (populate)
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // MongoDB's unique ID type
        ref: 'User',                           // Links to User collection
        required: true
    },
    // Student roll number (unique for each student)
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    // Which department the student belongs to
    department: {
        type: String,
        required: true
    },
    // Current semester (1-8 for engineering)
    semester: {
        type: Number,
        required: true
    },
    // Contact number
    phone: {
        type: String
    },
    // Student's address
    address: {
        type: String
    },
    // Date of birth
    dob: {
        type: Date
    },
    // When this record was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);
