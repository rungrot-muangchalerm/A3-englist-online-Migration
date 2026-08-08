const masterService = require('../../service/eol/master.service');

function collectMemberIds(body) {
  const ids = [];
  if (!body) return ids;
  if (Array.isArray(body.member_id)) {
    ids.push(...body.member_id);
  } else if (typeof body.member_id === 'object') {
    Object.values(body.member_id).forEach((v) => { if (v) ids.push(v); });
  } else if (body.member_id) {
    ids.push(body.member_id);
  }
  return ids.filter((v, i, a) => a.indexOf(v) === i);
}

async function getDashboard(req, res) {
  try {
    const data = await masterService.buildDashboard(req.user.memberId, req.query);
    res.json({ status: 200, data });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function createGroup(req, res) {
  try {
    await masterService.createGroup(req.user.memberId, req.body.group_name);
    res.json({ status: 200, data: { message: 'Group created' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function renameGroup(req, res) {
  try {
    await masterService.updateGroupName(req.user.memberId, req.body.idrename, req.body.rename);
    res.json({ status: 200, data: { message: 'Group renamed' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function deleteGroup(req, res) {
  try {
    await masterService.removeGroup(req.user.memberId, req.body.group_id);
    res.json({ status: 200, data: { message: 'Group deleted' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function addMember(req, res) {
  try {
    await masterService.addMember(
      req.user.memberId,
      req.body.user_newgroup,
      req.body.add_user,
      req.body.add_pass,
      req.body.add_re
    );
    res.json({ status: 200, data: { message: 'Member added' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function editMember(req, res) {
  try {
    await masterService.editSubAccount(req.body.member, req.body.rename, req.body.newpass, req.body.repass);
    res.json({ status: 200, data: { message: 'Member updated' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function setStatus(req, res) {
  try {
    await masterService.toggleStatus(req.user.memberId, req.body.member_id);
    res.json({ status: 200, data: { message: 'Status changed' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function leftGroup(req, res) {
  try {
    await masterService.leftGroup(req.user.memberId, req.body.member_id);
    res.json({ status: 200, data: { message: 'Member removed from group' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function deleteSub(req, res) {
  try {
    await masterService.removeSub(req.user.memberId, req.body.member_id);
    res.json({ status: 200, data: { message: 'Member deleted' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function bulkLimit(req, res) {
  try {
    await masterService.bulkLimit(req.user.memberId, collectMemberIds(req.body));
    res.json({ status: 200, data: { message: 'Members limited' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function bulkUnlimit(req, res) {
  try {
    await masterService.bulkUnlimit(req.user.memberId, collectMemberIds(req.body));
    res.json({ status: 200, data: { message: 'Members unlimited' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function bulkDelete(req, res) {
  try {
    await masterService.bulkDelete(req.user.memberId, collectMemberIds(req.body));
    res.json({ status: 200, data: { message: 'Members deleted' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

async function bulkMove(req, res) {
  try {
    await masterService.bulkMove(req.user.memberId, collectMemberIds(req.body), req.body.type_id);
    res.json({ status: 200, data: { message: 'Members moved' } });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
}

module.exports = {
  getDashboard,
  createGroup,
  renameGroup,
  deleteGroup,
  addMember,
  editMember,
  setStatus,
  leftGroup,
  deleteSub,
  bulkLimit,
  bulkUnlimit,
  bulkDelete,
  bulkMove,
};
