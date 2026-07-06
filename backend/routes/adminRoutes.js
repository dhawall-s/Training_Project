const express = require('express');
const router = express.Router();

const {
    getDashboard,
    getAllStudents, addStudent, updateStudent, deleteStudent,
    getAllTeachers, addTeacher, updateTeacher, deleteTeacher,
    getAllSubjects, addSubject, updateSubject, deleteSubject,
    getAllDepartments, addDepartment, updateDepartment, deleteDepartment,
    getTimetable, createTimetable, deleteTimetable,
    getNotifications, sendNotification, deleteNotification,
    getAnalytics
} = require('../controllers/adminController');

const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/dashboard', verifyToken, checkRole('admin'), getDashboard);

router.get('/students', verifyToken, checkRole('admin'), getAllStudents);
router.post('/students', verifyToken, checkRole('admin'), addStudent);
router.put('/students/:id', verifyToken, checkRole('admin'), updateStudent);
router.delete('/students/:id', verifyToken, checkRole('admin'), deleteStudent);

router.get('/teachers', verifyToken, checkRole('admin'), getAllTeachers);
router.post('/teachers', verifyToken, checkRole('admin'), addTeacher);
router.put('/teachers/:id', verifyToken, checkRole('admin'), updateTeacher);
router.delete('/teachers/:id', verifyToken, checkRole('admin'), deleteTeacher);

router.get('/subjects', verifyToken, checkRole('admin'), getAllSubjects);
router.post('/subjects', verifyToken, checkRole('admin'), addSubject);
router.put('/subjects/:id', verifyToken, checkRole('admin'), updateSubject);
router.delete('/subjects/:id', verifyToken, checkRole('admin'), deleteSubject);

router.get('/departments', verifyToken, checkRole('admin'), getAllDepartments);
router.post('/departments', verifyToken, checkRole('admin'), addDepartment);
router.put('/departments/:id', verifyToken, checkRole('admin'), updateDepartment);
router.delete('/departments/:id', verifyToken, checkRole('admin'), deleteDepartment);

router.get('/timetable', verifyToken, checkRole('admin'), getTimetable);
router.post('/timetable', verifyToken, checkRole('admin'), createTimetable);
router.delete('/timetable/:id', verifyToken, checkRole('admin'), deleteTimetable);

router.get('/notifications', verifyToken, checkRole('admin'), getNotifications);
router.post('/notifications', verifyToken, checkRole('admin'), sendNotification);
router.delete('/notifications/:id', verifyToken, checkRole('admin'), deleteNotification);

router.get('/analytics', verifyToken, checkRole('admin'), getAnalytics);

module.exports = router;
