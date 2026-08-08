const model = require('../../model/backoffice/backoffice.model');
const permissionModel = require('../../model/backoffice/mainoffice/permission.model');

module.exports = {
  login: async (username, password, section, session) => {
    const user = String(username || '').trim();
    const pass = String(password || '').trim();
    if (!user || !pass) {
      return { ok: false, message: 'กรุณาระบุชื่อผู้ใช้และรหัสผ่าน' };
    }

    const admin = section === 'admin'
      ? await model.findAdmin(user, pass)
      : await model.findWebAdmin(user, pass);

    if (!admin) {
      return { ok: false, message: 'Username or Password Incorrect' };
    }

    if (!admin.isActive) {
      return { ok: false, message: 'Username & Password ถูกระงับชั่วคราว' };
    }

    session.adminId = admin.adminId;
    session.adminUser = admin.user;
    session.adminType = section;
    session.adminPrefix = admin.prefix || '';
    session.adminFname = admin.fname || '';
    session.adminLname = admin.lname || '';
    session.adminFullName = admin.fullName || admin.user;

    return { ok: true, admin };
  },

  getAccount: (session) => {
    if (!session.adminId) {
      return { loggedIn: false };
    }
    return {
      loggedIn: true,
      adminId: session.adminId,
      adminUser: session.adminUser,
      adminType: session.adminType,
      adminPrefix: session.adminPrefix || '',
      adminFname: session.adminFname || '',
      adminLname: session.adminLname || '',
      adminFullName: session.adminFullName || session.adminUser,
    };
  },

  logout: (session) => {
    session.destroy();
  },

  getPermissions: async (session) => {
    if (!session.adminId) {
      return { status: 401, permissions: [] };
    }
    const permissions = await permissionModel.findByAdmin(session.adminId);
    return { status: 200, permissions };
  },
};
