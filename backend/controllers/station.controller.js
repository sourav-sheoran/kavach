const Station = require('../models/Station.model');

// @route GET /api/station/all
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find().select('name state');
    res.json({ success: true, data: stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/station/search
exports.searchStation = async (req, res) => {
  try {
    const { q } = req.query;
    const stations = await Station.find({
      name: { $regex: q, $options: 'i' }
    }).select('name state');

    res.json({ success: true, data: stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/station/:name
exports.getStation = async (req, res) => {
  try {
    const station = await Station.findOne({
      name: { $regex: req.params.name, $options: 'i' }
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.json({ success: true, data: station });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/station/community/post
exports.communityPost = async (req, res) => {
  try {
    const { stationName, post } = req.body;
    const userId = req.user.id;

    const station = await Station.findOne({
      name: { $regex: stationName, $options: 'i' }
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    station.community.push({ userId, post });
    await station.save();

    res.json({
      success: true,
      message: 'Post added successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};