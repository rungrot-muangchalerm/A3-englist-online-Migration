const reasonModel = require('../../../../model/backoffice/mainoffice/admin/reason.model');

const SKILLS = [
  { id: 1, name: 'Reading' },
  { id: 2, name: 'Listening' },
  { id: 3, name: 'Semi-Speaking' },
  { id: 4, name: 'Semi-Writing' },
  { id: 5, name: 'Grammartic' },
  { id: 6, name: 'Cloze Test' },
  { id: 7, name: 'Vocab' },
];

const TEST_NAMES = {
  1: 'School',
  2: 'Collage',
  3: 'Professional',
  4: 'Everyone',
};

const LEVEL_NAMES = {
  1: 'Beginner',
  2: 'Lower Intermediate',
  3: 'Lower Intermediate',
  4: 'Upper Intermediate',
  5: 'Advance',
};

function cleanInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? fallback : number;
}

async function buildReasonList(query) {
  const skillId = cleanInt(query.skill_id, 0);
  const detailId = cleanInt(query.detail_id, 0);
  const quizId = cleanInt(query.quiz_id, 0);

  if (quizId) {
    const [question, answers, description] = await Promise.all([
      reasonModel.findQuestion(quizId),
      reasonModel.findAnswers(quizId),
      reasonModel.findDescription(quizId),
    ]);
    return {
      mode: 'quiz',
      skills: SKILLS,
      question: question ? {
        questionId: question.QUESTIONS_ID,
        questionText: String(question.QUESTIONS_TEXT || '').replace(/&#039;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        path: [
          question.TEST_NAME || '',
          question.LEVEL_NAME || '',
          question.SKILL_NAME || '',
          question.SSKILL_NAME || '',
          question.DETAIL_NAME || '',
        ].filter(Boolean).join(' » '),
      } : null,
      answers: answers.map(row => ({
        answerId: row.ANSWERS_ID,
        answerText: row.ANSWERS_TEXT || '',
        correct: row.ANSWERS_CORRECT == 1,
      })),
      description: description ? description.TEXT || '' : '',
    };
  }

  if (detailId) {
    const [detail, questions] = await Promise.all([
      reasonModel.findDetail(detailId),
      reasonModel.findQuestionsByDetail(detailId),
    ]);
    return {
      mode: 'detail',
      skills: SKILLS,
      detail: {
        detailId,
        detailName: detail ? detail.DETAIL_NAME : '',
        amount: questions.length,
      },
      questions: questions.map((row, index) => ({
        no: index + 1,
        questionId: row.QUESTIONS_ID,
        testName: TEST_NAMES[row.TEST_ID] || '',
        levelName: LEVEL_NAMES[row.LEVEL_ID] || '',
        skillId: row.SKILL_ID,
        skillName: row.SKILL_NAME || '',
        sskillId: row.SSKILL_ID,
        sskillName: row.SSKILL_NAME || '',
      })),
    };
  }

  const [details, counts] = await Promise.all([
    reasonModel.findDetails(skillId),
    skillId ? reasonModel.countQuestionsByDetail(skillId) : Promise.resolve([]),
  ]);
  const countMap = new Map();
  counts.forEach((row) => {
    countMap.set(`${row.DETAIL_ID}-${row.LEVEL_ID}`, Number(row.amount) || 0);
  });

  return {
    mode: skillId ? 'skill' : 'list',
    skills: SKILLS,
    selectedSkillId: skillId,
    selectedSkillName: (SKILLS.find(skill => skill.id === skillId) || {}).name || '',
    amount: details.length,
    details: details.map((row, index) => ({
      no: index + 1,
      detailId: row.DETAIL_ID,
      sskillId: row.SSKILL_ID,
      sskillName: row.SSKILL_NAME || '',
      detailCode: row.DETAIL_CODE || '',
      detailName: row.DETAIL_NAME || '',
      levels: [1, 2, 3, 4, 5].map(level => countMap.get(`${row.DETAIL_ID}-${level}`) || 0),
    })),
  };
}

module.exports = {
  buildReasonList,
};
