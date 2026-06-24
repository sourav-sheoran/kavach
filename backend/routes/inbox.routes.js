const express = require('express');
const router = express.Router();
const {
  getFeed,
  getNewsById,
  refreshFeed
} = require('../controllers/inbox.controller');
const { protect } = require('../middleware/auth.middleware');

// Protected routes
router.get('/feed', protect, getFeed);
router.get('/:id', protect, getNewsById);
router.post('/refresh', protect, refreshFeed);

module.exports = router;