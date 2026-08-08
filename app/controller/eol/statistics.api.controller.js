const statisticsService = require('../../service/eol/statistics.service');

module.exports = {
  evaluation: async (req, res) => {
    try {
      const masterId = req.user && req.user.memberId;
      if (!masterId) {
        res.status(401).json({ status: 401, message: 'Unauthorized' });
        return;
      }
      const data = await statisticsService.buildEvaluation(masterId, req.query);
      res.status(200).json({ status: 200, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },
  contest: async (req, res) => {
    try {
      const masterId = req.user && req.user.memberId;
      if (!masterId) {
        res.status(401).json({ status: 401, message: 'Unauthorized' });
        return;
      }
      const data = await statisticsService.buildContest(masterId, req.query);
      res.status(200).json({ status: 200, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },
  overview: async (req, res) => {
    try {
      const masterId = req.user && req.user.memberId;
      if (!masterId) {
        res.status(401).json({ status: 401, message: 'Unauthorized' });
        return;
      }
      const data = await statisticsService.buildOverview(masterId, req.query);
      res.status(200).json({ status: 200, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
    }
  },
};
