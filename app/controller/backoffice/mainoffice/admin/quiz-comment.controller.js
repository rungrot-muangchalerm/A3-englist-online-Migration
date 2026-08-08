const quizCommentService = require('../../../../service/backoffice/mainoffice/admin/quiz-comment.service');

async function list(req, res) {
  try {
    const data = await quizCommentService.buildList(req.query.page);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function detail(req, res) {
  try {
    const data = await quizCommentService.buildDetail(req.params.quizId);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  list,
  detail,
};
