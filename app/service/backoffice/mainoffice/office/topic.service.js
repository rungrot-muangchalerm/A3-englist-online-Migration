const topicModel = require('../../../../model/backoffice/mainoffice/office/topic.model');
const permissionModel = require('../../../../model/backoffice/mainoffice/permission.model');

const PER_PAGE = 10;

function buildStatus(topicActive) {
  if (topicActive === 1) return { color: '77FF77', label: 'Show' };
  if (topicActive === 2) return { color: 'aaffff', label: 'Sticky' };
  return { color: 'yellow', label: 'Hidden' };
}

async function resolveAccess(adminId, typeId) {
  const permissions = await permissionModel.findByAdmin(adminId);
  return {
    allowed: permissions.includes(typeId),
    isAdmin: permissions.includes('00-02'),
  };
}

async function buildList(adminId, typeId, page) {
  const access = await resolveAccess(adminId, typeId);
  if (!access.allowed) {
    return { allowed: false };
  }

  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const [type, total, currentAdmin] = await Promise.all([
    topicModel.findType(typeId),
    topicModel.countByType(typeId),
    topicModel.findAdmin(adminId),
  ]);
  const allPages = Math.max(Math.ceil(total / PER_PAGE), 1);
  const currentPage = Math.min(safePage, allPages);
  const topics = await topicModel.findByType(typeId, (currentPage - 1) * PER_PAGE, PER_PAGE);

  return {
    allowed: true,
    typeId,
    typeName: type ? type.type_name : " - Didn't Find Data List - ",
    topics: topics.map(topic => ({
      ...topic,
      adminName: topic.topic_by === 1 ? (topic.admin_nickname || '-') : '-',
      activeState: buildStatus(topic.topic_active),
    })),
    page: currentPage,
    allPages,
    isAdmin: access.isAdmin,
    currentAdmin,
  };
}

async function toggleActive(adminId, typeId, topicId) {
  const access = await resolveAccess(adminId, typeId);
  if (!access.allowed) return false;
  await topicModel.toggleActive(topicId, typeId);
  return true;
}

async function remove(adminId, typeId, topicId) {
  const access = await resolveAccess(adminId, typeId);
  if (!access.allowed || !access.isAdmin) return false;
  await topicModel.remove(topicId, typeId);
  return true;
}

async function update(adminId, typeId, topicId, body) {
  const access = await resolveAccess(adminId, typeId);
  if (!access.allowed) {
    return { ok: false, status: 403, message: 'Forbidden' };
  }

  const topic = await topicModel.findById(topicId);
  if (!topic || topic.type_id !== typeId) {
    return { ok: false, status: 404, message: 'Topic not found' };
  }

  const topicName = String(body.topic_name || '').trim();
  const topicDetail = String(body.topic_detail || '').trim();
  const topicHeadline = typeId === '01-02'
    ? '-'
    : String(body.topic_headline || '').trim();

  if (!topicName || !topicDetail || (typeId !== '01-02' && !topicHeadline)) {
    return { ok: false, status: 400, message: 'Please fill all required fields' };
  }

  const ok = await topicModel.update(topicId, typeId, {
    topicName,
    topicHeadline,
    topicDetail,
  });
  return { ok, status: ok ? 200 : 500, message: ok ? 'OK' : 'Save failed' };
}

async function getDetail(adminId, typeId, topicId) {
  const access = await resolveAccess(adminId, typeId);
  if (!access.allowed) {
    return { allowed: false, topic: null, currentAdmin: null };
  }
  const [topic, currentAdmin] = await Promise.all([
    topicModel.findById(topicId),
    topicModel.findAdmin(adminId),
  ]);
  if (!topic || topic.type_id !== typeId) {
    return { allowed: true, topic: null, currentAdmin };
  }
  return { allowed: true, typeId, topic, currentAdmin };
}

module.exports = {
  buildList,
  toggleActive,
  remove,
  update,
  getDetail,
};
