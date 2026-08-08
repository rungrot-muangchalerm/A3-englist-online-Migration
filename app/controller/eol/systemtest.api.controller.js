const systemtestService = require('../../service/eol/systemtest.service');

function jsonOk(res, data) {
  return res.json({ status: 200, data });
}

function jsonErr(res, err, defaultStatus = 400) {
  const status = err.status || defaultStatus;
  return res.status(status).json({ status, message: err.message });
}

async function status(req, res) {
  try {
    const data = await systemtestService.getStatus(req.session);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function create(req, res) {
  try {
    const amount = req.body.amount;
    const skills = req.body.skills;
    const data = await systemtestService.createTest(req.session, amount, skills);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function question(req, res) {
  try {
    const quizId = req.query.quiz_id;
    const data = await systemtestService.getQuestion(req.session, quizId);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function record(req, res) {
  try {
    const { quiz_id, answer_id, time_left } = req.body || {};
    const data = await systemtestService.recordAnswer(req.session, quiz_id, answer_id, time_left);
    return jsonOk(res, data);
  } catch (err) {
    return jsonErr(res, err);
  }
}

async function finish(req, res) {
  try {
    const memberId = req.user?.memberId;
    if (!memberId) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    const data = await systemtestService.finishTest(req.session, memberId);
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Failed to destroy session:', destroyErr);
      }
      return jsonOk(res, data);
    });
  } catch (err) {
    return jsonErr(res, err);
  }
}

module.exports = {
  status,
  create,
  question,
  record,
  finish,
};
