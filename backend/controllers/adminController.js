const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Department = require('../models/Department');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

const escapeRegex = (text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

const getDashboard = async (req, res) => {
    try {
        res.json({
            stats: {
                totalStudents: await Student.countDocuments(),
                totalTeachers: await Teacher.countDocuments(),
                totalSubjects: await Subject.countDocuments(),
                totalDepartments: await Department.countDocuments()
            },
            recentNotifications: await Notification.find().sort({ createdAt: -1 }).limit(5)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('userId', 'name email role');
        res.json({ students });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addStudent = async (req, res) => {
    try {
        const { name, email, password, rollNo, department, semester, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        const user = await User.create({ name, email, password: hashedPassword, role: 'student' });
        const student = await Student.create({
            userId: user._id,
            rollNo: rollNo.trim(),
            department: department.trim(),
            semester,
            phone
        });
        res.status(201).json({ message: 'Student added!', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding student' });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { name, email, rollNo, department, semester, phone } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        await User.findByIdAndUpdate(student.userId, { name, email });

        student.rollNo = rollNo ? rollNo.trim() : student.rollNo;
        student.department = department ? department.trim() : student.department;
        student.semester = semester || student.semester;
        student.phone = phone || student.phone;
        await student.save();

        res.json({ message: 'Student updated!', student });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        await User.findByIdAndDelete(student.userId);
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('userId', 'name email').populate('subjects', 'name code');
        res.json({ teachers });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addTeacher = async (req, res) => {
    try {
        const { name, email, password, employeeId, department, phone, qualification } = req.body;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        const user = await User.create({ name, email, password: hashedPassword, role: 'teacher' });
        const teacher = await Teacher.create({
            userId: user._id,
            employeeId: employeeId.trim(),
            department: department.trim(),
            phone,
            qualification
        });
        res.status(201).json({ message: 'Teacher added!', teacher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding teacher' });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        const { name, email, employeeId, department, phone, qualification, subjects } = req.body;
        await User.findByIdAndUpdate(teacher.userId, { name, email });

        teacher.employeeId = employeeId ? employeeId.trim() : teacher.employeeId;
        teacher.department = department ? department.trim() : teacher.department;
        teacher.phone = phone || teacher.phone;
        teacher.qualification = qualification || teacher.qualification;
        if (subjects) teacher.subjects = subjects;
        await teacher.save();

        res.json({ message: 'Teacher updated!', teacher });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        await User.findByIdAndDelete(teacher.userId);
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: 'Teacher deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ department: 1, semester: 1 });
        res.json({ subjects });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addSubject = async (req, res) => {
    try {
        const { name, code, department, semester } = req.body;
        const subject = await Subject.create({
            name: name.trim(),
            code: code.trim(),
            department: department.trim(),
            semester
        });
        res.status(201).json({ message: 'Subject added!', subject });
    } catch (error) {
        res.status(500).json({ message: 'Error adding subject' });
    }
};

const updateSubject = async (req, res) => {
    try {
        const { name, code, department, semester } = req.body;
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        if (name) subject.name = name.trim();
        if (code) subject.code = code.trim();
        if (department) subject.department = department.trim();
        if (semester) subject.semester = semester;
        await subject.save();

        res.json({ message: 'Subject updated!', subject });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        res.json({ departments });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addDepartment = async (req, res) => {
    try {
        const { name, code, hodName } = req.body;
        const department = await Department.create({
            name: name.trim(),
            code: code.trim(),
            hodName: hodName ? hodName.trim() : ''
        });
        res.status(201).json({ message: 'Department added!', department });
    } catch (error) {
        res.status(500).json({ message: 'Error adding department' });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { name, code, hodName } = req.body;
        const department = await Department.findById(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found' });

        if (name) department.name = name.trim();
        if (code) department.code = code.trim();
        if (hodName) department.hodName = hodName.trim();
        await department.save();

        res.json({ message: 'Department updated!', department });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: 'Department deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getTimetable = async (req, res) => {
    try {
        const { department, semester } = req.query;
        let query = {};
        if (department) {
            query.department = { $regex: new RegExp('^\\s*' + escapeRegex(department.trim()) + '\\s*$', 'i') };
        }
        if (semester) query.semester = semester;

        const timetable = await Timetable.find(query).sort({ day: 1 });
        res.json({ timetable });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createTimetable = async (req, res) => {
    try {
        const { department, semester, day, periods } = req.body;
        const deptClean = department.trim();

        await Timetable.findOneAndDelete({
            department: { $regex: new RegExp('^\\s*' + escapeRegex(deptClean) + '\\s*$', 'i') },
            semester,
            day
        });

        const timetable = await Timetable.create({ department: deptClean, semester, day, periods });
        res.status(201).json({ message: 'Timetable created!', timetable });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTimetable = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.json({ message: 'Timetable entry deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('createdBy', 'name').sort({ createdAt: -1 });
        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const sendNotification = async (req, res) => {
    try {
        const notification = await Notification.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json({ message: 'Notification sent!', notification });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const studentsByDept = await Student.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]);
        const teachersByDept = await Teacher.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]);

        res.json({
            studentsByDept,
            teachersByDept,
            totals: {
                totalStudents: await Student.countDocuments(),
                totalTeachers: await Teacher.countDocuments(),
                totalSubjects: await Subject.countDocuments(),
                totalDepartments: await Department.countDocuments()
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDashboard,
    getAllStudents, addStudent, updateStudent, deleteStudent,
    getAllTeachers, addTeacher, updateTeacher, deleteTeacher,
    getAllSubjects, addSubject, updateSubject, deleteSubject,
    getAllDepartments, addDepartment, updateDepartment, deleteDepartment,
    getTimetable, createTimetable, deleteTimetable,
    getNotifications, sendNotification, deleteNotification,
    getAnalytics
};
