const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTP } = require('../services/otp.service');
const { generateKeypair } = require('../services/pqc.service');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number required'
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const otpHash = await bcrypt.hash(otp, 10);

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        otp: otpHash,
        otpExpiry
      });
    } else {
      user.otp = otpHash;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    await sendOTP(phone, otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      demoOTP: otp
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP required'
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    // Generate PQC Keypair if not already done
    if (!user.pqcEnabled) {
      console.log('🔐 Generating PQC Keypair for user...');
      try {
        const { publicKey, privateKey } = await generateKeypair();
        user.publicKey = publicKey;
        user.privateKey = privateKey;
        user.pqcEnabled = true;
        console.log('✅ PQC Keypair generated successfully');
      } catch (pqcError) {
        console.log('⚠️ PQC KeyGen failed, continuing without:', pqcError.message);
      }
    }

    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      // Send private key to client for decryption
      privateKey: user.privateKey,
      pqcEnabled: user.pqcEnabled,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        pqcEnabled: user.pqcEnabled
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route POST /api/auth/set-role
exports.setRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    if (!['serving', 'veteran', 'family'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Role set successfully',
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};