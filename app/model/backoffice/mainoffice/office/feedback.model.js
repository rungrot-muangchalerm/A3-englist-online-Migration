const mysqli = require('../../../../config/mysqli.config');

const TABLES = {
  1: {
    table: 'tbl_web_school',
    id: 'school_id',
    text: 'school_name',
  },
  2: {
    table: 'tbl_web_feedback',
    id: 'feedback_id',
    text: 'feedback_detail',
  },
};

function config(menu) {
  return TABLES[Number(menu) === 2 ? 2 : 1];
}

async function count(menu) {
  const cfg = config(menu);
  const [rows] = await mysqli.query(`SELECT COUNT(${cfg.id}) AS total FROM ${cfg.table}`);
  return rows.length ? rows[0].total : 0;
}

async function list(menu, start, perPage) {
  const cfg = config(menu);
  const [rows] = await mysqli.query(
    `SELECT ${cfg.id} AS id, ${cfg.text} AS text, is_active
     FROM ${cfg.table}
     ORDER BY ${cfg.id} DESC
     LIMIT ?, ?`,
    [start, perPage],
  );
  return rows;
}

async function add(menu, text) {
  const cfg = config(menu);
  const [maxRows] = await mysqli.query(`SELECT MAX(${cfg.id}) AS max_id FROM ${cfg.table}`);
  const nextId = (maxRows[0] && maxRows[0].max_id ? Number(maxRows[0].max_id) : 0) + 1;
  await mysqli.query(
    `INSERT INTO ${cfg.table} (${cfg.id}, ${cfg.text}) VALUES (?, ?)`,
    [nextId, text],
  );
  return nextId;
}

async function toggle(menu, id) {
  const cfg = config(menu);
  const [rows] = await mysqli.query(
    `SELECT is_active FROM ${cfg.table} WHERE ${cfg.id} = ? LIMIT 1`,
    [id],
  );
  if (!rows.length) return false;
  const nextActive = Number(rows[0].is_active) === 0 ? 1 : 0;
  await mysqli.query(
    `UPDATE ${cfg.table} SET is_active = ? WHERE ${cfg.id} = ?`,
    [nextActive, id],
  );
  return true;
}

async function remove(menu, id) {
  const cfg = config(menu);
  const [result] = await mysqli.query(
    `DELETE FROM ${cfg.table} WHERE ${cfg.id} = ?`,
    [id],
  );
  return result.affectedRows > 0;
}

module.exports = {
  count,
  list,
  add,
  toggle,
  remove,
};
