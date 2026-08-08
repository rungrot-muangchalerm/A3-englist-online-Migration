const mysqli = require('../../config/mysqli.config');

async function resolveElearningSwitch(skillId, reasonId) {
  const skill = Number(skillId) || 0;
  const reason = Number(reasonId) || 0;

  if (skill >= 1 && reason >= 1) {
    const [[row]] = await mysqli.query(
      'SELECT TOPIC_ID FROM tbl_e_switch WHERE SKILL_ID = ? AND DETAIL_ID = ? LIMIT 1',
      [String(skill), String(reason)],
    );
    if (row && row.TOPIC_ID) {
      return `/lessons/elearning?section=elearning&skill_id=${skill}&level_id=1&topic_id=${row.TOPIC_ID}`;
    }
    return `/lessons/elearning?section=elearning&skill_id=${skill}&level_id=1`;
  }

  if (skill >= 1) {
    return `/lessons/elearning?section=elearning&skill_id=${skill}&level_id=1`;
  }

  return '/lessons/elearning?section=elearning';
}

module.exports = { resolveElearningSwitch };
