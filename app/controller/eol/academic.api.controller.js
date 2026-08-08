const academicService = require('../../service/eol/academic.service');

function resetTestSession(session) {
  delete session.xSkillId;
  delete session.xLevelId;
  delete session.amount;
  delete session.quizIds;
  delete session.answers;
  delete session.timeLeft;
}

async function getStatus(req, res, next) {
  try {
    const memberId = req.user?.memberId;
    if (!memberId) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    const data = await academicService.getAcademicStatus(memberId);
    return res.json({ status: 200, data });
  } catch (err) {
    const status = err.status === 401 ? 401 : err.status === 500 ? 500 : 400;
    return res.status(status).json({ status, message: err.message });
  }
}

async function setTest(req, res, next) {
  try {
    const memberId = req.user?.memberId;
    if (!memberId) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    const skillId = Number(req.body.skill_id || req.query.skill_id);
    const levelId = Number(req.body.level_id || req.query.level_id);
    const selected = await academicService.prepareTest(memberId, skillId, levelId);

    resetTestSession(req.session);
    req.session.xSkillId = selected.skillId;
    req.session.xLevelId = selected.levelId;

    return res.json({
      status: 200,
      data: { redirect: '/eol/systemtest/set_test' },
    });
  } catch (err) {
    const status = err.status === 401 ? 401 : err.status === 500 ? 500 : 400;
    return res.status(status).json({ status, message: err.message });
  }
}

module.exports = {
  getStatus,
  setTest,
};
