const mongoose = require('mongoose');

const inboxSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['ECHS', 'CSD', 'AGIF', 'MOD', 'PIB', 'KSB'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  originalUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['Welfare', 'Medical', 'Canteen', 'Insurance', 'Defence', 'General'],
    default: 'General'
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inbox', inboxSchema);