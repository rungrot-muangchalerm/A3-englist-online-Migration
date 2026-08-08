const extraTestService = require('../../../../service/backoffice/mainoffice/admin/extra-test.service');

async function list(req, res) {
  try {
    const data = await extraTestService.buildList(req.query.page);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function detail(req, res) {
  try {
    const data = await extraTestService.buildDetail(req.params.testId);
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
