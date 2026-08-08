const mysqli = require('../../../../config/mysqli.config');

module.exports = {
  findAll: async () => {
    const sql = 'SELECT admin_id, user, prefix, fname, lname, email, is_active, nickname FROM tbl_web_admin';
    const [rows] = await mysqli.query(sql);
    return rows;
  },

  findById: async (id) => {
    const sql = 'SELECT admin_id, user, pass, prefix, fname, lname, email, is_active, nickname FROM tbl_web_admin WHERE admin_id = ? LIMIT 1';
    const [rows] = await mysqli.query(sql, [id]);
    return rows.length ? rows[0] : null;
  },

  findByUsername: async (user) => {
    const sql = 'SELECT admin_id FROM tbl_web_admin WHERE user = ? LIMIT 1';
    const [rows] = await mysqli.query(sql, [user]);
    return rows.length ? rows[0] : null;
  },

  create: async (data) => {
    const sql = `INSERT INTO tbl_web_admin (user, pass, prefix, fname, lname, email, is_active, nickname)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await mysqli.query(sql, [
      data.user, data.pass, data.prefix, data.fname,
      data.lname, data.email, data.is_active, data.nickname,
    ]);
    return result.insertId;
  },

  update: async (id, data) => {
    const sql = `UPDATE tbl_web_admin
                 SET user = ?, pass = ?, prefix = ?, fname = ?, lname = ?, email = ?, is_active = ?, nickname = ?
                 WHERE admin_id = ?`;
    await mysqli.query(sql, [
      data.user, data.pass, data.prefix, data.fname,
      data.lname, data.email, data.is_active, data.nickname, id,
    ]);
  },

  remove: async (id) => {
    await mysqli.query('DELETE FROM tbl_web_admin WHERE admin_id = ?', [id]);
  },

  toggleActive: async (id) => {
    const sql = 'UPDATE tbl_web_admin SET is_active = IF(is_active = 1, 0, 1) WHERE admin_id = ?';
    await mysqli.query(sql, [id]);
  },
};
