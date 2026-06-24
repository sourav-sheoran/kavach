const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['serving', 'veteran', 'family'],
    default: null
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // PQC Keys
  publicKey: {
    type: String,
    default: null
  },
  privateKey: {
    type: String,
    default: null
  },
  pqcEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);