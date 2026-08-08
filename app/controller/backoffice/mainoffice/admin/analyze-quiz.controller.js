const analyzeQuizService = require('../../../../service/backoffice/mainoffice/admin/analyze-quiz.service');

async function list(req, res) {
  try {
    const data = await analyzeQuizService.buildList(req.query.page);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  list,
};
