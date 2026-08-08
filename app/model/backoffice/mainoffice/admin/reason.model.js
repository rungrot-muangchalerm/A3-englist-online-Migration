const mysqli = require('../../../../config/mysqli.config');

async function findDetails(skillId) {
  const params = [];
  let where = '';
  let groupBy = 'd.DETAIL_ID';
  if (skillId) {
    where = 'WHERE d.SKILL_ID = ?';
    groupBy = 'd.DETAIL_NAME';
    params.push(skillId);
  }
  const [rows] = await mysqli.query(
    `SELECT d.DETAIL_ID, d.DETAIL_NAME, d.DETAIL_CODE, d.SSKILL_ID, d.SKILL_ID, s.SSKILL_NAME
     FROM tbl_item_detail AS d
     LEFT JOIN tbl_item_sskill AS s ON d.SSKILL_ID = s.SSKILL_ID
     ${where}
     GROUP BY ${groupBy}
     ORDER BY d.DETAIL_ID`,
    params,
  );
  return rows;
}

async function countQuestionsByDetail(skillId) {
  const [rows] = await mysqli.query(
    `SELECT DETAIL_ID, LEVEL_ID, COUNT(QUESTIONS_ID) AS amount
     FROM tbl_questions
     WHERE TEST_ID = 1
       AND SKILL_ID = ?
       AND LEVEL_ID IN (1, 2, 3, 4, 5)
     GROUP BY DETAIL_ID, LEVEL_ID`,
    [skillId],
  );
  return rows;
}

async function findDetail(detailId) {
  const [rows] = await mysqli.query(
    `SELECT DETAIL_ID, DETAIL_NAME
     FROM tbl_item_detail
     WHERE DETAIL_ID = ?
     GROUP BY DETAIL_ID
     LIMIT 1`,
    [detailId],
  );
  return rows.length ? rows[0] : null;
}

async function findQuestionsByDetail(detailId) {
  const [rows] = await mysqli.query(
    `SELECT q.LEVEL_ID, q.TEST_ID, q.SKILL_ID, q.SSKILL_ID, q.DETAIL_ID, q.QUESTIONS_ID,
            sk.SKILL_NAME, ss.SSKILL_NAME
     FROM tbl_questions AS q
     LEFT JOIN tbl_item_skill AS sk ON q.SKILL_ID = sk.SKILL_ID
     LEFT JOIN tbl_item_sskill AS ss ON q.SSKILL_ID = ss.SSKILL_ID
     WHERE q.DETAIL_ID = ?
     ORDER BY q.SKILL_ID, q.SSKILL_ID`,
    [detailId],
  );
  return rows;
}

async function findQuestion(questionId) {
  const [rows] = await mysqli.query(
    `SELECT q.QUESTIONS_ID, q.QUESTIONS_TEXT, q.TEST_ID, q.LEVEL_ID, q.SKILL_ID, q.SSKILL_ID, q.DETAIL_ID,
            sec.TEST_NAME, lv.LEVEL_NAME, sk.SKILL_NAME, ss.SSKILL_NAME, d.DETAIL_NAME
     FROM tbl_questions AS q
     LEFT JOIN tbl_section AS sec ON q.TEST_ID = sec.TEST_ID
     LEFT JOIN tbl_item_level AS lv ON q.LEVEL_ID = lv.LEVEL_ID
     LEFT JOIN tbl_item_skill AS sk ON q.SKILL_ID = sk.SKILL_ID
     LEFT JOIN tbl_item_sskill AS ss ON q.SSKILL_ID = ss.SSKILL_ID
     LEFT JOIN tbl_item_detail AS d ON q.DETAIL_ID = d.DETAIL_ID
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

async function findDescription(questionId) {
  const [rows] = await mysqli.query(
    `SELECT TEXT
     FROM tbl_description
     WHERE QUESTIONS_ID = ?
     LIMIT 1`,
    [questionId],
  );
  return rows.length ? rows[0] : null;
}

module.exports = {
  findDetails,
  countQuestionsByDetail,
  findDetail,
  findQuestionsByDetail,
  findQuestion,
  findAnswers,
  findDescription,
};
