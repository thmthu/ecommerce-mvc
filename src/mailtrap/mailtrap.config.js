const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "thututoe@gmail.com",
    pass: process.env.PASS_NODEMAILER,
  },
});

const sender = '"Shopper" <thmt.thu@gmail.com>';
module.exports = { transporter, sender }; // async..await is not allowed in global scope, must use a wrapper
