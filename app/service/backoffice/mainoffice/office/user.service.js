const model = require('../../../../model/backoffice/mainoffice/office/user.model');
const permissionModel = require('../../../../model/backoffice/mainoffice/permission.model');
const mysqli = require('../../../../config/mysqli.config');

function groupTypesByPrefix(types) {
  const groups = {};
  types.forEach(t => {
    const prefix = t.type_id.split('-')[0];
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(t);
  });
  return groups;
}

module.exports = {
  listUsers: async (adminId) => {
    const permissions = await permissionModel.findByAdmin(adminId);
    if (!permissions.includes('00-01')) {
      return { allowed: false, users: [], currentAdmin: null };
    }
    const [users, currentAdmin] = await Promise.all([
      model.findAll(),
      model.findById(adminId),
    ]);
    return { allowed: true, users, currentAdmin };
  },

  getUserFormData: async (id) => {
    const [user, types, permissions] = await Promise.all([
      model.findById(id),
      permissionModel.findAllTypes(),
      permissionModel.findByAdmin(id),
    ]);
    return { user, types: groupTypesByPrefix(types), permissions };
  },

  getCreateFormData: async () => {
    const types = await permissionModel.findAllTypes();
    return { types: groupTypesByPrefix(types), permissions: [] };
  },

  createUser: async (data, permissionTypeIds) => {
    const connection = await mysqli.getConnection();
    try {
      await connection.beginTransaction();
      const adminId = await model.create(data);
      await permissionModel.replaceByAdmin(adminId, permissionTypeIds, connection);
      await connection.commit();
      return adminId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  updateUser: async (id, data, permissionTypeIds) => {
    const connection = await mysqli.getConnection();
    try {
      await connection.beginTransaction();
      await model.update(id, data);
      await permissionModel.replaceByAdmin(id, permissionTypeIds, connection);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  deleteUser: async (id) => {
    const connection = await mysqli.getConnection();
    try {
      await connection.beginTransaction();
      await permissionModel.removeByAdmin(id, connection);
      await model.remove(id);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  toggleActive: async (id) => {
    await model.toggleActive(id);
  },
};
