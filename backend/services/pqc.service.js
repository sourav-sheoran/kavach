const Kyber = require('crystals-kyber');

// Generate Kyber-512 Keypair
const generateKeypair = async () => {
  try {
    const keys = await Kyber.KeyGen512();
    return {
      publicKey: Buffer.from(keys[0]).toString('base64'),
      privateKey: Buffer.from(keys[1]).toString('base64')
    };
  } catch (error) {
    console.log('PQC KeyGen Error:', error.message);
    throw error;
  }
};

// Encrypt data using Kyber Public Key
const encryptData = async (data, publicKeyBase64) => {
  try {
    const publicKey = Buffer.from(publicKeyBase64, 'base64');
    const dataStr = JSON.stringify(data);

    // Kyber encapsulation — generates shared secret
    const encapsulated = await Kyber.Encrypt512(publicKey);
    const sharedSecret = encapsulated[0]; // shared secret
    const ciphertext = encapsulated[1];   // ciphertext to send

    // Use shared secret to XOR encrypt the data
    const dataBuffer = Buffer.from(dataStr, 'utf8');
    const encrypted = xorEncrypt(dataBuffer, Buffer.from(sharedSecret));

    return {
      ciphertext: Buffer.from(ciphertext).toString('base64'),
      encryptedData: encrypted.toString('base64')
    };
  } catch (error) {
    console.log('PQC Encrypt Error:', error.message);
    throw error;
  }
};

// Decrypt data using Kyber Private Key
const decryptData = async (encryptedPayload, privateKeyBase64) => {
  try {
    const privateKey = Buffer.from(privateKeyBase64, 'base64');
    const ciphertext = Buffer.from(encryptedPayload.ciphertext, 'base64');
    const encryptedData = Buffer.from(encryptedPayload.encryptedData, 'base64');

    // Kyber decapsulation — recover shared secret
    const sharedSecret = await Kyber.Decrypt512(ciphertext, privateKey);

    // XOR decrypt with shared secret
    const decrypted = xorEncrypt(encryptedData, Buffer.from(sharedSecret));
    return JSON.parse(decrypted.toString('utf8'));

  } catch (error) {
    console.log('PQC Decrypt Error:', error.message);
    throw error;
  }
};

// XOR helper — symmetric operation (encrypt = decrypt)
const xorEncrypt = (data, key) => {
  const result = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length];
  }
  return result;
};

// Simple hash for card signing (Dilithium simulation)
const signCard = (cardData) => {
  const crypto = require('crypto');
  const dataStr = JSON.stringify(cardData);
  const signature = crypto
    .createHmac('sha256', 'KAVACH_PQC_SECRET_2024')
    .update(dataStr)
    .digest('hex');
  return `DIL_${signature}`;
};

// Verify card signature
const verifyCard = (cardData, signature) => {
  try {
    const expectedSig = signCard(cardData);
    return expectedSig === signature;
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateKeypair,
  encryptData,
  decryptData,
  signCard,
  verifyCard
};