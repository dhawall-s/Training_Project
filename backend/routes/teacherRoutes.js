const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
    getDashboard, markAttendance, uploadNote, uploadAssignment,
    enterMarks, getStudents, getSubjects, getTimetable
} = require('../controllers/teacherController');

const { verifyToken, checkRole } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
    },

    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

router.get('/dashboard', verifyToken, checkRole('teacher'), getDashboard);

router.post('/mark-attendance', verifyToken, checkRole('teacher'), markAttendance);

router.post('/upload-note', verifyToken, checkRole('teacher'), upload.single('file'), uploadNote);

router.post('/upload-assignment', verifyToken, checkRole('teacher'), upload.single('file'), uploadAssignment);

router.post('/enter-marks', verifyToken, checkRole('teacher'), enterMarks);

router.get('/students', verifyToken, checkRole('teacher'), getStudents);

router.get('/subjects', verifyToken, checkRole('teacher'), getSubjects);

router.get('/timetable', verifyToken, checkRole('teacher'), getTimetable);

module.exports = router;
