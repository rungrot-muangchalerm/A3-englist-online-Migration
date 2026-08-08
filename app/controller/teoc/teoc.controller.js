const teocData = require('../../model/teoc.model');

module.exports = {
  /**
   * GET /api/teoc/rounds?search=<term>&round=<index>
   */
  list: async (req, res) => {
    try {
      const { search = '', round = -1 } = req.query;
      const result = await teocData.getRounds(search, round);

      res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },
};
