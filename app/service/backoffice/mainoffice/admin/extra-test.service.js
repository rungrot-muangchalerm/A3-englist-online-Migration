const extraTestModel = require('../../../../model/backoffice/mainoffice/admin/extra-test.model');

const PER_PAGE = 20;

function cleanInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? fallback : number;
}

function decodeText(value) {
  return String(value || '').replace(/&#039;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function formatDate(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 16);
  return String(value).replace(' ', 'T').slice(0, 16);
}

function pageInfo(total, page) {
  const allPages = Math.max(Math.ceil(total / PER_PAGE), 1);
  const currentPage = Math.min(Math.max(cleanInt(page, 1), 1), allPages);
  return {
    page: currentPage,
    allPages,
    offset: (currentPage - 1) * PER_PAGE,
  };
}

async function buildList(page) {
  const total = await extraTestModel.countTests();
  const paging = pageInfo(total, page);
  const rows = await extraTestModel.findTests(paging.offset, PER_PAGE);
  return {
    total,
    page: paging.page,
    allPages: paging.allPages,
    tests: rows.map(row => ({
      testId: row.ETEST_ID,
      name: row.ETEST_NAME || '',
      time: row.ETEST_TIME || 0,
      free: row.IS_FREE == 1,
      est: row.IS_EST == 1,
      active: row.IS_ACTIVE == 1,
      quizAmount: row.quiz_amount || 0,
    })),
  };
}

async function buildDetail(testId) {
  const test = await extraTestModel.findTest(testId);
  if (!test) return { test: null, questions: [] };
  const questionRows = await extraTestModel.findMappedQuestions(testId);
  const answerRows = await extraTestModel.findAnswers(questionRows.filter(row => row.QUESTIONS_ID).map(row => row.QUESTIONS_ID));
  const answersByQuestion = new Map();
  answerRows.forEach((row) => {
    const key = Number(row.QUESTIONS_ID);
    if (!answersByQuestion.has(key)) answersByQuestion.set(key, []);
    answersByQuestion.get(key).push({
      answerId: row.ANSWERS_ID,
      answerText: decodeText(row.ANSWERS_TEXT),
      correct: row.ANSWERS_CORRECT == 1,
    });
  });

  return {
    test: {
      testId: test.ETEST_ID,
      name: test.ETEST_NAME || '',
      time: test.ETEST_TIME || 0,
      retest: test.RE_TEST || 0,
      start: formatDate(test.start),
      stop: formatDate(test.stop),
      quizAmount: test.quiz_amount || 0,
      free: test.IS_FREE == 1,
      est: test.IS_EST == 1,
      active: test.IS_ACTIVE == 1,
    },
    questions: questionRows.map((row, index) => ({
      no: index + 1,
      questionId: row.QUESTIONS_ID || '',
      questionText: row.QUESTIONS_ID ? decodeText(row.QUESTIONS_TEXT) : '- Can\'t Found Question Detail -',
      path: row.QUESTIONS_ID ? [
        row.TEST_NAME || '',
        row.LEVEL_NAME || '',
        row.SKILL_NAME || '',
        row.SSKILL_NAME || '',
        row.DETAIL_NAME || '',
      ].filter(Boolean).join(' » ') : '',
      answers: answersByQuestion.get(Number(row.QUESTIONS_ID)) || [],
      found: Boolean(row.QUESTIONS_ID),
    })),
  };
}

module.exports = {
  buildList,
  buildDetail,
};
