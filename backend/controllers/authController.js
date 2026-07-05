// ============================================
// authController.js - Authentication Controller
// ============================================
// WHY controller: Contains the actual logic for login, profile, etc.
// Routes call these functions when an API is hit
//
// FUNCTIONS:
// 1. login    → Verify credentials, auto-detect role, return JWT token
// 2. getProfile → Get logged-in user's details
// 3. changePassword → Update password
// 4. forgotPassword → Reset password by email

const bcrypt = require('bcryptjs');    // WHY: To hash (encrypt) passwords
const jwt = require('jsonwebtoken');    // WHY: To create login tokens
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { JWT_SECRET } = require('../middleware/auth');

// ============================================
// 1. LOGIN - Verify Credentials & Auto-Detect Role
// ============================================
// WHY: User enters email & password only → we verify → detect their role → return token
// No role selection needed - system automatically finds the role from database
// STEPS: Find user by email → Compare password → Create token → Send back with role
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email in database
        const user = await User.findOne({ email });

        // If no user found with that email
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        // Compare the entered password with stored hashed password
        // WHY bcrypt.compare: It hashes the entered password and checks if it matches
        // We can't directly compare because stored password is hashed
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        // Password matched! Create JWT token
        // The role is automatically taken from the database - no need for user to select
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send token and user info to frontend
        // The frontend will use user.role to redirect to the correct dashboard
        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role   // Role auto-detected from database
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// ============================================
// 2. CREATE ACCOUNT (Admin Only)
// ============================================
// WHY: Only admin can create student/teacher accounts
// Students and teachers cannot signup on their own
// Admin sets everything: name, email, password, role, department, etc.
const createAccount = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        // Create new user in database
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        // If role is student, create student record too
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

        // If role is teacher, create teacher record too
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

// ============================================
// 3. GET PROFILE - Get Logged-in User's Details
// ============================================
// WHY: When user opens profile page, we need to show their info
const getProfile = async (req, res) => {
    try {
        // req.user.id was set by auth middleware (from JWT token)
        // .select('-password') means exclude password from result
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user is a student, get their student details too
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

// ============================================
// 4. CHANGE PASSWORD
// ============================================
// WHY: User wants to update their password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect!' });
        }

        // Hash new password and update
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ============================================
// 5. FORGOT PASSWORD (Simple Reset)
// ============================================
// WHY: User forgot password → reset it using email
const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account with this email!' });
        }

        // Hash and update new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password reset successfully! Please login.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Export all functions so routes can use them
module.exports = { login, createAccount, getProfile, changePassword, forgotPassword };
