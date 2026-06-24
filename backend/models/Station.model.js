const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  state: {
    type: String,
    required: true
  },
  facilities: [
    {
      name: { type: String },
      type: {
        type: String,
        enum: ['ECHS', 'CSD', 'School', 'MES', 'Other']
      },
      distance: { type: String },
      timing: { type: String },
      contact: { type: String }
    }
  ],
  accommodation: {
    waitlist: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  community: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      post: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Station', stationSchema);