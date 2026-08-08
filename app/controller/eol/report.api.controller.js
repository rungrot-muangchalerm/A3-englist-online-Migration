const accountService = require('../../service/eol/account.service');
const reportService = require('../../service/eol/report.service');

function parseMemberId(value) {
  if (value === undefined || value === null || value === '') return undefined;
  return String(value);
}

async function getSelector(req, res, next) {
  try {
    const currentMemberId = req.user.memberId;
    const targetMemberId = parseMemberId(req.query.member_id);
    const focus = await reportService.resolveFocusMember(currentMemberId, targetMemberId);
    const account = await accountService.resolveAccount(currentMemberId);
    return res.json({
      status: 200,
      data: {
        focus,
        accountType: account.type,
        corporate: account.corporate,
      },
    });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: err.message });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function getAcademic(req, res, next) {
  try {
    const currentMemberId = req.user.memberId;
    const targetMemberId = parseMemberId(req.query.member_id);
    const focus = await reportService.resolveFocusMember(currentMemberId, targetMemberId);
    const resultId = req.query.result_id;
    if (resultId) {
      const detail = await reportService.getAcademicDetail(focus.memberId, resultId, req.query.type);
      return res.json({ status: 200, data: { focus, detail } });
    }
    const skillId = req.query.skill_id || 10;
    const list = await reportService.getAcademicResults(focus.memberId, skillId, req.query.start, req.query.stop);
    return res.json({ status: 200, data: { focus, list } });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: err.message });
    }
    if (err.code === 'RESULT_NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function getStandard(req, res, next) {
  try {
    const currentMemberId = req.user.memberId;
    const targetMemberId = parseMemberId(req.query.member_id);
    const focus = await reportService.resolveFocusMember(currentMemberId, targetMemberId);
    const resultId = req.query.result_id;
    if (resultId) {
      const detail = await reportService.getStandardDetail(focus.memberId, resultId);
      return res.json({ status: 200, data: { focus, detail } });
    }
    const list = await reportService.getStandardList(focus.memberId, req.query.start, req.query.stop);
    return res.json({ status: 200, data: { focus, list } });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: err.message });
    }
    if (err.code === 'RESULT_NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function getContest(req, res, next) {
  try {
    const currentMemberId = req.user.memberId;
    const targetMemberId = parseMemberId(req.query.member_id);
    const focus = await reportService.resolveFocusMember(currentMemberId, targetMemberId);
    const resultId = req.query.result_id;
    if (resultId) {
      const detail = await reportService.getContestDetail(focus.memberId, resultId, req.query.type);
      return res.json({ status: 200, data: { focus, detail } });
    }
    const list = await reportService.getContestList(focus.memberId, req.query.start, req.query.stop);
    return res.json({ status: 200, data: { focus, list } });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: err.message });
    }
    if (err.code === 'RESULT_NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = {
  getSelector,
  getAcademic,
  getStandard,
  getContest,
};
