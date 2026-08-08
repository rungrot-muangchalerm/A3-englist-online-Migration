const lessonRelatedService = require('../../../../service/backoffice/mainoffice/admin/lesson-related.service');

async function list(req, res) {
  try {
    const data = await lessonRelatedService.buildList(req.params.skillId || req.query.skill_id);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  list,
};
