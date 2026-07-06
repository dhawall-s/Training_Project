const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { JWT_SECRET } = require('../middleware/auth');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const createAccount = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered!' });
        }
        const hashedPassword = await bcrypt.hash(password || '123456', 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await user.save();

        if (role === 'student') {
            const student = new Student({
                userId: user._id,
                rollNo: req.body.rollNo || 'N/A',
                department: req.body.department || 'N/A',
                semester: req.body.semester || 1,
                phone: req.body.phone || ''
            });
            await student.save();
        }
        if (role === 'teacher') {
            const teacher = new Teacher({
                userId: user._id,
                employeeId: req.body.employeeId || 'N/A',
                department: req.body.department || 'N/A',
                phone: req.body.phone || '',
                qualification: req.body.qualification || ''
            });
            await teacher.save();
        }

        res.status(201).json({
            message: 'Account created successfully!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Create Account Error:', error);
        res.status(500).json({ message: 'Server error during account creation' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let extraDetails = null;
        if (user.role === 'student') {
            extraDetails = await Student.findOne({ userId: user._id });
        } else if (user.role === 'teacher') {
            extraDetails = await Teacher.findOne({ userId: user._id });
        }

        res.json({
            user,
            details: extraDetails
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect!' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account with this email!' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password reset successfully! Please login.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login, createAccount, getProfile, changePassword, forgotPassword };
