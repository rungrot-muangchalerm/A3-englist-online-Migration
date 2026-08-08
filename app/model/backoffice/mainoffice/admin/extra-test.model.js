const mysqli = require('../../../../config/mysqli.config');

async function countTests() {
  const [rows] = await mysqli.query('SELECT COUNT(ETEST_ID) AS total FROM tbl_etest');
  return rows.length ? Number(rows[0].total) || 0 : 0;
}

async function findTests(offset, limit) {
  const [rows] = await mysqli.query(
    `SELECT e.ETEST_ID, e.ETEST_NAME, e.ETEST_TIME, e.IS_FREE, e.IS_EST, e.IS_ACTIVE,
            COALESCE(m.quiz_amount, 0) AS quiz_amount
     FROM tbl_etest AS e
     LEFT JOIN (
       SELECT ETEST_ID, COUNT(QUESTIONS_ID) AS quiz_amount
       FROM tbl_etest_mapping
       GROUP BY ETEST_ID
     ) AS m ON e.ETEST_ID = m.ETEST_ID
     ORDER BY e.ETEST_ID ASC
     LIMIT ?, ?`,
    [offset, limit],
  );
  return rows;
}

async function findTest(testId) {
  const [rows] = await mysqli.query(
    `SELECT e.ETEST_ID, e.ETEST_NAME, e.ETEST_TIME, e.RE_TEST, e.start, e.stop,
            e.IS_FREE, e.IS_EST, e.IS_ACTIVE,
            COALESCE(m.quiz_amount, 0) AS quiz_amount
     FROM tbl_etest AS e
     LEFT JOIN (
       SELECT ETEST_ID, COUNT(QUESTIONS_ID) AS quiz_amount
       FROM tbl_etest_mapping
       GROUP BY ETEST_ID
     ) AS m ON e.ETEST_ID = m.ETEST_ID
     WHERE e.ETEST_ID = ?
     LIMIT 1`,
    [testId],
  );
  return rows.length ? rows[0] : null;
}

async function findMappedQuestions(testId) {
  const [rows] = await mysqli.query(
    `SELECT q.QUESTIONS_ID, q.QUESTIONS_TEXT,
            sec.TEST_NAME, lv.LEVEL_NAME, sk.SKILL_NAME, ss.SSKILL_NAME, d.DETAIL_NAME
     FROM tbl_etest_mapping AS em
     LEFT JOIN tbl_questions AS q ON em.QUESTIONS_ID = q.QUESTIONS_ID
     LEFT JOIN tbl_section AS sec ON q.TEST_ID = sec.TEST_ID
     LEFT JOIN tbl_item_level AS lv ON q.LEVEL_ID = lv.LEVEL_ID
     LEFT JOIN tbl_item_skill AS sk ON q.SKILL_ID = sk.SKILL_ID
     LEFT JOIN tbl_item_sskill AS ss ON q.SSKILL_ID = ss.SSKILL_ID
     LEFT JOIN tbl_item_detail AS d ON q.DETAIL_ID = d.DETAIL_ID
     WHERE em.ETEST_ID = ?
     ORDER BY em.QUESTIONS_ID ASC`,
    [testId],
  );
  return rows;
}

async function findAnswers(questionIds) {
  if (!questionIds.length) return [];
  const placeholders = questionIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID, ANSWERS_ID, ANSWERS_TEXT, ANSWERS_CORRECT
     FROM tbl_answers
     WHERE QUESTIONS_ID IN (${placeholders})
     ORDER BY QUESTIONS_ID, ANSWERS_ID`,
    questionIds,
  );
  return rows;
}

module.exports = {
  countTests,
  findTests,
  findTest,
  findMappedQuestions,
  findAnswers,
};
