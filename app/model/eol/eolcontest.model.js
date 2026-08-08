const mysqli = require('../../config/mysqli.config');

async function findActiveSubMember(memberId) {
  const [rows] = await mysqli.query(
    'SELECT master_id, sub_id, status, type_id FROM tbl_x_member_sub WHERE sub_id = ? AND status = ? LIMIT 1',
    [memberId, 1],
  );
  return rows[0] || null;
}

async function findExamsByMaster(masterId) {
  const [rows] = await mysqli.query(
    `SELECT exam_id, exam_name, testtime, test_type, active, exam_type, create_by, create_date
     FROM tbl_eventest
     WHERE create_by = ?
     ORDER BY exam_id DESC`,
    [masterId],
  );
  return rows;
}

async function findAllowgroup(examId, groupType) {
  const [rows] = await mysqli.query(
    'SELECT allow_id FROM tbl_eventest_allowgroup WHERE exam_id = ? AND group_type = ? LIMIT 1',
    [examId, groupType],
  );
  return rows[0] || null;
}

async function countSystemQuestions(examId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS c FROM tbl_eventest_question WHERE exam_id = ?',
    [examId],
  );
  return rows[0]?.c || 0;
}

async function countCustomQuestions(examId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS c FROM tbl_eventest_question_custom WHERE exam_id = ?',
    [examId],
  );
  return rows[0]?.c || 0;
}

async function findExamById(examId, masterId) {
  const [rows] = await mysqli.query(
    `SELECT exam_id, exam_name, testtime, test_type, active, exam_type, create_by, create_date
     FROM tbl_eventest
     WHERE exam_id = ? AND create_by = ?
     LIMIT 1`,
    [examId, masterId],
  );
  return rows[0] || null;
}

async function findSystemQuestionIds(examId) {
  const [rows] = await mysqli.query(
    `SELECT q.QUESTIONS_ID AS question_id, qm.GQUESTION_ID
     FROM tbl_eventest_question AS eq
     INNER JOIN tbl_questions AS q ON eq.question_id = q.QUESTIONS_ID
     LEFT JOIN tbl_questions_mapping AS qm ON q.QUESTIONS_ID = qm.QUESTIONS_ID
     WHERE eq.exam_id = ?
     ORDER BY eq.id ASC`,
    [examId],
  );
  return rows;
}

async function findCustomQuestionIds(examId) {
  const [rows] = await mysqli.query(
    'SELECT question_id FROM tbl_eventest_question_custom WHERE exam_id = ? ORDER BY question_id ASC',
    [examId],
  );
  return rows;
}

async function getSystemQuestion(questionId) {
  const [rows] = await mysqli.query(
    'SELECT QUESTIONS_TEXT, SKILL_ID FROM tbl_questions WHERE QUESTIONS_ID = ? AND IS_ACTIVE = ? LIMIT 1',
    [questionId, 1],
  );
  return rows[0] || null;
}

async function getSystemAnswers(questionId) {
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

async function getCustomQuestion(questionId) {
  const [rows] = await mysqli.query(
    'SELECT question_id, question_text FROM tbl_eventest_question_custom WHERE question_id = ? LIMIT 1',
    [questionId],
  );
  return rows[0] || null;
}

async function getCustomAnswers(questionId) {
  const [rows] = await mysqli.query(
    'SELECT answer_id, answer_text, answer FROM tbl_eventest_answer WHERE question_id = ? ORDER BY answer_id ASC',
    [questionId],
  );
  return rows;
}

async function getNextResultId() {
  const [rows] = await mysqli.query('SELECT result_id FROM tbl_w_result ORDER BY result_id DESC LIMIT 1');
  return rows.length ? rows[0].result_id + 1 : 1;
}

async function getNextResultDetailId() {
  const [rows] = await mysqli.query('SELECT result_detail_id FROM tbl_w_result_detail ORDER BY result_detail_id DESC LIMIT 1');
  return rows.length ? rows[0].result_detail_id + 1 : 1;
}

async function insertResult(resultId, memberId, etestId, percent, now) {
  await mysqli.query(
    'INSERT INTO tbl_w_result (result_id, member_id, skill_id, level_id, etest_id, percent, create_date) VALUES (?,?,?,?,?,?,?)',
    [resultId, memberId, 0, 0, etestId, percent, now],
  );
}

async function insertResultDetail(detailId, resultId, quizId, ansId) {
  await mysqli.query(
    'INSERT INTO tbl_w_result_detail (result_detail_id, result_id, quiz_id, ans_id) VALUES (?,?,?,?)',
    [detailId, resultId, quizId, ansId || 0],
  );
}

async function upsertRealtime(memberId, etestId, percent, now) {
  const [rows] = await mysqli.query(
    'SELECT id FROM tbl_w_realtime WHERE member_id = ? AND etest_id = ? LIMIT 1',
    [memberId, etestId],
  );
  if (rows.length === 1) {
    await mysqli.query(
      'UPDATE tbl_w_realtime SET percent = ?, create_date = ?, end_time = ? WHERE member_id = ? AND etest_id = ?',
      [percent, now, now, memberId, etestId],
    );
  } else {
    await mysqli.query(
      'INSERT INTO tbl_w_realtime (member_id, etest_id, percent, create_date, start_time, end_time) VALUES (?,?,?,?,?,?)',
      [memberId, etestId, percent, now, now, now],
    );
  }
}

module.exports = {
  findActiveSubMember,
  findExamsByMaster,
  findAllowgroup,
  countSystemQuestions,
  countCustomQuestions,
  findExamById,
  findSystemQuestionIds,
  findCustomQuestionIds,
  getSystemQuestion,
  getSystemAnswers,
  getRelatedMedia,
  getCustomQuestion,
  getCustomAnswers,
  getNextResultId,
  getNextResultDetailId,
  insertResult,
  insertResultDetail,
  upsertRealtime,
};
