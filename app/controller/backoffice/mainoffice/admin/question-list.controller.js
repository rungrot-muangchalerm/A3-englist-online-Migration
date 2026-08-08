const questionListService = require('../../../../service/backoffice/mainoffice/admin/question-list.service');

async function showQuestions(req, res) {
  try {
    const data = await questionListService.buildQuestionList(1, req.query.page);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function hiddenQuestions(req, res) {
  try {
    const data = await questionListService.buildQuestionList(0, req.query.page);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function search(req, res) {
  try {
    const data = await questionListService.buildSearch(req.query);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function showRelated(req, res) {
  try {
    const data = await questionListService.buildRelatedList(1, parseInt(req.query.related_type, 10) || 1, req.query.page);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function hiddenRelated(req, res) {
  try {
    const data = await questionListService.buildRelatedList(0, parseInt(req.query.related_type, 10) || 1, req.query.page);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  showQuestions,
  hiddenQuestions,
  search,
  showRelated,
  hiddenRelated,
};
