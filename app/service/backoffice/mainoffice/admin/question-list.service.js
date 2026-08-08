const questionListModel = require('../../../../model/backoffice/mainoffice/admin/question-list.model');

const PER_PAGE = 20;

const RELATED_TYPES = {
  1: 'Passage',
  2: 'Picture',
  3: 'Sound',
};

function cleanInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? fallback : number;
}

function decodeText(value) {
  return String(value || '').replace(/&#039;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
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

function mapQuestions(questionRows, answerRows) {
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

  return questionRows.map(row => ({
    questionId: row.QUESTIONS_ID,
    questionText: decodeText(row.QUESTIONS_TEXT),
    active: row.IS_ACTIVE == 1,
    path: [
      row.TEST_NAME || '',
      row.LEVEL_NAME || '',
      row.SKILL_NAME || '',
      row.SSKILL_NAME || '',
      row.DETAIL_NAME || '',
    ].filter(Boolean).join(' » '),
    answers: answersByQuestion.get(Number(row.QUESTIONS_ID)) || [],
    description: row.DESCRIPTION_TEXT || '',
  }));
}

async function buildQuestionList(active, page) {
  const total = await questionListModel.countQuestions(active);
  const paging = pageInfo(total, page);
  const questions = await questionListModel.findQuestions(active, paging.offset, PER_PAGE);
  const answers = await questionListModel.findAnswers(questions.map(row => row.QUESTIONS_ID));
  return {
    mode: active ? 'show-questions' : 'hidden-questions',
    title: active ? 'Show Question List' : 'Hidden Question List',
    total,
    page: paging.page,
    allPages: paging.allPages,
    questions: mapQuestions(questions, answers),
  };
}

async function buildSearch(query) {
  const keyword = String(query.keyword || '').trim();
  const questionId = cleanInt(query.question_id, 0);
  const total = await questionListModel.countSearchQuestions(keyword, questionId);
  const paging = pageInfo(total, query.page);
  const questions = await questionListModel.searchQuestions(keyword, questionId, paging.offset, PER_PAGE);
  const answers = await questionListModel.findAnswers(questions.map(row => row.QUESTIONS_ID));
  return {
    mode: 'search',
    title: 'Search List',
    total,
    page: paging.page,
    allPages: paging.allPages,
    questions: mapQuestions(questions, answers),
  };
}

function cleanRelatedText(typeId, text) {
  const value = String(text || '');
  if (typeId === 2) return value.replace('/home/engtest/domains/engtest.net/public_html/', '/');
  if (typeId === 3) return value.replace('/home/engtest/domains/engtest.net/public_html/files/sound/', '').replace('.flv', '.mp3');
  return value;
}

async function buildRelatedList(active, typeId, page) {
  const safeTypeId = RELATED_TYPES[typeId] ? typeId : 1;
  const total = await questionListModel.countRelated(active, safeTypeId);
  const paging = pageInfo(total, page);
  const related = await questionListModel.findRelated(active, safeTypeId, paging.offset, PER_PAGE);
  const mappings = await questionListModel.findRelatedQuestionIds(related.map(row => row.GQUESTION_ID));
  const questionIdsByRelated = new Map();
  mappings.forEach((row) => {
    const key = Number(row.GQUESTION_ID);
    if (!questionIdsByRelated.has(key)) questionIdsByRelated.set(key, []);
    questionIdsByRelated.get(key).push(row.QUESTIONS_ID);
  });

  return {
    mode: active ? 'show-related' : 'hidden-related',
    title: active ? 'Show Relate Item List' : 'Hidden Relate Item List',
    total,
    page: paging.page,
    allPages: paging.allPages,
    relatedTypeId: safeTypeId,
    relatedTypeName: RELATED_TYPES[safeTypeId],
    related: related.map(row => ({
      relatedId: row.GQUESTION_ID,
      typeId: row.GQUESTION_TYPE_ID,
      typeName: RELATED_TYPES[row.GQUESTION_TYPE_ID] || '',
      referenceName: row.GQUESTION_NAME_REF || '',
      text: cleanRelatedText(Number(row.GQUESTION_TYPE_ID), row.GQUESTION_TEXT),
      active: row.IS_ACTIVE == 1,
      questionIds: questionIdsByRelated.get(Number(row.GQUESTION_ID)) || [],
    })),
  };
}

module.exports = {
  buildQuestionList,
  buildSearch,
  buildRelatedList,
};
