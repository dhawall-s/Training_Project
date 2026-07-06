require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoose = require('mongoose');
app.use((req, res, next) => {

    if (req.path.startsWith('/api') && mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: ' Database connection is not established. Please ensure MongoDB is running on your machine.'
        });
    }
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.json({ message: '🎓 College ERP Backend is Running!' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Upload folder: ${path.join(__dirname, 'uploads')}`);
    });
}

module.exports = app;
