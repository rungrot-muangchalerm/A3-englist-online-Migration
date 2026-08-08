const mysqli = require('../../../../config/mysqli.config');

async function findMemberByUsername(username) {
  const [rows] = await mysqli.query(
    `SELECT member_id, user, fname, lname, gender
     FROM tbl_x_member_general
     WHERE user LIKE ?
     ORDER BY member_id ASC
     LIMIT 1`,
    [`%${username}%`],
  );
  return rows.length ? rows[0] : null;
}

async function findMemberById(memberId) {
  const [rows] = await mysqli.query(
    `SELECT member_id, user, fname, lname, gender
     FROM tbl_x_member_general
     WHERE member_id = ?
     LIMIT 1`,
    [memberId],
  );
  return rows.length ? rows[0] : null;
}

async function findMembersByUsernameRange(startUsername, endUsername) {
  const [rows] = await mysqli.query(
    `SELECT DISTINCT member_id, user, fname, lname, gender
     FROM tbl_x_member_general
     WHERE user BETWEEN ? AND ?
     ORDER BY member_id ASC`,
    [startUsername, endUsername],
  );
  return rows;
}

async function findBestResult(memberId) {
  const [rows] = await mysqli.query(
    `SELECT result_id, member_id, etest_id, percent, correct, wrong,
            correct_listening, wrong_listening,
            correct_reading, wrong_reading,
            correct_grammar, wrong_grammar,
            create_date
     FROM tbl_w_result_gepot
     WHERE member_id = ?
     ORDER BY percent DESC
     LIMIT 1`,
    [memberId],
  );
  return rows.length ? rows[0] : null;
}

module.exports = {
  findMemberByUsername,
  findMemberById,
  findMembersByUsernameRange,
  findBestResult,
};
