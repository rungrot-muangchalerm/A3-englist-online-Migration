const mysqli = require('../../config/mysqli.config');

module.exports = {
  findWebAdmin: async (user, pass) => {
    const sql = 'SELECT admin_id, user, prefix, fname, lname, is_active FROM tbl_web_admin WHERE user = ? AND pass = ? LIMIT 1';
    const [rows] = await mysqli.query(sql, [user, pass]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      adminId: r.admin_id,
      user: r.user,
      prefix: r.prefix,
      fname: r.fname,
      lname: r.lname,
      fullName: `${r.prefix || ''}${r.fname || ''} ${r.lname || ''}`.trim(),
      isActive: r.is_active === 1,
    };
  },

  findAdmin: async (user, pass) => {
    const sql = 'SELECT ADMIN_ID, ADMIN_FNAME, ADMIN_LNAME, ADMIN_USERNAME, IS_ACTIVE FROM tbl_admin WHERE ADMIN_USERNAME = ? AND ADMIN_PASSWORD = ? LIMIT 1';
    const [rows] = await mysqli.query(sql, [user, pass]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      adminId: r.ADMIN_ID,
      user: r.ADMIN_USERNAME,
      prefix: '',
      fname: r.ADMIN_FNAME,
      lname: r.ADMIN_LNAME,
      fullName: `${r.ADMIN_FNAME || ''} ${r.ADMIN_LNAME || ''}`.trim(),
      isActive: r.IS_ACTIVE === 1,
    };
  },
};
