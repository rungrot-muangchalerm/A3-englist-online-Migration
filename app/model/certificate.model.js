const mysqli = require('../config/mysqli.config');

const REQUIRED_SKILLS = [1, 2, 3, 4, 5, 7];

const SKILL_NAMES = {
  1: 'Reading Comprehension',
  2: 'Listening Comprehension',
  3: 'Semi-Speaking',
  4: 'Semi-Writing',
  5: 'Grammar',
  7: 'Vocabulary',
};

module.exports = {
  REQUIRED_SKILLS,
  SKILL_NAMES,

  /**
   * ดึงข้อมูล certificate ของสมาชิกตาม member_id
   */
  getByMemberId: async (memberId) => {
    const [[members]] = await mysqli.query(
      'SELECT fname, lname, gender FROM tbl_x_member WHERE member_id = ? LIMIT 1',
      [memberId]
    );

    const fname = members ? members.fname : '';
    const lname = members ? members.lname : '';
    const fullName = `${fname} ${lname}`.trim();

    const passedSkills = [];
    const missingSkills = [];

    for (const skillId of REQUIRED_SKILLS) {
      const [[row]] = await mysqli.query(
        `SELECT MAX(percent) AS max_score, level_id
         FROM tbl_w_result
         WHERE member_id = ? AND skill_id = ? AND percent >= 50 AND level_id >= 2
         GROUP BY level_id
         ORDER BY percent DESC
         LIMIT 1`,
        [memberId, skillId]
      );

      if (row && row.max_score !== null) {
        passedSkills.push({
          id: skillId,
          name: SKILL_NAMES[skillId],
          score: row.max_score,
        });
      } else {
        missingSkills.push({
          id: skillId,
          name: SKILL_NAMES[skillId],
        });
      }
    }

    return {
      memberId,
      fname,
      lname,
      fullName,
      passedSkills,
      missingSkills,
      missingSkillsText: missingSkills.map((s) => s.name).join(', ') || '-',
      allPassed: missingSkills.length === 0,
    };
  },
};
