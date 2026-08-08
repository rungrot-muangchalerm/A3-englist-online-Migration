const service = require('../../../../../service/backoffice/mainoffice/office/user.service');

function parseFormData(body) {
  return {
    user: String(body.user || '').trim(),
    pass: String(body.pass || '').trim(),
    prefix: String(body.prefix || '').trim(),
    fname: String(body.fname || '').trim(),
    lname: String(body.lname || '').trim(),
    email: String(body.email || '').trim(),
    nickname: String(body.nickname || '').trim(),
    is_active: body.is_active === '1' || body.is_active === 1 ? 1 : 0,
  };
}

function parsePermissions(body) {
  return Object.keys(body || {}).filter(key => /^\d{2}-\d{2}$/.test(key) && body[key] === '1');
}

function getAdminId(req) {
  return req.user && req.user.backofficeId ? req.user.backofficeId : 0;
}

module.exports = {
  list: async (req, res) => {
    try {
      const result = await service.listUsers(getAdminId(req));
      return res.status(result.allowed ? 200 : 403).json({ status: result.allowed ? 200 : 403, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  createForm: async (req, res) => {
    try {
      const result = await service.getCreateFormData();
      return res.status(200).json({ status: 200, data: { user: null, ...result } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  editForm: async (req, res) => {
    try {
      const result = await service.getUserFormData(parseInt(req.params.id, 10) || 0);
      return res.status(result.user ? 200 : 404).json({ status: result.user ? 200 : 404, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  create: async (req, res) => {
    try {
      const adminId = await service.createUser(parseFormData(req.body), parsePermissions(req.body));
      return res.status(201).json({ status: 201, data: { adminId } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  update: async (req, res) => {
    try {
      await service.updateUser(parseInt(req.params.id, 10) || 0, parseFormData(req.body), parsePermissions(req.body));
      return res.status(200).json({ status: 200, data: { ok: true } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  remove: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10) || 0;
      if (id === 1 || id === getAdminId(req)) {
        return res.status(403).json({ status: 403, data: { ok: false } });
      }
      await service.deleteUser(id);
      return res.status(200).json({ status: 200, data: { ok: true } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },

  toggleActive: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10) || 0;
      if (id === 1) {
        return res.status(403).json({ status: 403, data: { ok: false } });
      }
      await service.toggleActive(id);
      return res.status(200).json({ status: 200, data: { ok: true } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: null });
    }
  },
};
