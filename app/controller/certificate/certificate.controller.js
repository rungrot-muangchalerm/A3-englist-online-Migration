const certificateData = require('../../model/certificate.model');

module.exports = {
  /**
   * GET /api/certificate/me
   * ส่งข้อมูล certificate ของสมาชิกที่ login อยู่
   */
  me: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) {
        res.status(401).json({ status: 401, message: 'Unauthorized' });
        return;
      }

      const result = await certificateData.getByMemberId(memberId);
      res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },
};
