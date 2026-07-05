// ============================================
// User.js - User Model (MongoDB Collection: users)
// ============================================
// WHY this model: This stores login credentials for ALL users
// Whether someone is admin, teacher, or student - they all login through this
// The 'role' field tells us what type of user they are

const mongoose = require('mongoose');

// Schema = Structure/Blueprint of our data
// WHY Schema: It defines what fields a user document will have
// Like a form - what information we need from each user
const userSchema = new mongoose.Schema({
    // User's full name
    name: {
        type: String,       // Text data
        required: true      // Must be provided (cannot be empty)
    },
    // Email for login - must be unique (no two users with same email)
    email: {
        type: String,
        required: true,
        unique: true        // WHY unique: Prevents duplicate accounts
    },
    // Password - stored as hash (encrypted) for security
    // WHY not plain text: If database gets hacked, passwords are safe
    password: {
        type: String,
        required: true
    },
    // Role determines which dashboard they see after login
    // enum = only these 3 values are allowed
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],  // Only these roles allowed
        required: true
    },
    // When the account was created (auto-filled)
    createdAt: {
        type: Date,
        default: Date.now   // WHY default: Automatically sets current date/time
    }
});

// mongoose.model('User', userSchema) creates the 'users' collection in MongoDB
// MongoDB automatically makes the collection name lowercase and plural
module.exports = mongoose.model('User', userSchema);
