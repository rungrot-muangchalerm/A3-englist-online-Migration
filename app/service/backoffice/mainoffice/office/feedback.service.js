const feedbackModel = require('../../../../model/backoffice/mainoffice/office/feedback.model');
const permissionModel = require('../../../../model/backoffice/mainoffice/permission.model');

const PER_PAGE = 10;
const TYPE_ID = '02-04';

function normalizeMenu(menu) {
  return Number(menu) === 2 ? 2 : 1;
}

function labels(menu) {
  if (menu === 2) {
    return {
      headerId: 'Feedback ID',
      headerText: 'Feedback Detail',
      addButton: 'Add Feedback',
      fieldName: 'feedback_detail',
      fieldLabel: 'Feedback Detail',
      deleteName: 'Feedback',
      rows: 2,
    };
  }
  return {
    headerId: 'School ID',
    headerText: 'School Name',
    addButton: 'Add Organization',
    fieldName: 'school_name',
    fieldLabel: 'School Name',
    deleteName: 'Organization',
    rows: 1,
  };
}

async function hasAccess(adminId) {
  const permissions = await permissionModel.findByAdmin(adminId);
  return permissions.includes(TYPE_ID);
}

async function buildList(adminId, menuParam, pageParam) {
  if (!(await hasAccess(adminId))) {
    return { allowed: false };
  }

  const menu = normalizeMenu(menuParam);
  const safePage = Math.max(parseInt(pageParam, 10) || 1, 1);
  const total = await feedbackModel.count(menu);
  const allPages = Math.max(Math.ceil(total / PER_PAGE), 1);
  const page = Math.min(safePage, allPages);
  const rows = await feedbackModel.list(menu, (page - 1) * PER_PAGE, PER_PAGE);

  return {
    allowed: true,
    typeId: TYPE_ID,
    menu,
    labels: labels(menu),
    rows: rows.map(row => ({
      ...row,
      activeState: Number(row.is_active) === 0
        ? { color: 'orange', label: 'Hidden' }
        : { color: '77ff77', label: 'Show' },
    })),
    page,
    allPages,
  };
}

async function add(adminId, menuParam, body) {
  if (!(await hasAccess(adminId))) {
    return { ok: false, status: 403, message: 'Forbidden' };
  }
  const menu = normalizeMenu(menuParam);
  const label = labels(menu);
  const text = String(body[label.fieldName] || '').trim();
  if (!text) {
    return { ok: false, status: 400, message: `Please fill ${label.fieldLabel}` };
  }
  const id = await feedbackModel.add(menu, text);
  return { ok: true, status: 201, data: { id } };
}

async function toggle(adminId, menuParam, id) {
  if (!(await hasAccess(adminId))) {
    return { ok: false, status: 403 };
  }
  const ok = await feedbackModel.toggle(normalizeMenu(menuParam), id);
  return { ok, status: ok ? 200 : 404 };
}

async function remove(adminId, menuParam, id) {
  if (!(await hasAccess(adminId))) {
    return { ok: false, status: 403 };
  }
  const ok = await feedbackModel.remove(normalizeMenu(menuParam), id);
  return { ok, status: ok ? 200 : 404 };
}

module.exports = {
  buildList,
  add,
  toggle,
  remove,
};
