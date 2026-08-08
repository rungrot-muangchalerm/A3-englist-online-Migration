const sendMail = require('../../service/email.service');

const EMAIL_REGEX = /^[_a-z0-9-]+(\.[a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i;

module.exports = {
  /**
   * POST /api/contact/send
   * ส่งข้อความติดต่อจากหน้า contact
   */
  send: async (req, res) => {
    try {
      const { name, email, telephone, detail } = req.body || {};
      const errors = [];

      if (!name || !String(name).trim()) {
        errors.push('Please Insert Your Name');
      }
      if (!email || !EMAIL_REGEX.test(String(email))) {
        errors.push('Email is incorrect');
      }
      if (!detail || !String(detail).trim()) {
        errors.push('Please Insert Detail');
      }

      if (errors.length > 0) {
        res.status(400).json({ success: false, message: errors.join('\n') });
        return;
      }

      await sendMail({
        from: String(email),
        to: 'englishonline.eol@gmail.com',
        replyTo: String(email),
        subject: 'New Message from Cusmoter or User.',
        text: `Here is the message:\n======================================\n\n${detail}\n\n======================================\n\nFrom: ${name}\nTelephone: ${telephone || '-'}`,
      });

      res.status(200).json({ success: true, message: 'Send message is successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'ไม่สามารถส่งข้อความได้ในขณะนี้' });
    }
  },
};
