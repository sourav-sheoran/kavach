const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, setRole } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.post('/set-role', protect, setRole);

module.exports = router;