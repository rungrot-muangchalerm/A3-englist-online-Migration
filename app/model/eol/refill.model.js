const mysqli = require('../../config/mysqli.config');

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

async function findCard(code, pin) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_card WHERE code = ? AND pin = ? AND active = 0 LIMIT 1',
    [code, pin],
  );
  return rows[0] || null;
}

async function getCardType(typeId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_card_type WHERE type_id = ? LIMIT 1',
    [typeId],
  );
  return rows[0] || null;
}

async function activateCard(cardId) {
  await mysqli.query(
    'UPDATE tbl_x_card SET active = 1 WHERE card_id = ?',
    [cardId],
  );
}

async function getNextRefillId() {
  const [rows] = await mysqli.query(
    'SELECT refill_id FROM tbl_x_member_time ORDER BY refill_id DESC LIMIT 1',
  );
  return rows.length ? Number(rows[0].refill_id) + 1 : 1;
}

async function getLatestTimeWindow(memberId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_member_time WHERE member_id = ? AND stop >= ? ORDER BY stop DESC LIMIT 1',
    [memberId, nowString()],
  );
  return rows[0] || null;
}

async function insertTimeWindow({ refillId, memberId, cardId, start, stop, createDate }) {
  await mysqli.query(
    'INSERT INTO tbl_x_member_time (refill_id, member_id, card_id, start, stop, create_date) VALUES (?, ?, ?, ?, ?, ?)',
    [refillId, memberId, cardId, start, stop, createDate],
  );
}

async function addMasterAmount(memberId, days) {
  await mysqli.query(
    'UPDATE tbl_x_member_amount SET amount = amount + ? WHERE member_id = ?',
    [days, memberId],
  );
}

async function getPersonalTotal(memberId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_member_total WHERE member_id = ? LIMIT 1',
    [memberId],
  );
  return rows[0] || null;
}

async function createPersonalTotal(memberId, amount) {
  await mysqli.query(
    'INSERT INTO tbl_x_member_total (member_id, amount) VALUES (?, ?)',
    [memberId, amount],
  );
}

async function addPersonalTotal(memberId, days) {
  await mysqli.query(
    'UPDATE tbl_x_member_total SET amount = amount + ? WHERE member_id = ?',
    [days, memberId],
  );
}

async function insertPersonalRefill(memberId, cardId, createDate) {
  await mysqli.query(
    'INSERT INTO tbl_x_member_refill (member_id, card_id, create_date) VALUES (?, ?, ?)',
    [memberId, cardId, createDate],
  );
}

async function getPersonalRefillHistory(memberId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_member_refill WHERE member_id = ? ORDER BY create_date DESC',
    [memberId],
  );
  return rows;
}

async function getTimeHistory(memberId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_member_time WHERE member_id = ? ORDER BY create_date DESC',
    [memberId],
  );
  return rows;
}

async function getCardById(cardId) {
  const [rows] = await mysqli.query(
    'SELECT * FROM tbl_x_card WHERE card_id = ? LIMIT 1',
    [cardId],
  );
  return rows[0] || null;
}

module.exports = {
  findCard,
  getCardType,
  activateCard,
  getNextRefillId,
  getLatestTimeWindow,
  insertTimeWindow,
  addMasterAmount,
  getPersonalTotal,
  createPersonalTotal,
  addPersonalTotal,
  insertPersonalRefill,
  getPersonalRefillHistory,
  getTimeHistory,
  getCardById,
  nowString,
};
