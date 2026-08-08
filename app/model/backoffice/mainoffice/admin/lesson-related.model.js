const mysqli = require('../../../../config/mysqli.config');

async function findRelations(skillId) {
  const [rows] = await mysqli.query(
    `SELECT sw.SKILL_ID, sw.DETAIL_ID, sw.TOPIC_ID,
            d.DETAIL_NAME,
            t.topic_name
     FROM tbl_e_switch AS sw
     LEFT JOIN tbl_item_detail AS d ON sw.DETAIL_ID = d.DETAIL_ID AND sw.SKILL_ID = d.SKILL_ID
     LEFT JOIN tbl_web_topic AS t ON sw.TOPIC_ID = t.topic_id
     WHERE sw.SKILL_ID = ?
     ORDER BY sw.DETAIL_ID`,
    [skillId],
  );
  return rows;
}

module.exports = {
  findRelations,
};
