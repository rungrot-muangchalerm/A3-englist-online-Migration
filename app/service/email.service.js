const nodemailer = require('nodemailer');

const DEFAULT_FROM = 'English Online <englishonline.eol@gmail.com>';

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
});

/**
 * ส่งอีเมลผ่าน nodemailer sendmail transport
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} [options.from]
 * @param {string} [options.replyTo]
 * @returns {Promise<void>}
 */
module.exports = async function sendMail({ to, subject, text, from, replyTo }) {
  if (!to || !subject || !text) {
    throw new Error('Missing required email fields');
  }

  const mailOptions = {
    from: from || DEFAULT_FROM,
    to,
    subject,
    text,
  };

  if (replyTo) {
    mailOptions.replyTo = replyTo;
  }

  await transporter.sendMail(mailOptions);
};
