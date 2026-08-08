const mysqli = require('../../../../config/mysqli.config');

function formatDate(value) {
  if (!value) return '-';
  if (value instanceof Date) return value.toISOString().slice(0, 19).replace('T', ' ');
  return String(value);
}

async function countExams() {
  const [rows] = await mysqli.query('SELECT COUNT(*) AS total FROM tbl_eventest');
  return rows.length ? rows[0].total : 0;
}

async function findExams(offset, limit) {
  const [rows] = await mysqli.query(
    `SELECT et.exam_id, et.exam_name, et.testtime, et.test_type, et.exam_type,
            et.create_by, et.create_date, et.active, et.public,
            tm.user, tm.fname,
            COALESCE(eq.amount, 0) AS system_amount,
            COALESCE(ec.amount, 0) AS custom_amount
     FROM tbl_eventest AS et
     LEFT JOIN tbl_x_member AS tm ON et.create_by = tm.member_id
     LEFT JOIN (
       SELECT exam_id, COUNT(question_id) AS amount
       FROM tbl_eventest_question
       GROUP BY exam_id
     ) AS eq ON eq.exam_id = et.exam_id
     LEFT JOIN (
       SELECT exam_id, COUNT(question_id) AS amount
       FROM tbl_eventest_question_custom
       GROUP BY exam_id
     ) AS ec ON ec.exam_id = et.exam_id
     ORDER BY et.create_date DESC, et.exam_id DESC
     LIMIT ?, ?`,
    [offset, limit],
  );
  return rows.map(row => ({
    ...row,
    create_date: formatDate(row.create_date),
    amount: row.exam_type == 2 ? row.custom_amount : row.system_amount,
  }));
}

async function findExam(examId) {
  const [rows] = await mysqli.query(
    `SELECT et.exam_id, et.exam_name, et.testtime, et.test_type, et.exam_type,
            et.create_by, et.create_date, et.active, et.public,
            tm.user, tm.fname,
            COALESCE(eq.amount, 0) AS system_amount,
            COALESCE(ec.amount, 0) AS custom_amount
     FROM tbl_eventest AS et
     LEFT JOIN tbl_x_member AS tm ON et.create_by = tm.member_id
     LEFT JOIN (
       SELECT exam_id, COUNT(question_id) AS amount
       FROM tbl_eventest_question
       GROUP BY exam_id
     ) AS eq ON eq.exam_id = et.exam_id
     LEFT JOIN (
       SELECT exam_id, COUNT(question_id) AS amount
       FROM tbl_eventest_question_custom
       GROUP BY exam_id
     ) AS ec ON ec.exam_id = et.exam_id
     WHERE et.exam_id = ?
     LIMIT 1`,
    [examId],
  );
  if (!rows.length) return null;
  const row = rows[0];
  return {
    ...row,
    create_date: formatDate(row.create_date),
    amount: row.exam_type == 2 ? row.custom_amount : row.system_amount,
  };
}

async function findAllowGroups(examId, memberId) {
  const [rows] = await mysqli.query(
    `SELECT mt.type_id, mt.name, ag.allow_id
     FROM tbl_x_member_type AS mt
     LEFT JOIN tbl_eventest_allowgroup AS ag
       ON ag.group_type = mt.type_id AND ag.exam_id = ?
     WHERE mt.member_id = ?
     ORDER BY mt.name`,
    [examId, memberId],
  );
  return rows;
}

async function hasNoneGroup(examId) {
  const [rows] = await mysqli.query(
    'SELECT allow_id FROM tbl_eventest_allowgroup WHERE exam_id = ? AND group_type = ? LIMIT 1',
    [examId, 0],
  );
  return rows.length > 0;
}

async function updateExam(examId, data) {
  const [result] = await mysqli.query(
    `UPDATE tbl_eventest
     SET exam_name = ?, testtime = ?, test_type = ?, active = ?
     WHERE exam_id = ?`,
    [data.examName, data.testtime, data.testType, data.active, examId],
  );
  return result.affectedRows > 0;
}

async function replaceAllowGroups(examId, groups) {
  const connection = await mysqli.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM tbl_eventest_allowgroup WHERE exam_id = ?', [examId]);
    for (const group of groups) {
      await connection.query(
        'INSERT INTO tbl_eventest_allowgroup (exam_id, group_type) VALUES (?, ?)',
        [examId, group],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteExam(examId) {
  const connection = await mysqli.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      'DELETE FROM tbl_eventest_answer WHERE question_id IN (SELECT question_id FROM tbl_eventest_question_custom WHERE exam_id = ?)',
      [examId],
    );
    await connection.query('DELETE FROM tbl_eventest_question_custom WHERE exam_id = ?', [examId]);
    await connection.query('DELETE FROM tbl_eventest_question WHERE exam_id = ?', [examId]);
    await connection.query('DELETE FROM tbl_eventest_allowgroup WHERE exam_id = ?', [examId]);
    await connection.query('DELETE FROM tbl_eventest WHERE exam_id = ?', [examId]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  countExams,
  findExams,
  findExam,
  findAllowGroups,
  hasNoneGroup,
  updateExam,
  replaceAllowGroups,
  deleteExam,
};
