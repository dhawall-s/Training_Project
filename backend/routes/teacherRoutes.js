// ============================================
// teacherRoutes.js - Teacher Panel Routes
// ============================================
// WHY: Routes for teacher panel with file upload support
// Uses Multer middleware for handling PDF file uploads

const express = require('express');
const router = express.Router();
const multer = require('multer');    // WHY multer: Handles file uploads in Node.js
const path = require('path');

const {
    getDashboard, markAttendance, uploadNote, uploadAssignment,
    enterMarks, getStudents, getSubjects, getTimetable
} = require('../controllers/teacherController');

const { verifyToken, checkRole } = require('../middleware/auth');

// ============================================
// MULTER SETUP - File Upload Configuration
// ============================================
// WHY: When teacher uploads a PDF, Multer saves it to the uploads folder
// and gives us the file info (filename, path, etc.)

const storage = multer.diskStorage({
    // WHERE to save files
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));  // Save in uploads folder
    },
    // WHAT to name the file
    // WHY custom name: Prevents filename conflicts (two files with same name)
    filename: function (req, file, cb) {
        // Date.now() + originalname = unique filename
        // Example: "1699123456789-notes.pdf"
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // Max file size: 10MB
    fileFilter: function (req, file, cb) {
        // Only allow PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// ---- Teacher Routes ----
// All need: valid token + role = teacher

// GET /api/teacher/dashboard
router.get('/dashboard', verifyToken, checkRole('teacher'), getDashboard);

// POST /api/teacher/mark-attendance
router.post('/mark-attendance', verifyToken, checkRole('teacher'), markAttendance);

// POST /api/teacher/upload-note → upload.single('file') handles the PDF
// 'file' is the name of the form field that contains the file
router.post('/upload-note', verifyToken, checkRole('teacher'), upload.single('file'), uploadNote);

// POST /api/teacher/upload-assignment
router.post('/upload-assignment', verifyToken, checkRole('teacher'), upload.single('file'), uploadAssignment);

// POST /api/teacher/enter-marks
router.post('/enter-marks', verifyToken, checkRole('teacher'), enterMarks);

// GET /api/teacher/students
router.get('/students', verifyToken, checkRole('teacher'), getStudents);

// GET /api/teacher/subjects
router.get('/subjects', verifyToken, checkRole('teacher'), getSubjects);

// GET /api/teacher/timetable
router.get('/timetable', verifyToken, checkRole('teacher'), getTimetable);

module.exports = router;
