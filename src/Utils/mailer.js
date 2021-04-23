const nodemailer = require('nodemailer');
require('dotenv').config();

const {
  host, port, email, pass,
} = process.env;

const transporter = nodemailer.createTransport({
  host,
  port,
  auth: {
    user: email,
    pass,
  },
});

module.exports = {
  transporter,
};
