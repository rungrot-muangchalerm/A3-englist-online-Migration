const mysqli = require('../../config/mysqli.config');

function startOfDayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 00:00:00`;
}

function formatDateTime(value) {
  if (!value || value === '0000-00-00 00:00:00') return '';
  let d = value;
  if (!(d instanceof Date)) {
    d = new Date(String(value).replace(' ', 'T'));
  }
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

async function getGroups(masterId) {
  const [rows] = await mysqli.query(
    'SELECT type_id, name FROM tbl_x_member_type WHERE member_id = ? ORDER BY name',
    [masterId]
  );
  return rows;
}

async function getGroupCount(masterId, typeId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(1) AS cnt FROM tbl_x_member_sub WHERE master_id = ? AND type_id = ?',
    [masterId, typeId]
  );
  return rows[0].cnt;
}

async function getSubMembers(masterId, typeId) {
  const [rows] = await mysqli.query(
    `SELECT m.member_id, m.user, m.fname, m.lname
     FROM tbl_x_member_sub s
     JOIN tbl_x_member m ON m.member_id = s.sub_id
     WHERE s.master_id = ? AND s.type_id = ? AND m.fname != ''
     ORDER BY m.fname, m.lname`,
    [masterId, typeId]
  );
  return rows;
}

async function getMemberStatistics(memberId, start, stop) {
  const [rows] = await mysqli.query(
    `SELECT level_id, skill_id, MAX(percent) AS most_percent, COUNT(1) AS amount
     FROM tbl_w_result
     WHERE member_id = ? AND create_date BETWEEN ? AND ?
     GROUP BY level_id, skill_id`,
    [memberId, start, stop]
  );
  return rows;
}

async function getLoginHistory(memberId, start, stop) {
  const [rows] = await mysqli.query(
    `SELECT logdate, outdate FROM tbl_x_log_member
     WHERE member_id = ? AND logdate BETWEEN ? AND ?
     ORDER BY logdate DESC`,
    [memberId, start, stop]
  );
  return rows.map((r) => ({
    logdate: formatDateTime(r.logdate),
    outdate: formatDateTime(r.outdate),
  }));
}

async function getTestsInRange(memberId, start, stop) {
  const [rows] = await mysqli.query(
    `SELECT etest_id, skill_id, level_id, percent
     FROM tbl_w_result
     WHERE member_id = ? AND create_date BETWEEN ? AND ?`,
    [memberId, start, stop]
  );
  return rows;
}

async function getTestsInSession(memberId, start, stop) {
  const [rows] = await mysqli.query(
    `SELECT etest_id, skill_id, level_id
     FROM tbl_w_result
     WHERE member_id = ? AND create_date BETWEEN ? AND ?`,
    [memberId, start, stop]
  );
  return rows;
}

async function getEstTestsInSession(memberId, start, stop) {
  const [rows] = await mysqli.query(
    `SELECT 1 AS found FROM tbl_w_result_est
     WHERE member_id = ? AND create_date BETWEEN ? AND ?
     LIMIT 1`,
    [memberId, start, stop]
  );
  return rows.length > 0;
}

async function getContestName(etestId) {
  const [rows] = await mysqli.query(
    'SELECT exam_name FROM tbl_eventest WHERE exam_id = ? LIMIT 1',
    [etestId]
  );
  return rows.length ? rows[0].exam_name : '';
}

async function getContestsByMaster(masterId) {
  const [rows] = await mysqli.query(
    'SELECT exam_id, exam_name FROM tbl_eventest WHERE create_by = ? ORDER BY create_date DESC',
    [masterId]
  );
  return rows;
}

async function getEvaluationResults(masterId, groupId, skillId, levelId, start, stop, sortBy) {
  const orderBy = String(sortBy) === '2'
    ? 'r.percent DESC, r.create_date ASC'
    : 'r.create_date ASC, r.member_id ASC';
  const stopWithTime = `${stop} 23:59:59`;
  const [rows] = await mysqli.query(
    `SELECT r.result_id, r.member_id, m.fname, m.lname, r.percent, r.create_date
     FROM tbl_w_result r
     JOIN tbl_x_member m ON m.member_id = r.member_id
     WHERE r.member_id IN (
       SELECT s.sub_id FROM tbl_x_member_sub s WHERE s.master_id = ? AND s.type_id = ?
     )
     AND r.skill_id = ? AND r.level_id = ?
     AND r.create_date BETWEEN ? AND ?
     GROUP BY r.member_id, r.create_date
     ORDER BY ${orderBy}`,
    [masterId, groupId, skillId, levelId, start, stopWithTime]
  );
  return rows.map((r) => ({
    result_id: r.result_id,
    member_id: r.member_id,
    fname: r.fname,
    lname: r.lname,
    percent: r.percent,
    create_date: formatDateTime(r.create_date),
  }));
}

async function getResultDetails(resultId) {
  const [rows] = await mysqli.query(
    'SELECT quiz_id, ans_id FROM tbl_w_result_detail WHERE result_id = ?',
    [resultId]
  );
  return rows;
}

async function getCorrectAnswers(quizIds) {
  if (!quizIds.length) return [];
  const placeholders = quizIds.map(() => '?').join(',');
  const [rows] = await mysqli.query(
    `SELECT QUESTIONS_ID AS quiz_id, ANSWERS_ID AS ans_id
     FROM tbl_answers
     WHERE QUESTIONS_ID IN (${placeholders}) AND ANSWERS_CORRECT = 1`,
    quizIds
  );
  return rows;
}

async function recalcContestPercents(masterId, groupId, examId) {
  const [rows] = await mysqli.query(
    `SELECT * FROM (
      SELECT Z.result_id, (SUM(B.answers_correct) / COUNT(A.result_detail_id)) * 100 AS correct_percentage, Z.percent AS wrong_percentage
      FROM tbl_x_member_sub AS Y
      LEFT JOIN tbl_w_result AS Z ON Z.member_id = Y.sub_id
      LEFT JOIN tbl_w_result_detail AS A ON A.result_id = Z.result_id
      LEFT JOIN tbl_answers AS B ON B.questions_id = A.quiz_id AND B.answers_correct = '1' AND B.answers_id = A.ans_id
      WHERE Y.master_id = ? AND Y.type_id = ? AND Z.etest_id = ?
      GROUP BY Z.result_id
    ) AS M
    WHERE M.correct_percentage <> M.wrong_percentage`,
    [masterId, groupId, examId]
  );
  for (const row of rows) {
    await mysqli.query(
      'UPDATE tbl_w_result SET percent = ? WHERE result_id = ?',
      [row.correct_percentage, row.result_id]
    );
  }
}

async function getContestResults(masterId, groupId, examId, start, stop) {
  const stopWithTime = `${stop} 23:59:59`;
  const [rows] = await mysqli.query(
    `SELECT MAX(r.result_id) AS result_id, r.member_id, m.fname, m.lname, MAX(r.percent) AS per, MAX(r.create_date) AS create_date
     FROM tbl_w_result r
     JOIN tbl_x_member m ON m.member_id = r.member_id
     WHERE r.member_id IN (
       SELECT s.sub_id FROM tbl_x_member_sub s WHERE s.master_id = ? AND s.type_id = ?
     )
     AND r.skill_id = 0 AND r.level_id = 0 AND r.etest_id = ?
     AND r.create_date BETWEEN ? AND ?
     GROUP BY r.member_id, m.fname, m.lname
     ORDER BY per DESC, create_date ASC`,
    [masterId, groupId, examId, start, stopWithTime]
  );
  return rows.map((r) => ({
    result_id: r.result_id,
    member_id: r.member_id,
    fname: r.fname,
    lname: r.lname,
    percent: r.per,
    create_date: formatDateTime(r.create_date),
  }));
}

module.exports = {
  getGroups,
  getGroupCount,
  getSubMembers,
  getMemberStatistics,
  getLoginHistory,
  getTestsInRange,
  getTestsInSession,
  getEstTestsInSession,
  getContestName,
  getContestsByMaster,
  getEvaluationResults,
  getResultDetails,
  getCorrectAnswers,
  recalcContestPercents,
  getContestResults,
};
