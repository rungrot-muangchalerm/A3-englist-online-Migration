const otherData = require('../../model/other.model');

module.exports = {
  /**
   * GET /api/other/school
   */
  school: async (req, res) => {
    try {
      const result = await otherData.schoolList();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * GET /api/other/feedback
   */
  feedback: async (req, res) => {
    try {
      const result = await otherData.feedbackList();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * GET /api/other/advertise
   */
  advertise: async (req, res) => {
    try {
      res.status(200).json({
        status: '200',
        type: 'advertise',
        title: 'ติดต่อลงโฆษณากับเรา',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
  },
};
