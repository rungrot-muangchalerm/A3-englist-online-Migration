const eolcontestService = require('../../service/eol/eolcontest.service');

function jsonOk(res, data) {
  return res.json({ status: 200, data });
}

function jsonErr(res, err, defaultStatus = 400) {
  const status = err.status || defaultStatus;
  return res.status(status).json({ status, message: err.message });
}

async function exams(req, res) {
  try {
    const { masterId, groupType } = req.account;
    const data = await eolcontestService.getExams(req.user.memberId, masterId, groupType);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function start(req, res) {
  try {
    const { masterId, groupType } = req.account;
    const { examId } = req.body;
    const data = await eolcontestService.createSession(
      req.session,
      req.user.memberId,
      masterId,
      groupType,
      examId,
    );
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function page(req, res) {
  try {
    const data = await eolcontestService.getPage(req.session, req.query.page);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function record(req, res) {
  try {
    const data = await eolcontestService.recordAnswers(req.session, req.body.page, req.body);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function finish(req, res) {
  try {
    const data = await eolcontestService.finishTest(req.session, req.user.memberId);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

module.exports = {
  exams,
  start,
  page,
  record,
  finish,
};
