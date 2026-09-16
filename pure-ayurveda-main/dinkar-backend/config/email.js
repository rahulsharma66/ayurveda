const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or your provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ADD THIS DEBUGGER
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transporter Error:", error);
  } else {
    console.log("✅ Email Server is ready to take our messages");
  }
});

module.exports = transporter;