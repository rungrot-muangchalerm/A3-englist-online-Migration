const accountService = require('../../service/eol/account.service');
const etestService = require('../../service/eol/etest.service');

async function getEtest(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master') {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    const data = await etestService.buildEtestPage(req.user.memberId, req.query);
    return res.json({ status: 200, data });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function updateExam(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master') {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    const detail = await etestService.updateExam(req.user.memberId, req.body);
    return res.json({ status: 200, data: { detail } });
  } catch (err) {
    if (err.code === 'INVALID_INPUT' || err.code === 'NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function deleteExam(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master') {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    await etestService.deleteExam(req.user.memberId, req.body.exam_id);
    return res.json({ status: 200, data: { message: 'Exam deleted' } });
  } catch (err) {
    if (err.code === 'INVALID_INPUT' || err.code === 'NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function createCustom(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master') {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    const detail = await etestService.createCustomExam(req.user.memberId, req.body);
    return res.json({ status: 200, data: { detail } });
  } catch (err) {
    if (err.code === 'INVALID_INPUT' || err.code === 'NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function addQuestion(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master') {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    const detail = await etestService.addCustomQuestion(req.user.memberId, req.body);
    return res.json({ status: 200, data: { detail } });
  } catch (err) {
    if (err.code === 'INVALID_INPUT' || err.code === 'NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function createSystem(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    if (account.type !== 'master') {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    const detail = await etestService.createSystemExam(req.user.memberId, req.body);
    return res.json({ status: 200, data: { detail } });
  } catch (err) {
    if (err.code === 'INVALID_INPUT' || err.code === 'NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = {
  getEtest,
  updateExam,
  deleteExam,
  createCustom,
  addQuestion,
  createSystem,
};
