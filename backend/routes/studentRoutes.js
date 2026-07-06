const express = require('express');
const router = express.Router();

const {
    getDashboard, getAttendance, getAssignments,
    getNotes, getResults, getTimetable, getSubjects
} = require('../controllers/studentController');

const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/dashboard', verifyToken, checkRole('student'), getDashboard);

router.get('/attendance', verifyToken, checkRole('student'), getAttendance);

router.get('/assignments', verifyToken, checkRole('student'), getAssignments);

router.get('/notes', verifyToken, checkRole('student'), getNotes);

router.get('/results', verifyToken, checkRole('student'), getResults);

router.get('/timetable', verifyToken, checkRole('student'), getTimetable);

router.get('/subjects', verifyToken, checkRole('student'), getSubjects);

module.exports = router;
