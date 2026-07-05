// ============================================
// authRoutes.js - Authentication Routes
// ============================================
// WHY routes: Routes connect URLs to controller functions
// NOTE: Signup/account creation is admin-only now
// Students and teachers can only LOGIN, not signup

const express = require('express');
const router = express.Router();

const { login, createAccount, getProfile, changePassword, forgotPassword } = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');

// ---- Public Routes (no token needed) ----

// POST /api/auth/login → Login (auto-detects role from database)
router.post('/login', login);

// POST /api/auth/forgot-password → Reset password
router.post('/forgot-password', forgotPassword);

// ---- Protected Routes (token needed) ----

// GET /api/auth/profile → Get logged-in user's profile
router.get('/profile', verifyToken, getProfile);

// PUT /api/auth/change-password → Change password
router.put('/change-password', verifyToken, changePassword);

// ---- Admin Only Routes ----
// WHY admin only: Only admin can create new student/teacher accounts
// Students and teachers cannot register themselves

// POST /api/auth/create-account → Admin creates student/teacher account
router.post('/create-account', verifyToken, checkRole('admin'), createAccount);

module.exports = router;
