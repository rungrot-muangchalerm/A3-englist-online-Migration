const productData = require('../../model/product.model');

module.exports = {
  /**
   * GET /api/product?category=EOL PERSONAL PACKAGE
   * หรือ /api/product?category=personal (alias)
   */
  list: async (req, res) => {
    try {
      let { category } = req.query;

      if (!category) {
        res.status(400).json({ message: 'ต้องระบุ category' });
        return;
      }

      // รองรับ alias สั้น เช่น personal, 1year, corporate
      if (productData.CATEGORY_MAP[category]) {
        category = productData.CATEGORY_MAP[category];
      }

      const result = await productData.listByCategory({ category });
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
  },
};
