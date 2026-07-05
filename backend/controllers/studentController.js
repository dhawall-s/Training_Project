// ============================================
// studentController.js - Student Panel Controller
// ============================================
// WHY: Contains all logic for student panel APIs
// Students can view: dashboard stats, attendance, assignments, notes, results, timetable

const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Note = require('../models/Note');
const Result = require('../models/Result');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');

// Helper to escape regex special characters
const escapeRegex = (text) => {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// ============================================
// 1. DASHBOARD - Get Student Dashboard Data
// ============================================
const getDashboard = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({ message: '❌ Student record not found' });
        }

        // Count total attendance records and present days
        const totalClasses = await Attendance.countDocuments({ studentId: student._id });
        const presentDays = await Attendance.countDocuments({ studentId: student._id, status: 'present' });

        const attendancePercent = totalClasses > 0 ? Math.round((presentDays / totalClasses) * 100) : 0;

        // Get subjects for this student's department & semester
        const subjects = await Subject.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        });
        const subjectIds = subjects.map(s => s._id);

        // Get upcoming assignments for those subjects (due date >= today)
        const upcomingAssignments = await Assignment.find({
            subjectId: { $in: subjectIds },
            dueDate: { $gte: new Date() }
        }).populate('subjectId', 'name code').sort({ dueDate: 1 }).limit(5);

        // Get recent notifications for students
        const notifications = await Notification.find({
            targetRole: { $in: ['all', 'student'] }
        }).sort({ createdAt: -1 }).limit(5);

        res.json({
            student,
            stats: {
                attendancePercent,
                totalClasses,
                presentDays,
                upcomingAssignments: upcomingAssignments.length,
                totalSubjects: subjects.length
            },
            upcomingAssignments,
            notifications
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: '❌ Server error' });
    }
};

// ============================================
// 2. GET ATTENDANCE - View Attendance Records
// ============================================
const getAttendance = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: '❌ Student not found' });

        const attendance = await Attendance.find({ studentId: student._id })
            .populate('subjectId', 'name code')
            .sort({ date: -1 });

        res.json({ attendance });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error' });
    }
};

// ============================================
// 3. GET ASSIGNMENTS - View Assignments
// ============================================
const getAssignments = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: '❌ Student not found' });

        // Get subjects matching department & semester (case & space-insensitive)
        const subjects = await Subject.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        });

        const subjectIds = subjects.map(s => s._id);

        const assignments = await Assignment.find({
            subjectId: { $in: subjectIds }
        })
            .populate('subjectId', 'name code')
            .populate('teacherId')
            .sort({ createdAt: -1 });

        res.json({ assignments });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error' });
    }
};

// ============================================
// 4. GET NOTES - View/Download Notes
// ============================================
const getNotes = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: '❌ Student not found' });

        const subjects = await Subject.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        });

        const subjectIds = subjects.map(s => s._id);

        const notes = await Note.find({
            subjectId: { $in: subjectIds }
        })
            .populate('subjectId', 'name code')
            .sort({ createdAt: -1 });

        res.json({ notes });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error' });
    }
};

// ============================================
// 5. GET RESULTS - View Marks
// ============================================
const getResults = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: '❌ Student not found' });

        const results = await Result.find({ studentId: student._id })
            .populate('subjectId', 'name code')
            .sort({ semester: 1 });

        res.json({ results });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error' });
    }
};

// ============================================
// 6. GET TIMETABLE - View Weekly Schedule
// ============================================
const getTimetable = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: '❌ Student not found' });

        const timetable = await Timetable.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        }).sort({ day: 1 });

        res.json({ timetable });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error' });
    }
};

// ============================================
// 7. GET SUBJECTS - View Subjects List
// ============================================
const getSubjects = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: '❌ Student not found' });

        const subjects = await Subject.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        });

        res.json({ subjects });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error' });
    }
};

module.exports = {
    getDashboard, getAttendance, getAssignments,
    getNotes, getResults, getTimetable, getSubjects
};
