// ============================================
// Notification.js - Notification Model (MongoDB Collection: notifications)
// ============================================
// WHY this model: Admin sends notices/announcements to students or teachers
// targetRole decides who can see the notification

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // Notification title
    title: {
        type: String,
        required: true
    },
    // Detailed message
    message: {
        type: String,
        required: true
    },
    // Who should see this notification
    // 'all' means everyone, or specific role
    targetRole: {
        type: String,
        enum: ['all', 'student', 'teacher'],
        default: 'all'
    },
    // Who sent this notification (admin user ID)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
