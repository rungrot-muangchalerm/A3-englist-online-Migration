const data = require('../../model/eol/etest.model');

function cleanInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

function cleanString(value, maxLen) {
  const s = String(value || '').trim();
  if (maxLen && s.length > maxLen) return s.slice(0, maxLen);
  return s;
}

async function buildExamList(memberId) {
  const exams = await data.listExams(memberId);
  const result = [];
  for (const exam of exams) {
    const amount = exam.exam_type == 2
      ? await data.countCustomQuestions(exam.exam_id)
      : await data.countSystemQuestions(exam.exam_id);
    result.push({
      examId: exam.exam_id,
      examName: exam.exam_name,
      testtime: exam.testtime,
      testType: exam.test_type,
      examType: exam.exam_type,
      createDate: data.formatDbDate(exam.create_date),
      active: exam.active == 1,
      amount,
    });
  }
  return result;
}

async function buildExamDetail(examId, memberId) {
  const exam = await data.getExam(examId, memberId);
  if (!exam) return null;
  const amount = exam.exam_type == 2
    ? await data.countCustomQuestions(exam.exam_id)
    : await data.countSystemQuestions(exam.exam_id);
  const allowGroups = await data.getAllowGroups(exam.exam_id);
  return {
    examId: exam.exam_id,
    examName: exam.exam_name,
    testtime: exam.testtime,
    testType: exam.test_type,
    examType: exam.exam_type,
    createDate: data.formatDbDate(exam.create_date),
    active: exam.active == 1,
    amount,
    allowGroups,
  };
}

async function buildEtestPage(memberId, query) {
  const examId = query.exam_id || '';
  const etestAction = query.etest_action || '';
  const list = await buildExamList(memberId);
  const groups = await data.getMemberGroups(memberId);
  let selectedExam = null;
  if (examId) {
    selectedExam = await buildExamDetail(examId, memberId);
  } else if (list.length >= 1) {
    selectedExam = await buildExamDetail(list[0].examId, memberId);
  }
  const topicSkills = [1, 2, 3, 4, 5, 7];
  let topics = [];
  if (etestAction === 'create') {
    for (const skillId of topicSkills) {
      const rows = await data.getTopics(skillId);
      topics = topics.concat(rows);
    }
  }
  return {
    list,
    selectedExam,
    groups,
    topics,
    etestAction,
  };
}

async function updateExam(memberId, body) {
  const examId = String(body.exam_id || '').trim();
  if (!examId) throw Object.assign(new Error('Exam ID is required'), { code: 'INVALID_INPUT' });

  const exam = await data.getExam(examId, memberId);
  if (!exam) throw Object.assign(new Error('Exam not found'), { code: 'NOT_FOUND' });

  const examName = cleanString(body.exam_name, 100);
  const testtime = cleanInt(body.testtime, 0);
  const testType = cleanInt(body.test_type, 1);
  const active = body.active === '1' || body.active === 1 || body.active === true ? 1 : 0;

  if (!examName) throw Object.assign(new Error('Exam name is required'), { code: 'INVALID_INPUT' });

  await data.updateExam(examId, memberId, { examName, testtime, testType, active });
  await data.deleteAllowGroups(examId);

  const allowGroups = Array.isArray(body.allowgroup) ? body.allowgroup : [body.allowgroup].filter(Boolean);
  for (const g of allowGroups) {
    await data.addAllowGroup(examId, cleanInt(g, 0));
  }

  return buildExamDetail(examId, memberId);
}

async function deleteExam(memberId, examId) {
  if (!examId) throw Object.assign(new Error('Exam ID is required'), { code: 'INVALID_INPUT' });
  const exam = await data.getExam(examId, memberId);
  if (!exam) throw Object.assign(new Error('Exam not found'), { code: 'NOT_FOUND' });
  await data.deleteExam(examId, memberId);
  return { examId };
}

async function createCustomExam(memberId, body) {
  const examName = cleanString(body.exam_name, 100);
  if (!examName) throw Object.assign(new Error('Exam name is required'), { code: 'INVALID_INPUT' });

  const questionText = cleanString(body.question, 1000);
  const choices = Array.isArray(body.choice) ? body.choice : [body.choice].filter((v) => v !== undefined);
  const correct = cleanInt(body.correct, -1);

  if (!questionText) throw Object.assign(new Error('Question is required'), { code: 'INVALID_INPUT' });
  if (choices.length !== 4) throw Object.assign(new Error('Please provide 4 choices'), { code: 'INVALID_INPUT' });
  if (correct < 0 || correct > 3) throw Object.assign(new Error('Please select correct answer'), { code: 'INVALID_INPUT' });

  const examId = await data.createExam(memberId, {
    examName,
    testtime: 0,
    testType: 1,
    examType: 2,
  });

  const questionId = await data.addCustomQuestion(examId, questionText);
  for (let i = 0; i < 4; i++) {
    await data.addCustomAnswer(questionId, cleanString(choices[i], 200), i === correct);
  }

  return buildExamDetail(examId, memberId);
}

async function addCustomQuestion(memberId, body) {
  const examId = String(body.exam_id || '').trim();
  if (!examId) throw Object.assign(new Error('Exam ID is required'), { code: 'INVALID_INPUT' });
  const exam = await data.getExam(examId, memberId);
  if (!exam) throw Object.assign(new Error('Exam not found'), { code: 'NOT_FOUND' });
  if (exam.exam_type != 2) throw Object.assign(new Error('Not a custom exam'), { code: 'INVALID_INPUT' });

  const questionText = cleanString(body.question, 1000);
  const choices = Array.isArray(body.choice) ? body.choice : [body.choice].filter((v) => v !== undefined);
  const correct = cleanInt(body.correct, -1);

  if (!questionText) throw Object.assign(new Error('Question is required'), { code: 'INVALID_INPUT' });
  if (choices.length !== 4) throw Object.assign(new Error('Please provide 4 choices'), { code: 'INVALID_INPUT' });
  if (correct < 0 || correct > 3) throw Object.assign(new Error('Please select correct answer'), { code: 'INVALID_INPUT' });

  const count = await data.countCustomQuestions(examId);
  if (count >= 30) throw Object.assign(new Error('Maximum 30 questions'), { code: 'INVALID_INPUT' });

  const questionId = await data.addCustomQuestion(examId, questionText);
  for (let i = 0; i < 4; i++) {
    await data.addCustomAnswer(questionId, cleanString(choices[i], 200), i === correct);
  }

  return buildExamDetail(examId, memberId);
}

async function createSystemExam(memberId, body) {
  const examName = cleanString(body.exam_name, 100);
  const testtime = cleanInt(body.testtime, 0);
  if (!examName) throw Object.assign(new Error('Exam name is required'), { code: 'INVALID_INPUT' });
  if (testtime <= 0) throw Object.assign(new Error('Test time is required'), { code: 'INVALID_INPUT' });

  const skillIds = Array.isArray(body.skill_id) ? body.skill_id : [body.skill_id].filter((v) => v !== undefined);
  const levels = Array.isArray(body.level) ? body.level : [body.level].filter((v) => v !== undefined);
  const topics = Array.isArray(body.topic) ? body.topic : [body.topic].filter((v) => v !== undefined);
  const nums = Array.isArray(body.num) ? body.num : [body.num].filter((v) => v !== undefined);

  if (skillIds.length === 0 || skillIds.length !== levels.length || skillIds.length !== topics.length || skillIds.length !== nums.length) {
    throw Object.assign(new Error('Invalid exam rows'), { code: 'INVALID_INPUT' });
  }

  let total = 0;
  for (const n of nums) {
    total += cleanInt(n, 0);
  }
  if (total < 10 || total > 30) {
    throw Object.assign(new Error('Total questions must be between 10 and 30'), { code: 'INVALID_INPUT' });
  }

  const examId = await data.createExam(memberId, {
    examName,
    testtime,
    testType: 1,
    examType: 1,
  });

  const selectedIds = new Set();
  for (let i = 0; i < skillIds.length; i++) {
    const skillId = cleanInt(skillIds[i], 0);
    const level = cleanInt(levels[i], 0);
    const topic = cleanInt(topics[i], 0);
    const want = cleanInt(nums[i], 0);
    if (!skillId || !level || !topic || want <= 0) continue;

    let picked = [];
    let currentLevel = level;
    let remaining = want;
    while (remaining > 0 && currentLevel >= 1 && currentLevel <= 5) {
      const available = await data.countAvailableQuestions(1, skillId, currentLevel, topic);
      const limit = Math.min(remaining, available);
      if (limit > 0) {
        const rows = await data.getRandomQuestions(1, skillId, currentLevel, topic, limit);
        for (const row of rows) {
          if (!selectedIds.has(row.QUESTIONS_ID)) {
            picked.push(row.QUESTIONS_ID);
            selectedIds.add(row.QUESTIONS_ID);
          }
        }
      }
      remaining = want - picked.length;
      if (remaining > 0) {
        if (currentLevel < level) currentLevel -= 1;
        else currentLevel += 1;
        if (currentLevel > 5) { currentLevel = level - 1; }
        if (currentLevel === level) break;
      }
    }

    for (const qid of picked) {
      await data.addSystemQuestion(examId, qid);
    }
  }

  return buildExamDetail(examId, memberId);
}

module.exports = {
  buildEtestPage,
  updateExam,
  deleteExam,
  createCustomExam,
  addCustomQuestion,
  createSystemExam,
};
