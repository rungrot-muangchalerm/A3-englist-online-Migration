const mysqli = require('../config/mysqli.config');

const CATEGORY_MAP = {
  personal: 'EOL PERSONAL PACKAGE',
  '1year': 'EOL 1 YEAR PACKAGE',
  corporate: 'EOL CORPORATE PACKAGE',
};

module.exports = {
  CATEGORY_MAP,

  /**
   * ดึงรายการสินค้าตามหมวดหมู่จาก tbl_order_product_new
   */
  listByCategory: async ({ category, isActive = 1 }) => {
    const sql = `
      SELECT
        product_id,
        category,
        product_name,
        product_amount,
        product_cost,
        product_detail,
        product_extra,
        product_image,
        is_active
      FROM tbl_order_product_new
      WHERE category = ? AND is_active = ?
      ORDER BY product_id ASC
    `;
    const [rows] = await mysqli.query(sql, [category, isActive]);
    return rows;
  },
};
