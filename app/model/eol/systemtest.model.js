const mysqli = require('../../config/mysqli.config');

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

async function countQuestions(skillId, levelId) {
  const [rows] = await mysqli.query(
    `SELECT COUNT(1) AS cnt
     FROM tbl_questions
     WHERE TEST_ID = 1 AND SKILL_ID = ? AND LEVEL_ID = ? AND IS_ACTIVE = 1`,
    [skillId, levelId],
  );
  return rows[0]?.cnt || 0;
}

async function getRandomQuestions(skillId, levelId, limit) {
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID, SKILL_ID
     FROM tbl_questions
     WHERE TEST_ID = 1 AND SKILL_ID = ? AND LEVEL_ID = ? AND IS_ACTIVE = 1
     ORDER BY RAND()
     LIMIT ?`,
    [skillId, levelId, limit],
  );
  return rows;
}

async function getQuestion(quizId) {
  const [rows] = await mysqli.query(
    `SELECT * FROM tbl_questions WHERE QUESTIONS_ID = ? AND IS_ACTIVE = 1 LIMIT 1`,
    [quizId],
  );
  return rows[0] || null;
}

async function getAnswers(quizId) {
  const [rows] = await mysqli.query(
    `SELECT * FROM tbl_answers WHERE QUESTIONS_ID = ? ORDER BY ANSWERS_ID`,
    [quizId],
  );
  return rows;
}

async function getRelatedMedia(quizId) {
  const [mappingRows] = await mysqli.query(
    `SELECT GQUESTION_ID FROM tbl_questions_mapping WHERE QUESTIONS_ID = ? LIMIT 1`,
    [quizId],
  );
  if (!mappingRows.length) return null;
  const gquestionId = mappingRows[0].GQUESTION_ID;
  const [rows] = await mysqli.query(
    `SELECT * FROM tbl_gquestion WHERE GQUESTION_ID = ? AND IS_ACTIVE = 1 LIMIT 1`,
    [gquestionId],
  );
  return rows[0] || null;
}

async function getCorrectAnswerId(quizId) {
  const [rows] = await mysqli.query(
    `SELECT ANSWERS_ID FROM tbl_answers
     WHERE QUESTIONS_ID = ? AND ANSWERS_CORRECT = 1 LIMIT 1`,
    [quizId],
  );
  return rows[0]?.ANSWERS_ID || null;
}

async function getNextResultId() {
  const [rows] = await mysqli.query(
    'SELECT COALESCE(MAX(result_id), 0) + 1 AS nextId FROM tbl_w_result',
  );
  return rows[0]?.nextId || 1;
}

async function getNextResultDetailId() {
  const [rows] = await mysqli.query(
    'SELECT COALESCE(MAX(result_detail_id), 0) + 1 AS nextId FROM tbl_w_result_detail',
  );
  return rows[0]?.nextId || 1;
}

async function insertResult(resultId, memberId, skillId, levelId, percent) {
  await mysqli.query(
    `INSERT INTO tbl_w_result
     (result_id, member_id, skill_id, level_id, etest_id, percent, create_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [resultId, memberId, skillId, levelId, 0, percent, nowString()],
  );
}

async function insertResultDetail(detailId, resultId, quizId, ansId) {
  await mysqli.query(
    `INSERT INTO tbl_w_result_detail
     (result_detail_id, result_id, quiz_id, ans_id)
     VALUES (?, ?, ?, ?)`,
    [detailId, resultId, quizId, ansId || 0],
  );
}

module.exports = {
  countQuestions,
  getRandomQuestions,
  getQuestion,
  getAnswers,
  getRelatedMedia,
  getCorrectAnswerId,
  getNextResultId,
  getNextResultDetailId,
  insertResult,
  insertResultDetail,
};
