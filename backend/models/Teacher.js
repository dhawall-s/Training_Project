const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    employeeId: {
        type: String,
        required: true,
        unique: true
    },

    department: {
        type: String,
        required: true
    },

    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],

    phone: {
        type: String
    },

    qualification: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);
