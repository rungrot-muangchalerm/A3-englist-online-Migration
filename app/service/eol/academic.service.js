const mysqli = require('../../config/mysqli.config');

const SKILL_NAMES = {
  1: 'Reading Comprehension',
  2: 'Listening Comprehension',
  3: 'Semi-Speaking',
  4: 'Semi-Writing',
  5: 'Grammar',
  7: 'Vocabulary',
  10: 'Multiple Skills',
};

const LEVEL_NAMES = {
  1: 'Beginner',
  2: 'Lower Intermediate',
  3: 'Intermediate',
  4: 'Upper Intermediate',
  5: 'Advanced',
};

const LEVEL_COLORS = {
  1: '#ffb208',
  2: '#e29805',
  3: '#c98205',
  4: '#aa6b05',
  5: '#8e5503',
};

async function getBestPercent(memberId, skillId, levelId) {
  const [rows] = await mysqli.query(
    `SELECT MAX(percent) AS best
     FROM tbl_w_result
     WHERE member_id = ? AND skill_id = ? AND level_id = ?`,
    [memberId, skillId, levelId],
  );
  return rows[0] && rows[0].best !== null ? Number(rows[0].best) : 0;
}

async function getAcademicStatus(memberId) {
  const skills = [];

  for (const skillId of [1, 2, 3, 4, 5, 7]) {
    const levels = [];

    for (let levelId = 1; levelId <= 5; levelId += 1) {
      const percent = await getBestPercent(memberId, skillId, levelId);
      const unlocked = levelId === 1 || percent >= 50;

      levels.push({
        levelId,
        levelName: LEVEL_NAMES[levelId],
        color: LEVEL_COLORS[levelId],
        bestPercent: percent,
        unlocked,
      });
    }

    skills.push({
      skillId,
      skillName: SKILL_NAMES[skillId],
      levels,
    });
  }

  // Multiple Skills (skill_id 10)
  const multiLevels = [];
  for (let levelId = 1; levelId <= 5; levelId += 1) {
    const percent = await getBestPercent(memberId, 10, levelId);
    const unlocked = levelId === 1 || percent >= 50;

    multiLevels.push({
      levelId,
      levelName: LEVEL_NAMES[levelId],
      color: LEVEL_COLORS[levelId],
      bestPercent: percent,
      unlocked,
    });
  }

  skills.push({
    skillId: 10,
    skillName: SKILL_NAMES[10],
    levels: multiLevels,
  });

  return { skills };
}

const VALID_SKILLS = new Set([1, 2, 3, 4, 5, 7, 10]);

async function prepareTest(memberId, skillId, levelId) {
  const s = Number(skillId);
  const l = Number(levelId);
  if (!memberId || !VALID_SKILLS.has(s) || l < 1 || l > 5) {
    const err = new Error('Invalid skill or level');
    err.status = 400;
    throw err;
  }
  return { skillId: s, levelId: l };
}

module.exports = {
  getAcademicStatus,
  prepareTest,
};
