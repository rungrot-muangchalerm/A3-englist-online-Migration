const masterData = require('../../model/eol/master.model');

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

async function buildDashboard(masterId, query) {
  const page = parseInt(query.page, 10) || 1;
  const perPage = 20;
  const selectedGroupId = query.group_id !== undefined ? Number(query.group_id) : 0;

  const rawGroups = await masterData.getGroups(masterId);
  const groups = [];
  groups.push({ type_id: 0, name: 'None Group', count: await masterData.getGroupCount(masterId, 0) });
  for (const g of rawGroups) {
    groups.push({
      type_id: g.type_id,
      name: g.name,
      count: await masterData.getGroupCount(masterId, g.type_id),
    });
  }

  const total = await masterData.countSubMembers(masterId, selectedGroupId || null);
  const totalPages = Math.ceil(total / perPage) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));

  const rawMembers = await masterData.getSubMembers(masterId, selectedGroupId || null, safePage, perPage);
  const subMembers = [];
  for (const m of rawMembers) {
    const op = await masterData.getOperatingTime(m.member_id);
    subMembers.push({
      member_id: m.member_id,
      user: m.user,
      pass: m.pass,
      fname: m.fname,
      lname: m.lname,
      status: m.status,
      operatingText: op.text,
    });
  }

  // add member allowed?
  const sp = await masterData.getSpacial(masterId);
  let allowAdd = true;
  if (sp) {
    const allSub = await masterData.countAllSubs(masterId);
    if (allSub >= sp.amount) allowAdd = false;
  }

  return {
    page: 'business',
    selectedGroupId,
    groups,
    subMembers,
    total,
    totalPages,
    pageNum: safePage,
    perPage,
    allowAdd,
  };
}

async function toggleStatus(masterId, subId) {
  const status = await masterData.getSubStatus(masterId, subId);
  if (status === null) throw new Error('Sub account not found');
  await masterData.setSubStatus(masterId, subId, status == 1 ? 0 : 1);
}

async function leftGroup(masterId, subId) {
  await masterData.leftGroup(masterId, subId);
}

async function removeSub(masterId, subId) {
  await masterData.deleteSub(masterId, subId);
}

async function bulkLimit(masterId, subIds) {
  await masterData.bulkSetStatus(masterId, subIds, 0);
}

async function bulkUnlimit(masterId, subIds) {
  await masterData.bulkSetStatus(masterId, subIds, 1);
}

async function bulkDelete(masterId, subIds) {
  await masterData.bulkDelete(masterId, subIds);
}

async function bulkMove(masterId, subIds, typeId) {
  // verify typeId belongs to master if not 0
  if (Number(typeId) !== 0) {
    const groups = await masterData.getGroups(masterId);
    const found = groups.some((g) => String(g.type_id) === String(typeId));
    if (!found) throw new Error('Invalid group');
  }
  await masterData.bulkMove(masterId, subIds, typeId);
}

async function createGroup(masterId, name) {
  if (!name || !String(name).trim()) throw new Error('Group name required');
  return masterData.addGroup(masterId, String(name).trim());
}

async function updateGroupName(masterId, typeId, name) {
  if (!name || !String(name).trim()) throw new Error('Group name required');
  if (Number(typeId) === 0) throw new Error('Cannot rename None Group');
  await masterData.renameGroup(masterId, typeId, String(name).trim());
}

async function removeGroup(masterId, typeId) {
  if (Number(typeId) === 0) throw new Error('Cannot delete None Group');
  await masterData.deleteGroup(masterId, typeId);
}

function validateUserPass(user, pass, repass) {
  const u = String(user).trim();
  const p = String(pass);
  const r = String(repass);
  if (u.length < 8 || u.length > 20 || p.length < 8 || p.length > 20) {
    return 'Please Insert Username, Password and Re-Password as 8-20 characters long';
  }
  if (p !== r) {
    return 'Re-Password is not same as your password';
  }
  return null;
}

async function addMember(masterId, groupId, user, pass, repass) {
  const error = validateUserPass(user, pass, repass);
  if (error) throw new Error(error);

  const u = String(user).trim();
  const p = String(pass);

  const existing = await masterData.findMemberByUsername(u);
  if (existing) throw new Error('This Username is already created.');
  const oneYear = await masterData.findOneYearByUsername(u);
  if (oneYear) throw new Error('This Username is already created.');

  const lastId = await masterData.getLastMemberId();
  const newId = lastId + 1;
  const now = nowString();

  await masterData.addSubMember(masterId, newId, 0, Number(groupId) || 0);
  await masterData.createMember(newId, u, p, now);
  return newId;
}

async function editSubAccount(memberId, user, pass, repass) {
  const error = validateUserPass(user, pass, repass);
  if (error) throw new Error(error);

  const u = String(user).trim();
  const p = String(pass);

  const existing = await masterData.findMemberByUsername(u);
  if (existing && String(existing.member_id) !== String(memberId)) {
    throw new Error('This username is already created.');
  }
  const oneYear = await masterData.findOneYearByUsername(u);
  if (oneYear) throw new Error('This username is already created.');

  await masterData.updateSubAccount(memberId, u, p);
}

module.exports = {
  buildDashboard,
  toggleStatus,
  leftGroup,
  removeSub,
  bulkLimit,
  bulkUnlimit,
  bulkDelete,
  bulkMove,
  createGroup,
  updateGroupName,
  removeGroup,
  addMember,
  editSubAccount,
};
