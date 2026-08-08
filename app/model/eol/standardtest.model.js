const mysqli = require('../../config/mysqli.config');

async function getMemberById(memberId) {
  const [rows] = await mysqli.query(
    'SELECT member_id FROM tbl_x_member WHERE member_id = ? LIMIT 1',
    [memberId],
  );
  return rows[0] || null;
}

async function getPassedResults(memberId, percent) {
  const [rows] = await mysqli.query(
    'SELECT skill_id, level_id FROM tbl_w_result WHERE member_id = ? AND percent >= ? GROUP BY skill_id, level_id',
    [memberId, percent],
  );
  return rows;
}

async function getEstEtests() {
  const [rows] = await mysqli.query(
    'SELECT ETEST_ID, ETEST_TIME FROM tbl_etest WHERE IS_EST = ? AND IS_ACTIVE = ?',
    [1, 1],
  );
  return rows;
}

async function getLastEstResult(memberId, etestIds, sinceDate) {
  if (!etestIds || etestIds.length === 0) return null;
  const placeholders = etestIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT result_id, create_date FROM tbl_w_result_est WHERE etest_id IN (${placeholders}) AND member_id = ? AND create_date >= ? ORDER BY create_date DESC LIMIT 1`,
    [...etestIds, memberId, sinceDate],
  );
  return rows[0] || null;
}

async function getAnyEstResult(memberId, etestIds) {
  if (!etestIds || etestIds.length === 0) return null;
  const placeholders = etestIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT result_id, create_date FROM tbl_w_result_est WHERE etest_id IN (${placeholders}) AND member_id = ? ORDER BY create_date DESC LIMIT 1`,
    [...etestIds, memberId],
  );
  return rows[0] || null;
}

async function getEstQuestions(etestId, skillId) {
  const [rows] = await mysqli.query(
    `SELECT m.QUESTIONS_ID, q.SKILL_ID, qm.GQUESTION_ID
     FROM tbl_etest_mapping AS m
     INNER JOIN tbl_questions AS q ON m.QUESTIONS_ID = q.QUESTIONS_ID
     LEFT JOIN tbl_questions_mapping AS qm ON m.QUESTIONS_ID = qm.QUESTIONS_ID
     WHERE m.ETEST_ID = ? AND q.SKILL_ID = ?
     ORDER BY qm.GQUESTION_ID ASC, q.QUESTIONS_ID ASC`,
    [etestId, skillId],
  );
  return rows;
}

async function getQuestionText(questionId) {
  const [rows] = await mysqli.query(
    'SELECT QUESTIONS_TEXT, SKILL_ID FROM tbl_questions WHERE QUESTIONS_ID = ? LIMIT 1',
    [questionId],
  );
  return rows[0] || null;
}

async function getAnswers(questionId) {
  const [rows] = await mysqli.query(
    'SELECT ANSWERS_ID, ANSWERS_TEXT, ANSWERS_CORRECT FROM tbl_answers WHERE QUESTIONS_ID = ? ORDER BY ANSWERS_ID ASC',
    [questionId],
  );
  return rows;
}

async function getRelatedMedia(gquestionId) {
  const [rows] = await mysqli.query(
    'SELECT GQUESTION_TYPE_ID, GQUESTION_TEXT FROM tbl_gquestion WHERE GQUESTION_ID = ? AND IS_ACTIVE = ? LIMIT 1',
    [gquestionId, 1],
  );
  return rows[0] || null;
}

async function getNextResultId() {
  const [rows] = await mysqli.query('SELECT result_id FROM tbl_w_result_est ORDER BY result_id DESC LIMIT 1');
  return rows.length ? rows[0].result_id + 1 : 1;
}

async function getNextResultDetailId() {
  const [rows] = await mysqli.query('SELECT result_detail_id FROM tbl_w_result_est_detail ORDER BY result_detail_id DESC LIMIT 1');
  return rows.length ? rows[0].result_detail_id + 1 : 1;
}

async function insertResult(resultId, memberId, etestId, percent, now) {
  await mysqli.query(
    'INSERT INTO tbl_w_result_est (result_id, member_id, etest_id, percent, create_date) VALUES (?,?,?,?,?)',
    [resultId, memberId, etestId, percent, now],
  );
}

async function insertResultDetail(detailId, resultId, quizId, ansId) {
  await mysqli.query(
    'INSERT INTO tbl_w_result_est_detail (result_detail_id, result_id, quiz_id, ans_id) VALUES (?,?,?,?)',
    [detailId, resultId, quizId, ansId || 0],
  );
}

module.exports = {
  getMemberById,
  getPassedResults,
  getEstEtests,
  getLastEstResult,
  getAnyEstResult,
  getEstQuestions,
  getQuestionText,
  getAnswers,
  getRelatedMedia,
  getNextResultId,
  getNextResultDetailId,
  insertResult,
  insertResultDetail,
};
