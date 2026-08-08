const corporateService = require('../../service/corporate/corporate.service');

function jsonOk(res, data) {
  return res.json({ status: 200, data });
}

function jsonErr(res, err, defaultStatus = 400) {
  const status = err.status || defaultStatus;
  return res.status(status).json({ status, message: err.message, code: err.code });
}

async function status(req, res) {
  try {
    const data = await corporateService.getStatus(req.user.memberId);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function customLessons(req, res) {
  try {
    const data = await corporateService.listCustomLessons(req.user.memberId);
    return jsonOk(res, { items: data });
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function customLesson(req, res) {
  try {
    const data = await corporateService.getCustomLesson(req.user.memberId, req.query.lesson_id);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function videoTopics(req, res) {
  try {
    const skillId = Number(req.query.skill_id) || 7;
    const levelId = Number(req.query.level_id) || 2;
    const data = await corporateService.listVideoTopics(skillId, levelId);
    return jsonOk(res, { items: data });
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function videoTopic(req, res) {
  try {
    const data = await corporateService.getVideoTopic(req.query.topic_id);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

module.exports = {
  status,
  customLessons,
  customLesson,
  videoTopics,
  videoTopic,
};
