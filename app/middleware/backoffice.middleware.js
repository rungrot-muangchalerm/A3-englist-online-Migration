function requireBackofficeLogin(req, res, next) {
  if (req.session && req.session.adminId && req.session.adminType) {
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ ok: false, message: 'กรุณาเข้าสู่ระบบ' });
  }
  return res.redirect('/backoffice/mainoffice');
}

module.exports = {
  requireBackofficeLogin,
};
