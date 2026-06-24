const mongoose = require('mongoose');

const identitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // PQC Encrypted Fields
  encryptedPayload: {
    ciphertext: { type: String, default: null },
    encryptedData: { type: String, default: null }
  },

  // Plain fields (non-sensitive)
  role: {
    type: String,
    enum: ['serving', 'veteran', 'family']
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  kavachCardId: {
    type: String,
    unique: true
  },

  // Card Signature (Dilithium simulation)
  cardSignature: {
    type: String,
    default: null
  },

  // Document
  documentPath: {
    type: String,
    default: null
  },

  // ECHS & CSD (non-sensitive)
  echsStatus: {
    type: String,
    default: 'Active'
  },
  csdEligible: {
    type: Boolean,
    default: true
  },

  // Decrypted cache (not stored — only in memory)
  name: { type: String, default: null },
  serviceNumber: { type: String, default: null },
  rank: { type: String, default: null },
  regiment: { type: String, default: null },
  dischargeYear: { type: String, default: null },
  ppoNumber: { type: String, default: null },
  relation: { type: String, default: null },
  linkedServiceNumber: { type: String, default: null },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Identity', identitySchema);