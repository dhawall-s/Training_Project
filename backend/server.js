// ============================================
// server.js - Main Server File (Entry Point)
// ============================================
// WHY Express: Express is a framework for Node.js that makes it easy
// to create APIs (backend endpoints) that frontend can call
// Think of it as a "traffic controller" for our backend

require('dotenv').config();            // WHY: Loads environment variables from .env file
const express = require('express');   // Web framework for creating APIs
const cors = require('cors');         // WHY: Allows frontend to talk to backend (different ports)
const path = require('path');         // WHY: Helps handle file paths correctly on any OS
const connectDB = require('./config/db'); // Our MongoDB connection function

// ---- Create Express App ----
const app = express();

// ---- Connect to MongoDB ----
// Call our database connection function
connectDB();

// ============================================
// MIDDLEWARE (runs before every request)
// ============================================
// WHY middleware: These run on every request to prepare/process data

// cors() - allows frontend (port 5500) to call backend (port 5000)
// Without this, browser will block the requests (security feature)
app.use(cors());

// express.json() - converts incoming JSON data to JavaScript object
// WHY: When frontend sends data (like login form), it comes as JSON
// This middleware converts it so we can use req.body.email, req.body.password etc.
app.use(express.json());

// express.urlencoded() - handles form data
// WHY: Some forms send data in URL-encoded format instead of JSON
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (notes, assignments PDFs)
// WHY: When teacher uploads a PDF, students need to download it
// This makes the 'uploads' folder accessible via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// ROUTES (API Endpoints)
// ============================================
// WHY separate routes: Keeps code organized - each module has its own file
// /api/auth   → Login, Signup, Password related
// /api/student → Student panel APIs
// /api/teacher → Teacher panel APIs
// /api/admin   → Admin panel APIs

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ---- Home Route (just to test if server is running) ----
app.get('/', (req, res) => {
    res.json({ message: '🎓 College ERP Backend is Running!' });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

// Listen only when not deployed on Vercel (production serverless environment)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📁 Upload folder: ${path.join(__dirname, 'uploads')}`);
    });
}

module.exports = app;
