const mysqli = require('../../config/mysqli.config');

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function formatDbDate(value) {
  if (!value) return '-';
  if (value instanceof Date) return value.toISOString().slice(0, 19).replace('T', ' ');
  return String(value);
}

async function listExams(memberId) {
  const [rows] = await mysqli.query(
    `SELECT et.exam_id, et.exam_name, et.testtime, et.test_type, et.exam_type, et.create_date, et.active
     FROM tbl_eventest AS et
     WHERE et.create_by = ?
     ORDER BY et.exam_id DESC`,
    [memberId],
  );
  return rows;
}

async function getExam(examId, memberId) {
  const [rows] = await mysqli.query(
    `SELECT et.exam_id, et.exam_name, et.testtime, et.test_type, et.exam_type, et.create_date, et.active
     FROM tbl_eventest AS et
     WHERE et.exam_id = ? AND et.create_by = ?
     LIMIT 1`,
    [examId, memberId],
  );
  return rows[0] || null;
}

async function countSystemQuestions(examId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS cnt FROM tbl_eventest_question WHERE exam_id = ?',
    [examId],
  );
  return rows[0].cnt;
}

async function countCustomQuestions(examId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS cnt FROM tbl_eventest_question_custom WHERE exam_id = ?',
    [examId],
  );
  return rows[0].cnt;
}

async function getAllowGroups(examId) {
  const [rows] = await mysqli.query(
    'SELECT group_type FROM tbl_eventest_allowgroup WHERE exam_id = ?',
    [examId],
  );
  return rows.map((r) => String(r.group_type));
}

async function getMemberGroups(memberId) {
  const [rows] = await mysqli.query(
    'SELECT type_id, name FROM tbl_x_member_type WHERE member_id = ? ORDER BY name',
    [memberId],
  );
  return rows;
}

async function deleteAllowGroups(examId) {
  await mysqli.query('DELETE FROM tbl_eventest_allowgroup WHERE exam_id = ?', [examId]);
}

async function addAllowGroup(examId, groupType) {
  await mysqli.query(
    'INSERT INTO tbl_eventest_allowgroup (exam_id, group_type) VALUES (?, ?)',
    [examId, groupType],
  );
}

async function updateExam(examId, memberId, fields) {
  const { examName, testtime, testType, active } = fields;
  await mysqli.query(
    `UPDATE tbl_eventest
     SET exam_name = ?, testtime = ?, test_type = ?, active = ?
     WHERE exam_id = ? AND create_by = ?`,
    [examName, testtime, testType, active ? 1 : 0, examId, memberId],
  );
}

async function deleteExam(examId, memberId) {
  await mysqli.query('DELETE FROM tbl_eventest_answer WHERE question_id IN (SELECT question_id FROM tbl_eventest_question_custom WHERE exam_id = ?)', [examId]);
  await mysqli.query('DELETE FROM tbl_eventest_question_custom WHERE exam_id = ?', [examId]);
  await mysqli.query('DELETE FROM tbl_eventest_question WHERE exam_id = ?', [examId]);
  await mysqli.query('DELETE FROM tbl_eventest_allowgroup WHERE exam_id = ?', [examId]);
  await mysqli.query('DELETE FROM tbl_eventest WHERE exam_id = ? AND create_by = ?', [examId, memberId]);
}

async function createExam(memberId, fields) {
  const { examName, testtime, testType, examType } = fields;
  const [result] = await mysqli.query(
    `INSERT INTO tbl_eventest (exam_name, testtime, test_type, exam_type, create_by, create_date, active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [examName, testtime, testType, examType, memberId, nowString(), 0],
  );
  return result.insertId;
}

async function addCustomQuestion(examId, questionText) {
  const [result] = await mysqli.query(
    'INSERT INTO tbl_eventest_question_custom (exam_id, question_text, is_active) VALUES (?, ?, ?)',
    [examId, questionText, 1],
  );
  return result.insertId;
}

async function addCustomAnswer(questionId, answerText, isCorrect) {
  await mysqli.query(
    'INSERT INTO tbl_eventest_answer (question_id, answer_text, answer) VALUES (?, ?, ?)',
    [questionId, answerText, isCorrect ? 1 : 0],
  );
}

async function addSystemQuestion(examId, questionId) {
  await mysqli.query(
    'INSERT INTO tbl_eventest_question (exam_id, question_id) VALUES (?, ?)',
    [examId, questionId],
  );
}

async function getTopics(skillId) {
  const [rows] = await mysqli.query(
    `SELECT DETAIL_ID, DETAIL_NAME, DETAIL_CODE, SKILL_ID, SSKILL_ID
     FROM tbl_item_detail
     WHERE SKILL_ID = ?
     GROUP BY DETAIL_NAME
     ORDER BY DETAIL_ID`,
    [skillId],
  );
  return rows;
}

async function countAvailableQuestions(testId, skillId, level, topic) {
  const [rows] = await mysqli.query(
    `SELECT COUNT(*) AS cnt FROM tbl_questions
     WHERE TEST_ID = ? AND SKILL_ID = ? AND LEVEL_ID = ? AND DETAIL_ID = ? AND IS_ACTIVE = ?`,
    [testId, skillId, level, topic, 1],
  );
  return rows[0].cnt;
}

async function getRandomQuestions(testId, skillId, level, topic, limit) {
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID FROM tbl_questions
     WHERE TEST_ID = ? AND SKILL_ID = ? AND LEVEL_ID = ? AND DETAIL_ID = ? AND IS_ACTIVE = ?
     ORDER BY RAND()
     LIMIT ?`,
    [testId, skillId, level, topic, 1, limit],
  );
  return rows;
}

async function getQuestionsByIds(ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID FROM tbl_questions WHERE QUESTIONS_ID IN (${placeholders})`,
    ids,
  );
  return rows;
}

module.exports = {
  listExams,
  getExam,
  countSystemQuestions,
  countCustomQuestions,
  getAllowGroups,
  getMemberGroups,
  deleteAllowGroups,
  addAllowGroup,
  updateExam,
  deleteExam,
  createExam,
  addCustomQuestion,
  addCustomAnswer,
  addSystemQuestion,
  getTopics,
  countAvailableQuestions,
  getRandomQuestions,
  getQuestionsByIds,
  formatDbDate,
};
