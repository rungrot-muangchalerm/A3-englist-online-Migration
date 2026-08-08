const questionService = require('../../../../service/backoffice/mainoffice/admin/question.service');

async function amount(req, res) {
  try {
    const data = await questionService.buildQuestionAmount();
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  amount,
};
