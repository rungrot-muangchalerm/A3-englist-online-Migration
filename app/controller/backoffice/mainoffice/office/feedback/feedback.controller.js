const service = require('../../../../../service/backoffice/mainoffice/office/feedback.service');

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
      const result = await service.buildList(req.session.adminId, req.query.menu, req.query.page);
      if (!result.allowed) {
        return res.status(403).json({ status: 403, data: null });
      }
      return res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  add: async (req, res) => {
    try {
      if (!ensureOffice(req, res)) return;
      const result = await service.add(req.session.adminId, req.query.menu, req.body || {});
      return res.status(result.status).json({ status: result.status, data: result.data || null, message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  toggle: async (req, res) => {
    try {
      if (!ensureOffice(req, res)) return;
      const result = await service.toggle(req.session.adminId, req.params.menu, parseInt(req.params.id, 10) || 0);
      return res.status(result.status).json({ status: result.status, data: { ok: result.ok } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  remove: async (req, res) => {
    try {
      if (!ensureOffice(req, res)) return;
      const result = await service.remove(req.session.adminId, req.params.menu, parseInt(req.params.id, 10) || 0);
      return res.status(result.status).json({ status: result.status, data: { ok: result.ok } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },
};
