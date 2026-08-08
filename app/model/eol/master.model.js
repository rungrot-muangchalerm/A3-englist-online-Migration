const mysqli = require('../../config/mysqli.config');

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function startOfDayString() {
  return `${new Date().toISOString().slice(0, 10)} 00:00:00`;
}

async function getGroups(masterId) {
  const [rows] = await mysqli.query(
    'SELECT type_id, name FROM tbl_x_member_type WHERE member_id = ? ORDER BY name',
    [masterId],
  );
  return rows;
}

async function getGroupCount(masterId, typeId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS cnt FROM tbl_x_member_sub WHERE master_id = ? AND type_id = ?',
    [masterId, typeId],
  );
  return rows[0].cnt;
}

async function countSubMembers(masterId, typeId) {
  let sql = 'SELECT COUNT(*) AS cnt FROM tbl_x_member_sub AS s JOIN tbl_x_member AS m ON s.sub_id = m.member_id WHERE s.master_id = ?';
  const params = [masterId];
  if (typeId !== null && typeId !== undefined) {
    sql += ' AND s.type_id = ?';
    params.push(typeId);
  }
  const [rows] = await mysqli.query(sql, params);
  return rows[0].cnt;
}

async function getSubMembers(masterId, typeId, page = 1, perPage = 20) {
  const start = (page - 1) * perPage;
  let sql = `SELECT s.sub_id AS member_id, m.user, m.pass, m.fname, m.lname, s.status, s.type_id
             FROM tbl_x_member_sub AS s
             JOIN tbl_x_member AS m ON s.sub_id = m.member_id
             WHERE s.master_id = ?`;
  const params = [masterId];
  if (typeId !== null && typeId !== undefined) {
    sql += ' AND s.type_id = ?';
    params.push(typeId);
  }
  sql += ' ORDER BY m.user LIMIT ?, ?';
  params.push(start, perPage);
  const [rows] = await mysqli.query(sql, params);
  return rows;
}

function formatDateTime(value) {
  if (!value) return '-';
  if (value instanceof Date) return value.toISOString().slice(0, 19).replace('T', ' ');
  return String(value);
}

function toDateObject(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value.replace(' ', 'T'));
  return new Date(value);
}

async function getOperatingTime(memberId) {
  const startOfDay = startOfDayString();
  const [todayRows] = await mysqli.query(
    'SELECT logdate, outdate FROM tbl_x_log_member WHERE member_id = ? AND logdate >= ? ORDER BY logdate DESC',
    [memberId, startOfDay],
  );

  if (todayRows.length > 0) {
    let totalMinutes = 0;
    let lastLogdate = null;
    for (const row of todayRows) {
      const log = toDateObject(row.logdate);
      const out = row.outdate && row.outdate !== '0000-00-00 00:00:00'
        ? toDateObject(row.outdate)
        : new Date();
      const diff = Math.abs((out - log) / 1000 / 60);
      totalMinutes += diff;
      if (!lastLogdate) lastLogdate = formatDateTime(row.logdate);
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    let htxt = '';
    if (hours > 0) htxt = `${hours} ชั่วโมง `;
    return {
      text: `<font color=green title='${lastLogdate}'> ${htxt}${minutes} นาที </font>`,
      lastLogdate,
    };
  }

  const [latestRows] = await mysqli.query(
    'SELECT logdate FROM tbl_x_log_member WHERE member_id = ? ORDER BY logdate DESC LIMIT 1',
    [memberId],
  );
  if (latestRows.length === 1) {
    const lastime = formatDateTime(latestRows[0].logdate);
    return {
      text: `<font color=red title='เข้าใช้ครั้งล่าสุดเมื่อ ${lastime}'> ${lastime} </font>`,
      lastLogdate: lastime,
    };
  }

  return { text: "<font color='red'> - </font>", lastLogdate: null };
}

async function getSubStatus(masterId, subId) {
  const [rows] = await mysqli.query(
    'SELECT status FROM tbl_x_member_sub WHERE master_id = ? AND sub_id = ? LIMIT 1',
    [masterId, subId],
  );
  return rows.length ? rows[0].status : null;
}

async function setSubStatus(masterId, subId, status) {
  await mysqli.query(
    'UPDATE tbl_x_member_sub SET status = ? WHERE master_id = ? AND sub_id = ?',
    [status, masterId, subId],
  );
}

async function deleteSub(masterId, subId) {
  await mysqli.query(
    'DELETE FROM tbl_x_member_sub WHERE master_id = ? AND sub_id = ?',
    [masterId, subId],
  );
}

async function leftGroup(masterId, subId) {
  await mysqli.query(
    'UPDATE tbl_x_member_sub SET type_id = 0 WHERE master_id = ? AND sub_id = ?',
    [masterId, subId],
  );
}

async function bulkSetStatus(masterId, subIds, status) {
  if (!subIds.length) return;
  const placeholders = subIds.map(() => '?').join(',');
  await mysqli.query(
    `UPDATE tbl_x_member_sub SET status = ? WHERE master_id = ? AND sub_id IN (${placeholders})`,
    [status, masterId, ...subIds],
  );
}

async function bulkDelete(masterId, subIds) {
  if (!subIds.length) return;
  const placeholders = subIds.map(() => '?').join(',');
  await mysqli.query(
    `DELETE FROM tbl_x_member_sub WHERE master_id = ? AND sub_id IN (${placeholders})`,
    [masterId, ...subIds],
  );
}

async function bulkMove(masterId, subIds, typeId) {
  if (!subIds.length) return;
  const placeholders = subIds.map(() => '?').join(',');
  await mysqli.query(
    `UPDATE tbl_x_member_sub SET type_id = ? WHERE master_id = ? AND sub_id IN (${placeholders})`,
    [typeId, masterId, ...subIds],
  );
}

async function addGroup(masterId, name) {
  const [result] = await mysqli.query(
    'INSERT INTO tbl_x_member_type (member_id, name) VALUES (?, ?)',
    [masterId, name],
  );
  return result.insertId;
}

async function renameGroup(masterId, typeId, name) {
  await mysqli.query(
    'UPDATE tbl_x_member_type SET name = ? WHERE member_id = ? AND type_id = ?',
    [name, masterId, typeId],
  );
}

async function deleteGroup(masterId, typeId) {
  await mysqli.query(
    'UPDATE tbl_x_member_sub SET type_id = 0 WHERE master_id = ? AND type_id = ?',
    [masterId, typeId],
  );
  await mysqli.query(
    'DELETE FROM tbl_x_member_type WHERE member_id = ? AND type_id = ?',
    [masterId, typeId],
  );
}

async function findMemberByUsername(user) {
  const [rows] = await mysqli.query(
    'SELECT member_id FROM tbl_x_member WHERE user = ? LIMIT 1',
    [user],
  );
  return rows[0] || null;
}

async function findOneYearByUsername(user) {
  const [rows] = await mysqli.query(
    'SELECT id FROM tbl_x_member_1year WHERE user = ? LIMIT 1',
    [user],
  );
  return rows[0] || null;
}

async function getLastMemberId() {
  const [rows] = await mysqli.query(
    'SELECT member_id FROM tbl_x_member ORDER BY member_id DESC LIMIT 1',
  );
  return rows.length ? Number(rows[0].member_id) : 0;
}

async function addSubMember(masterId, subId, status, typeId) {
  await mysqli.query(
    'INSERT INTO tbl_x_member_sub (master_id, sub_id, status, type_id) VALUES (?, ?, ?, ?)',
    [masterId, subId, status, typeId],
  );
}

async function createMember(memberId, user, pass, createDate) {
  await mysqli.query(
    `INSERT INTO tbl_x_member
     (member_id, user, pass, fname, lname, nickname, gender, education_level, education, birthday, address, email, tel, create_date, is_admin)
     VALUES (?, ?, ?, '', '', '', '0', '0', '', '0000-00-00', '', '', '', ?, '0')`,
    [memberId, user, pass, createDate],
  );
}

async function updateSubAccount(memberId, user, pass) {
  await mysqli.query(
    'UPDATE tbl_x_member SET user = ?, pass = ? WHERE member_id = ?',
    [user, pass, memberId],
  );
}

async function getSpacial(masterId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_member_spacial WHERE member_id = ? LIMIT 1',
    [masterId],
  );
  return rows[0] || null;
}

async function countAllSubs(masterId) {
  const [rows] = await mysqli.query(
    'SELECT COUNT(*) AS cnt FROM tbl_x_member_sub WHERE master_id = ?',
    [masterId],
  );
  return rows[0].cnt;
}

module.exports = {
  getGroups,
  getGroupCount,
  countSubMembers,
  getSubMembers,
  getOperatingTime,
  getSubStatus,
  setSubStatus,
  deleteSub,
  leftGroup,
  bulkSetStatus,
  bulkDelete,
  bulkMove,
  addGroup,
  renameGroup,
  deleteGroup,
  findMemberByUsername,
  findOneYearByUsername,
  getLastMemberId,
  addSubMember,
  createMember,
  updateSubAccount,
  getSpacial,
  countAllSubs,
};
