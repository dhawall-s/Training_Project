const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    rollNo: {
        type: String,
        required: true,
        unique: true
    },

    department: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    phone: {
        type: String
    },

    address: {
        type: String
    },

    dob: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);
