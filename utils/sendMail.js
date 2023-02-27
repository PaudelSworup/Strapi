const nodemailer = require("nodemailer");

const sendEmail = (option) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: option.from,
    to: option.to,
    subject: option.subject,
    text: option.text,
    html: option.html,
  };
  transport.sendMail(mailOptions);
};

module.exports = sendEmail;
