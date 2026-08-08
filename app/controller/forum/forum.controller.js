const forumData = require('../../model/forum.model');

module.exports = {
  /**
   * GET /api/forum?type_id=03-01&page=1
   */
  list: async (req, res) => {
    try {
      const { type_id, page = '1', limit = '7' } = req.query;

      if (!type_id) {
        res.status(400).json({ message: 'ต้องระบุ type_id' });
        return;
      }

      const result = await forumData.list({
        type_id,
        page,
        rowsPerPage: limit,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
  },
};
