const mysqli = require('../../config/mysqli.config');

function buildTypeId(skillId, levelId) {
  return `1${skillId}-0${levelId}`;
}

async function countTopicsByType(skillId, levelId, search) {
  const typeId = buildTypeId(skillId, levelId);
  const active = 1;
  if (search) {
    const [rows] = await mysqli.query(
      'SELECT COUNT(*) AS total FROM tbl_web_topic WHERE type_id = ? AND topic_active = ? AND topic_name LIKE ?',
      [typeId, active, `%${search}%`],
    );
    return rows[0].total;
  }
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS total FROM tbl_web_topic WHERE type_id = ? AND topic_active = ?',
    [typeId, active],
  );
  return rows[0].total;
}

async function findTopicsByType(skillId, levelId, options) {
  const { page = 1, perPage = 20, search } = options;
  const typeId = buildTypeId(skillId, levelId);
  const active = 1;
  const offset = (page - 1) * perPage;
  if (search) {
    const [rows] = await mysqli.query(
      'SELECT topic_id, topic_name, admin_id FROM tbl_web_topic WHERE type_id = ? AND topic_active = ? AND topic_name LIKE ? ORDER BY topic_name ASC LIMIT ?, ?',
      [typeId, active, `%${search}%`, offset, perPage],
    );
    return rows;
  }
  const [rows] = await mysqli.query(
    'SELECT topic_id, topic_name, admin_id FROM tbl_web_topic WHERE type_id = ? AND topic_active = ? ORDER BY topic_name ASC LIMIT ?, ?',
    [typeId, active, offset, perPage],
  );
  return rows;
}

async function findTopicById(topicId) {
  const active = 1;
  const [rows] = await mysqli.query(
    'SELECT topic_id, topic_name, topic_detail, type_id FROM tbl_web_topic WHERE topic_id = ? AND topic_active = ? LIMIT 1',
    [topicId, active],
  );
  return rows[0] || null;
}

async function findRelatedTopics(topicIds) {
  if (!topicIds || topicIds.length === 0) return [];
  const placeholders = topicIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT topic_id, topic_name FROM tbl_web_topic WHERE topic_id IN (${placeholders}) ORDER BY topic_name ASC`,
    topicIds,
  );
  return rows;
}

module.exports = {
  countTopicsByType,
  findTopicsByType,
  findTopicById,
  findRelatedTopics,
};
