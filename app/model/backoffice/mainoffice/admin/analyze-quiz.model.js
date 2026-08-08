const mysqli = require('../../../../config/mysqli.config');

async function countQuestionsWithResults() {
  const [rows] = await mysqli.query(
    `SELECT COUNT(*) AS total
     FROM (
       SELECT QUESTIONS_ID
       FROM tbl_result_detail
       GROUP BY QUESTIONS_ID
     ) AS grouped`,
  );
  return rows.length ? Number(rows[0].total) || 0 : 0;
}

async function findQuestionsWithResults(offset, limit) {
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID
     FROM tbl_result_detail
     GROUP BY QUESTIONS_ID
     ORDER BY QUESTIONS_ID ASC
     LIMIT ?, ?`,
    [offset, limit],
  );
  return rows;
}

async function findAnswers(questionIds) {
  if (!questionIds.length) return [];
  const placeholders = questionIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID, ANSWERS_ID, ANSWERS_CORRECT
     FROM tbl_answers
     WHERE QUESTIONS_ID IN (${placeholders})
     ORDER BY QUESTIONS_ID, ANSWERS_ID`,
    questionIds,
  );
  return rows;
}

async function countResults(questionIds) {
  if (!questionIds.length) return [];
  const placeholders = questionIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID, RETEST_RESULT, COUNT(RESULT_DETAIL_ID) AS amount
     FROM tbl_result_detail
     WHERE QUESTIONS_ID IN (${placeholders})
     GROUP BY QUESTIONS_ID, RETEST_RESULT`,
    questionIds,
  );
  return rows;
}

module.exports = {
  countQuestionsWithResults,
  findQuestionsWithResults,
  findAnswers,
  countResults,
};
