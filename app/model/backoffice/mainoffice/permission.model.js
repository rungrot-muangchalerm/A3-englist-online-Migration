const mysqli = require('../../../config/mysqli.config');

module.exports = {
  findByAdmin: async (adminId) => {
    const sql = 'SELECT type_id FROM tbl_permission WHERE admin_id = ?';
    const [rows] = await mysqli.query(sql, [adminId]);
    return rows.map(r => r.type_id);
  },

  replaceByAdmin: async (adminId, typeIds, connection) => {
    const conn = connection || mysqli;
    await conn.query('DELETE FROM tbl_permission WHERE admin_id = ?', [adminId]);
    if (typeIds && typeIds.length) {
      const values = typeIds.map(() => '(?, ?)').join(', ');
      const params = typeIds.flatMap(typeId => [adminId, typeId]);
      await conn.query(`INSERT INTO tbl_permission (admin_id, type_id) VALUES ${values}`, params);
    }
  },

  removeByAdmin: async (adminId, connection) => {
    const conn = connection || mysqli;
    await conn.query('DELETE FROM tbl_permission WHERE admin_id = ?', [adminId]);
  },

  findAllTypes: async () => {
    const sql = 'SELECT type_id, type_name FROM tbl_web_type ORDER BY type_id';
    const [rows] = await mysqli.query(sql);
    return rows;
  },
};
