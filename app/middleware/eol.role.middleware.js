const accountService = require('../service/eol/account.service');
const corporateModel = require('../model/corporate/corporate.model');

async function requireMaster(req, res, next) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master') {
      return res.redirect('/eol/eoltest');
    }
    req.account = account;
    return next();
  } catch (err) {
    return res.redirect('/eol/eoltest');
  }
}

async function requireMasterOrCorporate(req, res, next) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master' && !account.corporate) {
      return res.redirect('/eol/eoltest');
    }
    req.account = account;
    return next();
  } catch (err) {
    return res.redirect('/eol/eoltest');
  }
}

async function requireCorporateSub(req, res, next) {
  try {
    const memberId = req.user?.memberId;
    if (!memberId) {
      return res.redirect('/eol/eoltest');
    }
    const account = await accountService.resolveAccount(memberId);
    if (account.type === 'master') {
      return res.redirect('/eol/eoltest');
    }
    const sub = await corporateModel.findActiveSubMember(memberId);
    if (!sub) {
      return res.redirect('/eol/eoltest');
    }
    req.account = {
      ...account,
      masterId: sub.master_id,
      groupType: sub.type_id,
    };
    return next();
  } catch (err) {
    return res.redirect('/eol/eoltest');
  }
}

async function requireCorporateSubApi(req, res, next) {
  try {
    const memberId = req.user?.memberId;
    if (!memberId) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    const account = await accountService.resolveAccount(memberId);
    if (account.type === 'master') {
      return res.status(403).json({ status: 403, message: 'EOL Contest is for corporate sub-accounts only' });
    }
    const sub = await corporateModel.findActiveSubMember(memberId);
    if (!sub) {
      return res.status(403).json({ status: 403, message: 'EOL Contest is limited for corporate members only' });
    }
    req.account = {
      ...account,
      masterId: sub.master_id,
      groupType: sub.type_id,
    };
    return next();
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = {
  requireMaster,
  requireMasterOrCorporate,
  requireCorporateSub,
  requireCorporateSubApi,
};
