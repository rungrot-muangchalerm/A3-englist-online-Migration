const examModel = require('../../../../model/backoffice/mainoffice/office/eol-contest-exam.model');
const permissionModel = require('../../../../model/backoffice/mainoffice/permission.model');

const TYPE_ID = '18-01';
const PER_PAGE = 20;

function cleanInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

async function resolveAccess(adminId) {
  const permissions = await permissionModel.findByAdmin(adminId);
  return {
    allowed: permissions.includes(TYPE_ID),
    isAdmin: permissions.includes('00-02'),
  };
}

function toExamDto(exam) {
  if (!exam) return null;
  return {
    examId: exam.exam_id,
    examName: exam.exam_name || '',
    testtime: exam.testtime || 0,
    testType: exam.test_type || 1,
    examType: exam.exam_type || 1,
    createBy: exam.create_by,
    createDate: exam.create_date,
    active: exam.active == 1,
    public: exam.public == 1,
    creatorName: exam.public == 1 ? 'Admin' : (exam.fname || exam.user || '-'),
    creatorUser: exam.user || '',
    amount: exam.amount || 0,
  };
}

async function buildList(adminId, page, selectedExamId) {
  const access = await resolveAccess(adminId);
  if (!access.allowed) return { allowed: false };

  const total = await examModel.countExams();
  const allPages = Math.max(Math.ceil(total / PER_PAGE), 1);
  const currentPage = Math.min(Math.max(cleanInt(page, 1), 1), allPages);
  const exams = await examModel.findExams((currentPage - 1) * PER_PAGE, PER_PAGE);
  const list = exams.map(toExamDto);
  const selectedId = selectedExamId || (list[0] ? list[0].examId : 0);
  const selectedExam = selectedId ? await buildDetailData(selectedId) : null;

  return {
    allowed: true,
    typeId: TYPE_ID,
    exams: list,
    selectedExam,
    page: currentPage,
    allPages,
    isAdmin: access.isAdmin,
  };
}

async function buildDetailData(examId) {
  const exam = await examModel.findExam(examId);
  if (!exam) return null;
  const groups = await examModel.findAllowGroups(examId, exam.create_by);
  const noneGroup = await examModel.hasNoneGroup(examId);
  return {
    ...toExamDto(exam),
    noneGroup,
    groups: groups.map(group => ({
      typeId: group.type_id,
      name: group.name,
      allowed: Boolean(group.allow_id),
    })),
  };
}

async function getDetail(adminId, examId) {
  const access = await resolveAccess(adminId);
  if (!access.allowed) return { allowed: false, exam: null };
  return { allowed: true, exam: await buildDetailData(examId) };
}

async function update(adminId, examId, body) {
  const access = await resolveAccess(adminId);
  if (!access.allowed) return { status: 403, ok: false, message: 'Forbidden' };

  const exam = await examModel.findExam(examId);
  if (!exam) return { status: 404, ok: false, message: 'Exam not found' };

  const examName = String(body.exam_name || '').trim();
  const testtime = Math.max(cleanInt(body.testtime, 0), 0);
  const testType = cleanInt(body.test_type, 1);
  const active = body.active === '1' || body.active === 1 || body.active === true ? 1 : 0;

  if (!examName) return { status: 400, ok: false, message: 'Please fill exam name' };
  if (![1, 2].includes(testType)) return { status: 400, ok: false, message: 'Invalid test type' };

  await examModel.updateExam(examId, { examName, testtime, testType, active });

  const rawGroups = Array.isArray(body.allowgroup)
    ? body.allowgroup
    : [body.allowgroup].filter(value => value !== undefined && value !== null);
  const groups = [...new Set(rawGroups.map(value => cleanInt(value, 0)))];
  await examModel.replaceAllowGroups(examId, groups);

  return { status: 200, ok: true, data: await buildDetailData(examId) };
}

async function remove(adminId, examId) {
  const access = await resolveAccess(adminId);
  if (!access.allowed || !access.isAdmin) return { status: 403, ok: false, message: 'Forbidden' };

  const exam = await examModel.findExam(examId);
  if (!exam) return { status: 404, ok: false, message: 'Exam not found' };

  await examModel.deleteExam(examId);
  return { status: 200, ok: true };
}

module.exports = {
  buildList,
  getDetail,
  update,
  remove,
};
