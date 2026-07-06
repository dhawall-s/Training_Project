const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Note = require('../models/Note');
const Result = require('../models/Result');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');

const escapeRegex = (text) => {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const getDashboard = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({ message: ' Student record not found' });
        }
        const totalClasses = await Attendance.countDocuments({ studentId: student._id });
        const presentDays = await Attendance.countDocuments({ studentId: student._id, status: 'present' });

        const attendancePercent = totalClasses > 0 ? Math.round((presentDays / totalClasses) * 100) : 0;

        const subjects = await Subject.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        });
        const subjectIds = subjects.map(s => s._id);
        const upcomingAssignments = await Assignment.find({
            subjectId: { $in: subjectIds },
            dueDate: { $gte: new Date() }
        }).populate('subjectId', 'name code').sort({ dueDate: 1 }).limit(5);
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
        res.status(500).json({ message: ' Server error' });
    }
};

const getAttendance = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: ' Student not found' });

        const attendance = await Attendance.find({ studentId: student._id })
            .populate('subjectId', 'name code')
            .sort({ date: -1 });

        res.json({ attendance });
    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

const getAssignments = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: ' Student not found' });
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
        res.status(500).json({ message: ' Server error' });
    }
};

const getNotes = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: ' Student not found' });

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
        res.status(500).json({ message: ' Server error' });
    }
};

const getResults = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: ' Student not found' });

        const results = await Result.find({ studentId: student._id })
            .populate('subjectId', 'name code')
            .sort({ semester: 1 });

        res.json({ results });
    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

const getTimetable = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: ' Student not found' });

        const timetable = await Timetable.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        }).sort({ day: 1 });

        res.json({ timetable });
    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

const getSubjects = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) return res.status(404).json({ message: ' Student not found' });

        const subjects = await Subject.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(student.department.trim()) + '\\s*$', 'i') },
            semester: student.semester
        });

        res.json({ subjects });
    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

module.exports = {
    getDashboard, getAttendance, getAssignments,
    getNotes, getResults, getTimetable, getSubjects
};
