const standardtestService = require('../../service/eol/standardtest.service');

function jsonOk(res, data) {
  return res.json({ status: 200, data });
}

function jsonErr(res, err, defaultStatus = 400) {
  const status = err.status || defaultStatus;
  return res.status(status).json({ status, message: err.message });
}

async function status(req, res) {
  try {
    const data = await standardtestService.getPreTestStatus(req.user.memberId);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function create(req, res) {
  try {
    const { event_pass } = req.body;
    const data = await standardtestService.createTest(req.session, req.user.memberId, event_pass);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function page(req, res) {
  try {
    const data = await standardtestService.getTestPage(req.session, req.query.page);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function record(req, res) {
  try {
    const data = await standardtestService.recordAnswers(req.session, req.body.page, req.body);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function finish(req, res) {
  try {
    const data = await standardtestService.finishTest(req.session, req.user.memberId);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

module.exports = {
  status,
  create,
  page,
  record,
  finish,
};
