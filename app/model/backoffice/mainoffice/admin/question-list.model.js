const mysqli = require('../../../../config/mysqli.config');

async function countQuestions(active) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(QUESTIONS_ID) AS total FROM tbl_questions WHERE IS_ACTIVE = ?',
    [active],
  );
  return rows.length ? Number(rows[0].total) || 0 : 0;
}

async function findQuestions(active, offset, limit) {
  const [rows] = await mysqli.query(
    `SELECT q.QUESTIONS_ID, q.QUESTIONS_TEXT, q.IS_ACTIVE,
            sec.TEST_NAME, lv.LEVEL_NAME, sk.SKILL_NAME, ss.SSKILL_NAME, d.DETAIL_NAME,
            des.TEXT AS DESCRIPTION_TEXT
     FROM tbl_questions AS q
     LEFT JOIN tbl_section AS sec ON q.TEST_ID = sec.TEST_ID
     LEFT JOIN tbl_item_level AS lv ON q.LEVEL_ID = lv.LEVEL_ID
     LEFT JOIN tbl_item_skill AS sk ON q.SKILL_ID = sk.SKILL_ID
     LEFT JOIN tbl_item_sskill AS ss ON q.SSKILL_ID = ss.SSKILL_ID
     LEFT JOIN tbl_item_detail AS d ON q.DETAIL_ID = d.DETAIL_ID
     LEFT JOIN tbl_description AS des ON q.QUESTIONS_ID = des.QUESTIONS_ID
     WHERE q.IS_ACTIVE = ?
     ORDER BY q.QUESTIONS_ID
     LIMIT ?, ?`,
    [active, offset, limit],
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

async function countRelated(active, typeId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(GQUESTION_ID) AS total FROM tbl_gquestion WHERE IS_ACTIVE = ? AND GQUESTION_TYPE_ID = ?',
    [active, typeId],
  );
  return rows.length ? Number(rows[0].total) || 0 : 0;
}

async function findRelated(active, typeId, offset, limit) {
  const [rows] = await mysqli.query(
    `SELECT GQUESTION_ID, GQUESTION_TYPE_ID, GQUESTION_NAME_REF, GQUESTION_TEXT, IS_ACTIVE
     FROM tbl_gquestion
     WHERE IS_ACTIVE = ? AND GQUESTION_TYPE_ID = ?
     ORDER BY GQUESTION_ID ASC
     LIMIT ?, ?`,
    [active, typeId, offset, limit],
  );
  return rows;
}

async function findRelatedQuestionIds(gquestionIds) {
  if (!gquestionIds.length) return [];
  const placeholders = gquestionIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT GQUESTION_ID, QUESTIONS_ID
     FROM tbl_questions_mapping
     WHERE GQUESTION_ID IN (${placeholders})
     ORDER BY GQUESTION_ID, QUESTIONS_ID`,
    gquestionIds,
  );
  return rows;
}

async function searchQuestions(keyword, questionId, offset, limit) {
  const params = [];
  let where = '1 = 0';
  if (questionId) {
    where = 'q.QUESTIONS_ID = ?';
    params.push(questionId);
  } else if (keyword) {
    where = 'q.QUESTIONS_TEXT LIKE ?';
    params.push(`%${keyword}%`);
  }
  const [rows] = await mysqli.query(
    `SELECT q.QUESTIONS_ID, q.QUESTIONS_TEXT, q.IS_ACTIVE,
            sec.TEST_NAME, lv.LEVEL_NAME, sk.SKILL_NAME, ss.SSKILL_NAME, d.DETAIL_NAME,
            des.TEXT AS DESCRIPTION_TEXT
     FROM tbl_questions AS q
     LEFT JOIN tbl_section AS sec ON q.TEST_ID = sec.TEST_ID
     LEFT JOIN tbl_item_level AS lv ON q.LEVEL_ID = lv.LEVEL_ID
     LEFT JOIN tbl_item_skill AS sk ON q.SKILL_ID = sk.SKILL_ID
     LEFT JOIN tbl_item_sskill AS ss ON q.SSKILL_ID = ss.SSKILL_ID
     LEFT JOIN tbl_item_detail AS d ON q.DETAIL_ID = d.DETAIL_ID
     LEFT JOIN tbl_description AS des ON q.QUESTIONS_ID = des.QUESTIONS_ID
     WHERE ${where}
     ORDER BY q.QUESTIONS_ID
     LIMIT ?, ?`,
    [...params, offset, limit],
  );
  return rows;
}

async function countSearchQuestions(keyword, questionId) {
  const params = [];
  let where = '1 = 0';
  if (questionId) {
    where = 'QUESTIONS_ID = ?';
    params.push(questionId);
  } else if (keyword) {
    where = 'QUESTIONS_TEXT LIKE ?';
    params.push(`%${keyword}%`);
  }
  const [rows] = await mysqli.query(
    `SELECT COUNT(QUESTIONS_ID) AS total FROM tbl_questions WHERE ${where}`,
    params,
  );
  return rows.length ? Number(rows[0].total) || 0 : 0;
}

module.exports = {
  countQuestions,
  findQuestions,
  findAnswers,
  countRelated,
  findRelated,
  findRelatedQuestionIds,
  searchQuestions,
  countSearchQuestions,
};
