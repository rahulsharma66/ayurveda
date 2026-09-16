const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // 1. Create the transporter (The "Mailman")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `"Pure Ayurveda" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html, // We use HTML so we can make beautiful receipts!
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${options.email}`);
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};

module.exports = sendEmail;
