const mysqli = require('../../config/mysqli.config');

async function getMemberById(memberId) {
  const [rows] = await mysqli.query(
    'SELECT member_id, user, pass, fname, lname, gender, education_level, education, birthday, address, email, tel FROM tbl_x_member WHERE member_id = ? LIMIT 1',
    [memberId],
  );
  return rows[0] || null;
}

async function updateProfile(memberId, fields) {
  const {
    fname, lname, gender, birthday, education, educationLevel, address, email, tel,
  } = fields;
  await mysqli.query(
    `UPDATE tbl_x_member
     SET fname = ?, lname = ?, gender = ?, birthday = ?,
         education = ?, education_level = ?, address = ?, email = ?, tel = ?
     WHERE member_id = ?`,
    [fname, lname, gender, birthday, education, educationLevel, address, email, tel, memberId],
  );
}

async function checkPassword(memberId, password) {
  const [rows] = await mysqli.query(
    'SELECT member_id FROM tbl_x_member WHERE member_id = ? AND pass = ? LIMIT 1',
    [memberId, password],
  );
  return rows.length === 1;
}

async function updatePassword(memberId, password) {
  await mysqli.query(
    'UPDATE tbl_x_member SET pass = ? WHERE member_id = ?',
    [password, memberId],
  );
}

module.exports = {
  getMemberById,
  updateProfile,
  checkPassword,
  updatePassword,
};
