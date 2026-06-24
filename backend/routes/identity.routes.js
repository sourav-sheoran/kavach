const express = require('express');
const router = express.Router();
const {
  submitIdentity,
  getCard,
  getStatus,
  verifyIdentity
} = require('../controllers/identity.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Protected routes
router.post('/submit', protect, upload.single('document'), submitIdentity);
router.get('/card', protect, getCard);
router.get('/status', protect, getStatus);

// Admin route
router.put('/verify/:id', protect, verifyIdentity);

module.exports = router;