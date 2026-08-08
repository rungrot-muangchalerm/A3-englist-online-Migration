const jwt = require('jsonwebtoken');
const backofficeService = require('../../service/backoffice/backoffice.service');

const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;
const secret = process.env.JWT_SECRET;

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body || {};
      const section = req.query.section || 'office';
      const result = await backofficeService.login(username, password, section, req.session);
      if (!result.ok) {
        res.status(401).json({ ok: false, message: result.message });
        return;
      }
      const token = jwt.sign(
        {
          backofficeId: result.admin.adminId,
          user: result.admin.user,
          adminType: section,
          fullName: result.admin.fullName || result.admin.user,
          role: `backoffice_${section}`,
        },
        secret,
        { expiresIn: '24h' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: TOKEN_MAX_AGE,
      });
      res.status(200).json({ ok: true, admin: result.admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'เกิดข้อผิดพลาด' });
    }
  },

  account: async (req, res) => {
    try {
      const result = backofficeService.getAccount(req.session);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'เกิดข้อผิดพลาด' });
    }
  },

  logout: async (req, res) => {
    try {
      backofficeService.logout(req.session);
      res.clearCookie('token');
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'เกิดข้อผิดพลาด' });
    }
  },

  permissions: async (req, res) => {
    try {
      const result = await backofficeService.getPermissions(req.session);
      res.status(result.status === 200 ? 200 : 401).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, permissions: [], message: 'เกิดข้อผิดพลาด' });
    }
  },
};
