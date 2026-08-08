const topicData = require('../../model/topic.model');

module.exports = {
  /**
   * GET /api/topic
   * Query: type_id, active, limit, order
   */
  list: async (req, res) => {
    try {
      const { type_id, active = '1', limit = '10', order = 'DESC' } = req.query;

      if (!type_id) {
        res.status(400).json({ status: 400, message: 'ต้องระบุ type_id' });
        return;
      }

      const result = await topicData.list({
        type_id,
        active,
        limit: parseInt(limit, 10),
        order,
      });

      res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * GET /api/topic/recent-updates
   * สำหรับ badge "NEW" ตาม type_id ที่มีการอัปเดตภายใน 7 วัน
   */
  recentUpdates: async (req, res) => {
    try {
      const result = await topicData.recentUpdates();
      res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * GET /api/topic/detail?type_id=...&topic_id=...
   * สำหรับหน้าแสดงรายละเอียด topic
   */
  detail: async (req, res) => {
    try {
      const { type_id, topic_id } = req.query;

      if (!type_id || !topic_id) {
        res.status(400).json({ status: 400, message: 'ต้องระบุ type_id และ topic_id' });
        return;
      }

      const result = await topicData.detail({ type_id, topic_id });

      if (!result) {
        res.status(404).json({ status: 404, message: 'ไม่พบข้อมูล' });
        return;
      }

      res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * GET /api/topic/english-room
   * คืนข้อมูล EOL English Room cards พร้อม topic ล่าสุดและสถานะ is_new
   */
  englishRoom: async (req, res) => {
    try {
      const result = await topicData.englishRoom();
      res.status(200).json({ status: 200, data: { rows: result } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * GET /api/topic/magazine-showcase
   * สำหรับแสดง EOL Magazine Online Showcase ตัวล่าสุด
   */
  magazineShowcase: async (req, res) => {
    try {
      const result = await topicData.magazineShowcase();
      res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },
};
