const mysqli = require('../../../config/mysqli.config');

const PER_PAGE = 10;

async function isAdmin(memberId) {
  const [rows] = await mysqli.query('SELECT admin FROM tbl_x_member_1year WHERE id = ? LIMIT 1', [memberId]);
  return rows.length > 0 && rows[0].admin == 1;
}

async function getMemberName(memberId) {
  const [rows] = await mysqli.query('SELECT user, fname FROM tbl_x_member_1year WHERE id = ? LIMIT 1', [memberId]);
  if (rows.length === 0) return '';
  return rows[0].fname || rows[0].user;
}

function toFaq(row, name) {
  return {
    faqId: row.faqId,
    userId: row.userId,
    name: name,
    topic: row.topic,
    date: row.date,
    view: row.view,
  };
}

function toAnswer(row, name) {
  return {
    ansId: row.ansId,
    faqId: row.faqId,
    userId: row.userId,
    name: name,
    detail: row.detail,
    date: row.date,
  };
}

module.exports = {
  /**
   * GET /api/1yc/faq
   * Query: page (default 1)
   */
  list: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const start = (page - 1) * PER_PAGE;
      const admin = await isAdmin(memberId);

      let countSql;
      let countParams;
      let dataSql;
      let dataParams;

      if (admin) {
        countSql = 'SELECT COUNT(*) AS total FROM tbl_x_faq1year';
        countParams = [];
        dataSql = 'SELECT f.faqId, f.userId, f.topic, f.date, f.view FROM tbl_x_faq1year f ORDER BY f.faqId DESC LIMIT ? OFFSET ?';
        dataParams = [PER_PAGE, start];
      } else {
        countSql = 'SELECT COUNT(*) AS total FROM tbl_x_faq1year WHERE userId = ?';
        countParams = [memberId];
        dataSql = 'SELECT f.faqId, f.userId, f.topic, f.date, f.view FROM tbl_x_faq1year f WHERE f.userId = ? ORDER BY f.faqId DESC LIMIT ? OFFSET ?';
        dataParams = [memberId, PER_PAGE, start];
      }

      const [[countRows]] = await mysqli.query(countSql, countParams);
      const total = countRows.total;
      const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
      const [faqRows] = await mysqli.query(dataSql, dataParams);

      const faqs = [];
      for (let i = 0; i < faqRows.length; i++) {
        const r = faqRows[i];
        const name = await getMemberName(r.userId);
        faqs.push(toFaq(r, name));
      }

      return res.status(200).json({
        status: 200,
        data: { faqs, totalPages, currentPage: page, isAdmin: admin },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * GET /api/1yc/faq/:id
   */
  detail: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      const faqId = req.params.id;
      const admin = await isAdmin(memberId);

      // Increment view
      await mysqli.execute('UPDATE tbl_x_faq1year SET view = view + 1 WHERE faqId = ?', [faqId]);

      const [faqRows] = await mysqli.query(
        'SELECT f.faqId, f.userId, f.topic, f.date, f.view FROM tbl_x_faq1year f WHERE f.faqId = ? LIMIT 1',
        [faqId]
      );
      if (faqRows.length === 0) {
        return res.status(404).json({ status: 404, message: 'Not found' });
      }
      const faq = faqRows[0];
      const faqName = await getMemberName(faq.userId);

      const [ansRows] = await mysqli.query(
        'SELECT a.ansId, a.faqId, a.userId, a.detail, a.date FROM tbl_x_faq_ans1year a WHERE a.faqId = ? ORDER BY a.ansId ASC',
        [faqId]
      );
      const answers = [];
      for (let i = 0; i < ansRows.length; i++) {
        const r = ansRows[i];
        const name = await getMemberName(r.userId);
        answers.push(toAnswer(r, name));
      }

      return res.status(200).json({
        status: 200,
        data: {
          faq: toFaq(faq, faqName),
          answers: answers,
          isAdmin: admin,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * POST /api/1yc/faq
   * Body: topic
   */
  create: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      const { topic } = req.body || {};
      const topicTrim = topic ? String(topic).trim() : '';
      if (!topicTrim || topicTrim.length > 500) {
        return res.status(400).json({ status: 400, message: 'Invalid topic' });
      }
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const status = 1;
      const view = 0;
      const [result] = await mysqli.execute(
        'INSERT INTO tbl_x_faq1year (userId, topic, status, date, view) VALUES (?, ?, ?, ?, ?)',
        [memberId, topicTrim, status, now, view]
      );
      const newId = result.insertId;
      const [rows] = await mysqli.query(
        'SELECT f.faqId, f.userId, f.topic, f.date, f.view FROM tbl_x_faq1year f WHERE f.faqId = ? LIMIT 1',
        [newId]
      );
      const name = await getMemberName(memberId);
      return res.status(200).json({
        status: 200,
        data: { faq: toFaq(rows[0], name) },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * POST /api/1yc/faq/:id/answer
   * Body: detail
   */
  answer: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      const faqId = req.params.id;
      const { detail } = req.body || {};
      const detailTrim = detail ? String(detail).trim() : '';
      if (!detailTrim || detailTrim.length > 500) {
        return res.status(400).json({ status: 400, message: 'Invalid detail' });
      }
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const [result] = await mysqli.execute(
        'INSERT INTO tbl_x_faq_ans1year (faqId, userId, detail, date) VALUES (?, ?, ?, ?)',
        [faqId, memberId, detailTrim, now]
      );
      const newId = result.insertId;
      const [rows] = await mysqli.query(
        'SELECT a.ansId, a.faqId, a.userId, a.detail, a.date FROM tbl_x_faq_ans1year a WHERE a.ansId = ? LIMIT 1',
        [newId]
      );
      const name = await getMemberName(memberId);
      return res.status(200).json({
        status: 200,
        data: { answer: toAnswer(rows[0], name) },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * DELETE /api/1yc/faq/:id
   */
  deleteFaq: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      const admin = await isAdmin(memberId);
      if (!admin) {
        return res.status(403).json({ status: 403, message: 'Forbidden' });
      }
      const faqId = req.params.id;
      await mysqli.execute('DELETE FROM tbl_x_faq_ans1year WHERE faqId = ?', [faqId]);
      await mysqli.execute('DELETE FROM tbl_x_faq1year WHERE faqId = ?', [faqId]);
      return res.status(200).json({ status: 200, data: { deleted: true } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * DELETE /api/1yc/faq/:id/answers/:answerId
   */
  deleteAnswer: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      const admin = await isAdmin(memberId);
      if (!admin) {
        return res.status(403).json({ status: 403, message: 'Forbidden' });
      }
      const answerId = req.params.answerId;
      await mysqli.execute('DELETE FROM tbl_x_faq_ans1year WHERE ansId = ?', [answerId]);
      return res.status(200).json({ status: 200, data: { deleted: true } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },
};
