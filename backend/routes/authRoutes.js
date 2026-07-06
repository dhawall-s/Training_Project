const express = require('express');
const router = express.Router();

const { login, createAccount, getProfile, changePassword, forgotPassword } = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.get('/profile', verifyToken, getProfile);

router.put('/change-password', verifyToken, changePassword);

router.post('/create-account', verifyToken, checkRole('admin'), createAccount);

module.exports = router;
