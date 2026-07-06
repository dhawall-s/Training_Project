const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({

    department: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
    },

    periods: [{
        time: String,
        subject: String,
        teacher: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Timetable', timetableSchema);
