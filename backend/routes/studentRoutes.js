// ============================================
// studentRoutes.js - Student Panel Routes
// ============================================
// WHY: All routes for student panel
// All routes are protected (need JWT token) + role must be 'student'

const express = require('express');
const router = express.Router();

const {
    getDashboard, getAttendance, getAssignments,
    getNotes, getResults, getTimetable, getSubjects
} = require('../controllers/studentController');

const { verifyToken, checkRole } = require('../middleware/auth');

// All student routes need: 1) valid token 2) role = student
// WHY checkRole: Prevents a teacher from accessing student APIs

// GET /api/student/dashboard
router.get('/dashboard', verifyToken, checkRole('student'), getDashboard);

// GET /api/student/attendance
router.get('/attendance', verifyToken, checkRole('student'), getAttendance);

// GET /api/student/assignments
router.get('/assignments', verifyToken, checkRole('student'), getAssignments);

// GET /api/student/notes
router.get('/notes', verifyToken, checkRole('student'), getNotes);

// GET /api/student/results
router.get('/results', verifyToken, checkRole('student'), getResults);

// GET /api/student/timetable
router.get('/timetable', verifyToken, checkRole('student'), getTimetable);

// GET /api/student/subjects
router.get('/subjects', verifyToken, checkRole('student'), getSubjects);

module.exports = router;
