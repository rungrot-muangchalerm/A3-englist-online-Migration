const lessonsService = require('../../service/lessons/lessons.service');

async function getPrivilege(req, res) {
  try {
    const result = await lessonsService.checkPrivilege(req.user.memberId);
    return res.json({ status: 200, data: result });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function getTopics(req, res) {
  try {
    const { skill_id: skillId, level_id: levelId, page, search } = req.query;
    const data = await lessonsService.listTopics(
      req.user.memberId,
      skillId,
      levelId,
      page,
      search,
    );
    return res.json({ status: 200, data });
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function getTopicDetail(req, res) {
  try {
    const { topic_id: topicId, skill_id: skillId, level_id: levelId } = req.query;
    const data = await lessonsService.getTopicDetail(
      req.user.memberId,
      topicId,
      skillId,
      levelId,
    );
    return res.json({ status: 200, data });
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR' || err.code === 'NOT_FOUND') {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = {
  getPrivilege,
  getTopics,
  getTopicDetail,
};
