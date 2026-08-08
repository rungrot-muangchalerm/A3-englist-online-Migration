const service = require('../../../../../service/backoffice/mainoffice/office/eol-contest-exam.service');

function ensureOffice(req, res) {
  if (!req.session || !req.session.adminId || req.session.adminType !== 'office') {
    res.status(401).json({ status: 401, data: null });
    return false;
  }
  return true;
}

module.exports = {
  list: async (req, res) => {
    try {
      if (!ensureOffice(req, res)) return;
      const result = await service.buildList(req.session.adminId, req.query.page, req.query.exam_id);
      if (!result.allowed) return res.status(403).json({ status: 403, data: null });
      return res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null, message: error.message });
    }
  },

  detail: async (req, res) => {
    try {
      if (!ensureOffice(req, res)) return;
      const result = await service.getDetail(req.session.adminId, req.params.examId);
      if (!result.allowed) return res.status(403).json({ status: 403, data: null });
      if (!result.exam) return res.status(404).json({ status: 404, data: null });
      return res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      if (!ensureOffice(req, res)) return;
      const result = await service.update(req.session.adminId, req.params.examId, req.body || {});
      return res.status(result.status).json({ status: result.status, data: result.data || null, message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null, message: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      if (!ensureOffice(req, res)) return;
      const result = await service.remove(req.session.adminId, req.params.examId);
      return res.status(result.status).json({ status: result.status, data: { ok: result.ok }, message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null, message: error.message });
    }
  },
};
