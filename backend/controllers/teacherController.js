// ============================================
// teacherController.js - Teacher Panel Controller
// ============================================
// WHY: Contains all logic for teacher panel APIs
// Teachers can: mark attendance, upload notes/assignments, enter marks, view students, view timetable

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Note = require('../models/Note');
const Result = require('../models/Result');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper to escape regex special characters
const escapeRegex = (text) => {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// ============================================
// 1. DASHBOARD - Teacher Dashboard Data
// ============================================
const getDashboard = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id }).populate('subjects');

        if (!teacher) {
            return res.status(404).json({ message: ' Teacher record not found' });
        }

        // Count students in teacher's department (case-insensitive & trimmed space)
        const studentCount = await Student.countDocuments({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(teacher.department.trim()) + '\\s*$', 'i') }
        });

        // Count assignments uploaded by this teacher
        const assignmentCount = await Assignment.countDocuments({ teacherId: teacher._id });

        // Count notes uploaded by this teacher
        const notesCount = await Note.countDocuments({ teacherId: teacher._id });

        // Recent notifications
        const notifications = await Notification.find({
            targetRole: { $in: ['all', 'teacher'] }
        }).sort({ createdAt: -1 }).limit(5);

        res.json({
            teacher,
            stats: {
                totalStudents: studentCount,
                totalAssignments: assignmentCount,
                totalNotes: notesCount,
                totalSubjects: teacher.subjects ? teacher.subjects.length : 0
            },
            notifications
        });

    } catch (error) {
        console.error('Teacher Dashboard Error:', error);
        res.status(500).json({ message: ' Server error' });
    }
};

// ============================================
// 2. MARK ATTENDANCE - Mark Student Attendance
// ============================================
const markAttendance = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id });
        const { subjectId, date, records } = req.body;

        const savedRecords = [];
        for (let record of records) {
            let existing = await Attendance.findOne({
                studentId: record.studentId,
                subjectId: subjectId,
                date: new Date(date)
            });

            if (existing) {
                existing.status = record.status;
                await existing.save();
                savedRecords.push(existing);
            } else {
                const attendance = new Attendance({
                    studentId: record.studentId,
                    subjectId,
                    date: new Date(date),
                    status: record.status,
                    markedBy: teacher._id
                });
                await attendance.save();
                savedRecords.push(attendance);
            }
        }

        res.json({
            message: `Attendance marked for ${savedRecords.length} students!`,
            records: savedRecords
        });

    } catch (error) {
        console.error('Attendance Error:', error);
        res.status(500).json({ message: ' Server error' });
    }
};

// ============================================
// 3. UPLOAD NOTES - Upload PDF Notes
// ============================================
const uploadNote = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id });
        const { title, subjectId } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const note = new Note({
            title,
            subjectId,
            teacherId: teacher._id,
            fileUrl
        });

        await note.save();

        res.status(201).json({
            message: 'Notes uploaded successfully!',
            note
        });

    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

// ============================================
// 4. UPLOAD ASSIGNMENT
// ============================================
const uploadAssignment = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id });
        const { title, description, subjectId, dueDate } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const assignment = new Assignment({
            title,
            description,
            subjectId,
            teacherId: teacher._id,
            dueDate: new Date(dueDate),
            fileUrl
        });

        await assignment.save();

        res.status(201).json({
            message: 'Assignment uploaded successfully!',
            assignment
        });

    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

// ============================================
// 5. ENTER MARKS - Enter Student Marks/Results
// ============================================
const enterMarks = async (req, res) => {
    try {
        const { subjectId, semester, examType, marks } = req.body;

        const savedResults = [];
        for (let record of marks) {
            let existing = await Result.findOne({
                studentId: record.studentId,
                subjectId,
                semester,
                examType: examType || 'internal'
            });

            if (existing) {
                existing.marks = record.marks;
                await existing.save();
                savedResults.push(existing);
            } else {
                const result = new Result({
                    studentId: record.studentId,
                    subjectId,
                    marks: record.marks,
                    semester,
                    examType: examType || 'internal'
                });
                await result.save();
                savedResults.push(result);
            }
        }

        res.json({
            message: `Marks entered for ${savedResults.length} students!`,
            results: savedResults
        });

    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

// ============================================
// 6. GET STUDENTS - View Student List
// ============================================
const getStudents = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id });
        if (!teacher) return res.status(404).json({ message: ' Teacher not found' });

        const students = await Student.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(teacher.department.trim()) + '\\s*$', 'i') }
        }).populate('userId', 'name email');

        res.json({ students });

    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

// ============================================
// 7. GET SUBJECTS - View Teacher's Subjects
// ============================================
const getSubjects = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id }).populate('subjects');
        if (!teacher) return res.status(404).json({ message: ' Teacher not found' });

        const departmentSubjects = await Subject.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(teacher.department.trim()) + '\\s*$', 'i') }
        });

        res.json({
            mySubjects: teacher.subjects || [],
            allSubjects: departmentSubjects
        });

    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

// ============================================
// 8. GET TIMETABLE - Teacher Timetable View
// ============================================
const getTimetable = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ userId: req.user.id });
        if (!teacher) return res.status(404).json({ message: ' Teacher not found' });

        const timetable = await Timetable.find({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(teacher.department.trim()) + '\\s*$', 'i') }
        }).sort({ semester: 1, day: 1 });

        res.json({ timetable });

    } catch (error) {
        res.status(500).json({ message: ' Server error' });
    }
};

module.exports = {
    getDashboard, markAttendance, uploadNote, uploadAssignment,
    enterMarks, getStudents, getSubjects, getTimetable
};
