const mysqli = require('../../../../config/mysqli.config');

async function countQuestionsBySkillAndLevel() {
  const [rows] = await mysqli.query(
    `SELECT SKILL_ID, LEVEL_ID, IS_ACTIVE, COUNT(QUESTIONS_ID) AS amount
     FROM tbl_questions
     WHERE TEST_ID = 1
       AND SKILL_ID IN (1, 2, 3, 4, 5, 6, 7)
       AND LEVEL_ID IN (1, 2, 3, 4, 5)
       AND IS_ACTIVE IN (0, 1)
     GROUP BY SKILL_ID, LEVEL_ID, IS_ACTIVE`,
  );
  return rows;
}

async function countDescriptionsBySkill() {
  const [rows] = await mysqli.query(
    `SELECT q.SKILL_ID, COUNT(q.QUESTIONS_ID) AS amount
     FROM tbl_questions AS q
     INNER JOIN tbl_description AS d ON q.QUESTIONS_ID = d.QUESTIONS_ID
     WHERE q.SKILL_ID IN (1, 2, 3, 4, 5, 6, 7)
     GROUP BY q.SKILL_ID`,
  );
  return rows;
}

module.exports = {
  countQuestionsBySkillAndLevel,
  countDescriptionsBySkill,
};
