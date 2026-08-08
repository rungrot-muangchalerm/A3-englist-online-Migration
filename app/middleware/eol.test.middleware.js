const accountService = require('../service/eol/account.service');

async function requireActiveTime(req, res, next) {
  try {
    const memberId = req.user?.memberId;
    if (!memberId) {
      return res.redirect('/eol/eoltest');
    }
    const ok = await accountService.hasActiveTime(memberId);
    if (!ok) {
      return res.redirect('/eol/eoltest');
    }
    return next();
  } catch (err) {
    return res.redirect('/eol/eoltest');
  }
}

async function requireActiveTimeApi(req, res, next) {
  try {
    const memberId = req.user?.memberId;
    if (!memberId) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    const ok = await accountService.hasActiveTime(memberId);
    if (!ok) {
      return res.status(403).json({ status: 403, message: 'No active time available' });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = {
  requireActiveTime,
  requireActiveTimeApi,
};
