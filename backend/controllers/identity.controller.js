const Identity = require('../models/Identity.model');
const User = require('../models/User.model');
const qrcode = require('qrcode');
const crypto = require('crypto');
const { encryptData, decryptData, signCard, verifyCard } = require('../services/pqc.service');

// Generate unique KAVACH Card ID
const generateCardId = () => {
  return 'KVH-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @route POST /api/identity/submit
exports.submitIdentity = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      serviceNumber,
      rank,
      regiment,
      role,
      dischargeYear,
      ppoNumber,
      relation,
      linkedServiceNumber,
      echsStatus,
      csdEligible
    } = req.body;

    // Check if identity already exists
    const existing = await Identity.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Identity already submitted'
      });
    }

    // Get user public key for PQC encryption
    const user = await User.findById(userId);
    const kavachCardId = generateCardId();

    // Sensitive data to encrypt
    const sensitiveData = {
      name,
      serviceNumber,
      rank,
      regiment,
      dischargeYear: dischargeYear || null,
      ppoNumber: ppoNumber || null,
      relation: relation || null,
      linkedServiceNumber: linkedServiceNumber || null
    };

    // PQC Encrypt sensitive data
    let encryptedPayload = null;
    if (user.pqcEnabled && user.publicKey) {
      try {
        console.log('🔐 PQC Encrypting identity data...');
        encryptedPayload = await encryptData(sensitiveData, user.publicKey);
        console.log('✅ Identity data PQC encrypted successfully');
      } catch (pqcError) {
        console.log('⚠️ PQC encryption failed, storing plain:', pqcError.message);
      }
    }

    // Card data for signing
    const cardData = {
      kavachCardId,
      userId: userId.toString(),
      role,
      echsStatus: echsStatus || 'Active',
      csdEligible: csdEligible || true,
      issuedAt: new Date().toISOString()
    };

    // Sign card with Dilithium simulation
    const cardSignature = signCard(cardData);
    console.log('✅ Card signed with PQC signature');

    // Generate QR Code
    const qrData = JSON.stringify({
      platform: 'KAVACH',
      cardId: kavachCardId,
      name,
      rank,
      regiment,
      role,
      echsStatus: echsStatus || 'Active',
      signature: cardSignature,
      verified: false
    });

    const qrCode = await qrcode.toDataURL(qrData);

    // Save identity
    const identity = await Identity.create({
      userId,
      // Store encrypted payload
      encryptedPayload: encryptedPayload || null,
      // Also store plain for fallback
      name,
      serviceNumber,
      rank,
      regiment,
      role,
      dischargeYear: dischargeYear || null,
      ppoNumber: ppoNumber || null,
      relation: relation || null,
      linkedServiceNumber: linkedServiceNumber || null,
      echsStatus: echsStatus || 'Active',
      csdEligible: csdEligible || true,
      documentPath: req.file ? req.file.path : null,
      kavachCardId,
      cardSignature,
      verificationStatus: 'pending'
    });

    // Update user role
    await User.findByIdAndUpdate(userId, { role });

    res.json({
      success: true,
      message: 'Identity submitted successfully',
      pqcEncrypted: !!encryptedPayload,
      data: {
        identity,
        qrCode,
        kavachCardId,
        cardSignature,
        cardVerified: verifyCard(cardData, cardSignature)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route GET /api/identity/card
exports.getCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const identity = await Identity.findOne({ userId });

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: 'Identity not found. Please submit first.'
      });
    }

    // Try PQC decrypt if encrypted
    let decryptedData = null;
    if (
      identity.encryptedPayload &&
      identity.encryptedPayload.ciphertext &&
      user.privateKey
    ) {
      try {
        console.log('🔓 PQC Decrypting identity data...');
        decryptedData = await decryptData(
          identity.encryptedPayload,
          user.privateKey
        );
        console.log('✅ Identity data decrypted successfully');
      } catch (pqcError) {
        console.log('⚠️ PQC decryption failed, using plain data:', pqcError.message);
      }
    }

    // Use decrypted or plain data
    const cardData = decryptedData || {
      name: identity.name,
      serviceNumber: identity.serviceNumber,
      rank: identity.rank,
      regiment: identity.regiment,
      dischargeYear: identity.dischargeYear,
      ppoNumber: identity.ppoNumber,
      relation: identity.relation,
      linkedServiceNumber: identity.linkedServiceNumber
    };

    // Verify card signature
    const cardForVerification = {
      kavachCardId: identity.kavachCardId,
      userId: userId.toString(),
      role: identity.role,
      echsStatus: identity.echsStatus,
      csdEligible: identity.csdEligible,
      issuedAt: identity.createdAt.toISOString()
    };

    const signatureValid = identity.cardSignature
      ? verifyCard(cardForVerification, identity.cardSignature)
      : false;

    // Regenerate QR
    const qrData = JSON.stringify({
      platform: 'KAVACH',
      cardId: identity.kavachCardId,
      name: cardData.name,
      rank: cardData.rank,
      regiment: cardData.regiment,
      role: identity.role,
      echsStatus: identity.echsStatus,
      signature: identity.cardSignature,
      verified: identity.verificationStatus === 'verified'
    });

    const qrCode = await qrcode.toDataURL(qrData);

    res.json({
      success: true,
      pqcDecrypted: !!decryptedData,
      signatureValid,
      data: {
        identity: {
          ...identity.toObject(),
          ...cardData
        },
        qrCode
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route GET /api/identity/status
exports.getStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const identity = await Identity.findOne({ userId });

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: 'No identity found'
      });
    }

    res.json({
      success: true,
      data: {
        verificationStatus: identity.verificationStatus,
        kavachCardId: identity.kavachCardId,
        pqcEncrypted: !!(
          identity.encryptedPayload &&
          identity.encryptedPayload.ciphertext
        ),
        cardSigned: !!identity.cardSignature,
        submittedAt: identity.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route PUT /api/identity/verify/:id (Admin)
exports.verifyIdentity = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const identity = await Identity.findByIdAndUpdate(
      id,
      { verificationStatus: status },
      { new: true }
    );

    res.json({
      success: true,
      message: `Identity ${status}`,
      data: identity
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};