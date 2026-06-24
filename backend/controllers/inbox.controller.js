const Inbox = require('../models/Inbox.model');

// @route GET /api/inbox/feed
exports.getFeed = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const news = await Inbox.find(filter)
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: news.length,
      data: news
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/inbox/:id
exports.getNewsById = async (req, res) => {
  try {
    const news = await Inbox.findById(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.json({ success: true, data: news });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/inbox/refresh
exports.refreshFeed = async (req, res) => {
  try {
    const newsService = require('../services/news.service');
    await newsService.fetchAndStore();

    res.json({
      success: true,
      message: 'Feed refreshed successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};