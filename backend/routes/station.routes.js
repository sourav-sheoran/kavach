const express = require('express');
const router = express.Router();
const {
  getAllStations,
  searchStation,
  getStation,
  communityPost
} = require('../controllers/station.controller');
const { protect } = require('../middleware/auth.middleware');

// Protected routes
router.get('/all', protect, getAllStations);
router.get('/search', protect, searchStation);
router.get('/:name', protect, getStation);
router.post('/community/post', protect, communityPost);

module.exports = router;