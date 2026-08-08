const service = require('../../../../../service/backoffice/mainoffice/office/topic.service');

module.exports = {
  list: async (req, res) => {
    try {
      if (!req.session || !req.session.adminId || req.session.adminType !== 'office') {
        return res.status(401).json({ status: 401, data: null });
      }
      const result = await service.buildList(req.session.adminId, String(req.params.typeId || '').trim(), req.query.page);
      if (!result.allowed) {
        return res.status(403).json({ status: 403, data: null });
      }
      return res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  detail: async (req, res) => {
    try {
      if (!req.session || !req.session.adminId || req.session.adminType !== 'office') {
        return res.status(401).json({ status: 401, data: null });
      }
      const result = await service.getDetail(req.session.adminId, String(req.params.typeId || '').trim(), parseInt(req.params.topicId, 10) || 0);
      if (!result.allowed) {
        return res.status(403).json({ status: 403, data: null });
      }
      return res.status(200).json({ status: 200, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  toggleActive: async (req, res) => {
    try {
      if (!req.session || !req.session.adminId || req.session.adminType !== 'office') {
        return res.status(401).json({ status: 401, data: null });
      }
      const ok = await service.toggleActive(req.session.adminId, String(req.params.typeId || '').trim(), parseInt(req.params.topicId, 10) || 0);
      return res.status(ok ? 200 : 403).json({ status: ok ? 200 : 403, data: { ok } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  remove: async (req, res) => {
    try {
      if (!req.session || !req.session.adminId || req.session.adminType !== 'office') {
        return res.status(401).json({ status: 401, data: null });
      }
      const ok = await service.remove(req.session.adminId, String(req.params.typeId || '').trim(), parseInt(req.params.topicId, 10) || 0);
      return res.status(ok ? 200 : 403).json({ status: ok ? 200 : 403, data: { ok } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  update: async (req, res) => {
    try {
      if (!req.session || !req.session.adminId || req.session.adminType !== 'office') {
        return res.status(401).json({ status: 401, data: null });
      }
      const result = await service.update(
        req.session.adminId,
        String(req.params.typeId || '').trim(),
        parseInt(req.params.topicId, 10) || 0,
        req.body || {},
      );
      return res.status(result.status).json({ status: result.status, data: { ok: result.ok }, message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },
};
