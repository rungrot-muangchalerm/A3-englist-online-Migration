const mysqli = require('../../../../config/mysqli.config');

async function countCommentedQuizzes() {
  const [rows] = await mysqli.query(
    `SELECT COUNT(*) AS total
     FROM (
       SELECT quiz_id
       FROM tbl_quiz_comment
       GROUP BY quiz_id
     ) AS grouped`,
  );
  return rows.length ? Number(rows[0].total) || 0 : 0;
}

async function findCommentedQuizzes(offset, limit) {
  const [rows] = await mysqli.query(
    `SELECT qc.quiz_id,
            q.SKILL_ID, q.LEVEL_ID,
            SUM(CASE WHEN qc.status = 0 THEN 1 ELSE 0 END) AS unanswered,
            SUM(CASE WHEN qc.status = 1 THEN 1 ELSE 0 END) AS answered
     FROM tbl_quiz_comment AS qc
     LEFT JOIN tbl_questions AS q ON qc.quiz_id = q.QUESTIONS_ID
     GROUP BY qc.quiz_id
     ORDER BY MAX(qc.date) DESC
     LIMIT ?, ?`,
    [offset, limit],
  );
  return rows;
}

async function findQuestion(questionId) {
  const [rows] = await mysqli.query(
    `SELECT q.QUESTIONS_ID, q.QUESTIONS_TEXT,
            sec.TEST_NAME, lv.LEVEL_NAME, sk.SKILL_NAME, ss.SSKILL_NAME, d.DETAIL_NAME,
            des.TEXT AS DESCRIPTION_TEXT
     FROM tbl_questions AS q
     LEFT JOIN tbl_section AS sec ON q.TEST_ID = sec.TEST_ID
     LEFT JOIN tbl_item_level AS lv ON q.LEVEL_ID = lv.LEVEL_ID
     LEFT JOIN tbl_item_skill AS sk ON q.SKILL_ID = sk.SKILL_ID
     LEFT JOIN tbl_item_sskill AS ss ON q.SSKILL_ID = ss.SSKILL_ID
     LEFT JOIN tbl_item_detail AS d ON q.DETAIL_ID = d.DETAIL_ID
     LEFT JOIN tbl_description AS des ON q.QUESTIONS_ID = des.QUESTIONS_ID
     WHERE q.QUESTIONS_ID = ?
     LIMIT 1`,
    [questionId],
  );
  return rows.length ? rows[0] : null;
}

async function findAnswers(questionId) {
  const [rows] = await mysqli.query(
    `SELECT ANSWERS_ID, ANSWERS_TEXT, ANSWERS_CORRECT
     FROM tbl_answers
     WHERE QUESTIONS_ID = ?
     ORDER BY ANSWERS_ID`,
    [questionId],
  );
  return rows;
}

async function findComments(questionId) {
  const [rows] = await mysqli.query(
    `SELECT qc.quiz_id, qc.mem_id, qc.text, qc.date, qc.status,
            m.member_id, m.email, m.fname, m.lname
     FROM tbl_quiz_comment AS qc
     LEFT JOIN tbl_x_member AS m ON qc.mem_id = m.member_id
     WHERE qc.quiz_id = ?
     ORDER BY qc.date DESC`,
    [questionId],
  );
  return rows;
}

module.exports = {
  countCommentedQuizzes,
  findCommentedQuizzes,
  findQuestion,
  findAnswers,
  findComments,
};
