const mysqli = require('../../config/mysqli.config');

function buildTypeId(skillId, levelId) {
  return `1${skillId}-0${levelId}`;
}

async function findActiveSubMember(memberId) {
  const [rows] = await mysqli.query(
    'SELECT master_id, sub_id, status, type_id FROM tbl_x_member_sub WHERE sub_id = ? AND status = ? LIMIT 1',
    [memberId, 1],
  );
  return rows[0] || null;
}

async function findCustomLessons(masterId) {
  const [rows] = await mysqli.query(
    'SELECT lesson_id, lesson_name, active, createdby FROM tbl_lesson_custom WHERE active = ? AND createdby = ? ORDER BY lesson_name ASC',
    [1, masterId],
  );
  return rows;
}

async function findCustomLessonById(lessonId) {
  const [rows] = await mysqli.query(
    'SELECT lesson_id, lesson_name, lesson_content, active, createdby FROM tbl_lesson_custom WHERE active = ? AND lesson_id = ? LIMIT 1',
    [1, lessonId],
  );
  return rows[0] || null;
}

async function findVideoTopics(skillId, levelId) {
  const typeId = buildTypeId(skillId, levelId);
  const [rows] = await mysqli.query(
    'SELECT topic_id, topic_name, admin_id FROM tbl_web_topic WHERE type_id = ? AND topic_active = ? ORDER BY topic_name ASC',
    [typeId, 1],
  );
  return rows;
}

async function findVideoTopicById(topicId) {
  const [rows] = await mysqli.query(
    'SELECT topic_id, topic_name, topic_detail, type_id FROM tbl_web_topic WHERE topic_id = ? AND topic_active = ? LIMIT 1',
    [topicId, 1],
  );
  return rows[0] || null;
}

module.exports = {
  findActiveSubMember,
  findCustomLessons,
  findCustomLessonById,
  findVideoTopics,
  findVideoTopicById,
};
