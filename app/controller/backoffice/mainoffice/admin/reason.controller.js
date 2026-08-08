const reasonService = require('../../../../service/backoffice/mainoffice/admin/reason.service');

async function list(req, res) {
  try {
    const data = await reasonService.buildReasonList({
      ...req.query,
      skill_id: req.params.skillId || req.query.skill_id,
      detail_id: req.params.detailId || req.query.detail_id,
      quiz_id: req.params.quizId || req.query.quiz_id,
    });
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  list,
};
