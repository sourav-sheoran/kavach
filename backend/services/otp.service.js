const sendOTP = async (phone, otp) => {
  try {
    // Demo mode — console pe print
    console.log(`📱 OTP for ${phone}: ${otp}`);

    // Production ke liye Twilio uncomment karo:
    // const twilio = require('twilio')
    // const client = twilio(
    //   process.env.TWILIO_SID,
    //   process.env.TWILIO_TOKEN
    // )
    // await client.messages.create({
    //   body: `Your KAVACH OTP is: ${otp}`,
    //   from: process.env.TWILIO_PHONE,
    //   to: `+91${phone}`
    // })

    return { success: true };
  } catch (error) {
    console.log('OTP Error:', error.message);
    return { success: false };
  }
};

module.exports = { sendOTP };