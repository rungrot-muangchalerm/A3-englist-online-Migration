const mysqli = require('../../../../config/mysqli.config');

async function findType(typeId) {
  const [rows] = await mysqli.query(
    'SELECT type_id, type_name FROM tbl_web_type WHERE type_id = ? LIMIT 1',
    [typeId],
  );
  return rows.length ? rows[0] : null;
}

async function findAdmin(adminId) {
  const [rows] = await mysqli.query(
    'SELECT admin_id, prefix, fname, lname, nickname FROM tbl_web_admin WHERE admin_id = ? LIMIT 1',
    [adminId],
  );
  return rows.length ? rows[0] : null;
}

async function countByType(typeId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS total FROM tbl_web_topic WHERE type_id = ?',
    [typeId],
  );
  return rows.length ? rows[0].total : 0;
}

async function findByType(typeId, start, perPage) {
  const [rows] = await mysqli.query(
    `SELECT t.topic_id, t.topic_name, t.topic_headline, t.topic_active,
            t.topic_comment, t.topic_create, t.admin_id, t.topic_by,
            a.nickname AS admin_nickname
     FROM tbl_web_topic AS t
     LEFT JOIN tbl_web_admin AS a ON a.admin_id = t.admin_id
     WHERE t.type_id = ?
     ORDER BY t.topic_id DESC
     LIMIT ?, ?`,
    [typeId, start, perPage],
  );
  return rows;
}

async function findById(topicId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_web_topic WHERE topic_id = ? LIMIT 1',
    [topicId],
  );
  return rows.length ? rows[0] : null;
}

async function toggleActive(topicId, typeId) {
  const topic = await findById(topicId);
  if (!topic || topic.type_id !== typeId) return;
  let active = topic.topic_active === 0 ? 1 : 0;
  if (String(typeId).startsWith('01-02')) {
    if (topic.topic_active === 1) active = 2;
    if (topic.topic_active === 2) active = 0;
  }
  await mysqli.query(
    'UPDATE tbl_web_topic SET topic_active = ? WHERE topic_id = ?',
    [active, topicId],
  );
}

async function remove(topicId, typeId) {
  await mysqli.query(
    'DELETE FROM tbl_web_topic WHERE topic_id = ? AND type_id = ?',
    [topicId, typeId],
  );
}

async function update(topicId, typeId, data) {
  const date = new Date().toISOString().slice(0, 10);
  const [result] = await mysqli.query(
    `UPDATE tbl_web_topic
     SET topic_name = ?, topic_headline = ?, topic_detail = ?, topic_update = ?
     WHERE topic_id = ? AND type_id = ?`,
    [data.topicName, data.topicHeadline, data.topicDetail, date, topicId, typeId],
  );
  return result.affectedRows > 0;
}

module.exports = {
  findType,
  findAdmin,
  countByType,
  findByType,
  findById,
  toggleActive,
  remove,
  update,
};
